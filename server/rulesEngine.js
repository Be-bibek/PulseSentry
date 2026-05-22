import { AlertRule, AlertHistory, Host } from './models.js';

// In-memory buffer storing the last 5 minutes of metrics for active evaluation
const metricsBuffer = new Map(); // Key: hostId, Value: array of metric snapshots

export const ingestMetric = (workspaceId, hostId, metrics) => {
    if (!metricsBuffer.has(hostId)) {
        metricsBuffer.set(hostId, []);
    }
    const hostBuffer = metricsBuffer.get(hostId);
    hostBuffer.push({ timestamp: Date.now(), ...metrics });
    
    // Keep only last 20 entries (approx 100 seconds if 5s intervals)
    if (hostBuffer.length > 20) {
        hostBuffer.shift();
    }
};

export const startRulesEngine = (io) => {
    // Run evaluation loop every 10 seconds
    setInterval(async () => {
        try {
            if (!AlertRule.find) return; // Mock fallback safety
            
            const activeRules = await AlertRule.find({ active: true });
            
            for (const [hostId, hostMetrics] of metricsBuffer.entries()) {
                if (hostMetrics.length === 0) continue;
                
                const latest = hostMetrics[hostMetrics.length - 1];
                const host = await Host.findById(hostId);
                if (!host) continue;

                for (const rule of activeRules) {
                    if (rule.workspaceId.toString() !== host.workspaceId.toString()) continue;
                    
                    let valueToEvaluate = null;
                    if (rule.metric === 'cpu') valueToEvaluate = latest.cpu?.currentLoad;
                    if (rule.metric === 'memory') valueToEvaluate = (latest.mem?.active / latest.mem?.total) * 100;
                    
                    if (valueToEvaluate === null) continue;

                    let conditionMet = false;
                    if (rule.condition === '>' && valueToEvaluate > rule.threshold) conditionMet = true;
                    if (rule.condition === '<' && valueToEvaluate < rule.threshold) conditionMet = true;

                    if (conditionMet) {
                        // In a real system we'd check durationMs, but for showcase we trigger immediately
                        
                        // Check if an active alert already exists to prevent spam
                        const existingAlert = await AlertHistory.findOne({
                            hostId, ruleId: rule._id, status: 'active'
                        });

                        if (!existingAlert) {
                            const newAlert = new AlertHistory({
                                workspaceId: rule.workspaceId,
                                hostId,
                                ruleId: rule._id,
                                message: `Threshold Exceeded: ${rule.metric.toUpperCase()} is at ${valueToEvaluate.toFixed(2)}% (Rule: > ${rule.threshold}%)`,
                                metricsSnapshot: latest
                            });
                            await newAlert.save();
                            
                            // Real-time Push via Socket.io to clients in that workspace room
                            io.to(rule.workspaceId.toString()).emit('new-alert', {
                                alert: newAlert,
                                hostname: host.hostname
                            });
                            console.log(`[AlertEngine] Triggered alert for ${host.hostname} - ${rule.metric}`);
                        }
                    } else {
                        // Auto-resolve active alerts if condition is no longer met
                        const existingAlert = await AlertHistory.findOne({
                            hostId, ruleId: rule._id, status: 'active'
                        });
                        
                        if (existingAlert) {
                            existingAlert.status = 'resolved';
                            existingAlert.resolvedAt = new Date();
                            await existingAlert.save();
                            io.to(rule.workspaceId.toString()).emit('alert-resolved', { alertId: existingAlert._id });
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Rules Engine Error:', err.message);
        }
    }, 10000);
};
