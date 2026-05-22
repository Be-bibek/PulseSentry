import { io } from 'socket.io-client';
import si from 'systeminformation';

// Configuration
// In production, these would be read from process.env
const WORKSPACE_ID = process.env.PULSE_WORKSPACE_ID || 'mock_ws';
const HOST_ID = process.env.PULSE_HOST_ID || 'mock_host';
const SERVER_URL = process.env.PULSE_SERVER_URL || 'http://localhost:5000';

const socket = io(SERVER_URL);

socket.on('connect', () => {
    console.log(`PulseAgent connected to ${SERVER_URL}`);
    console.log(`Monitoring Host: ${HOST_ID} | Workspace: ${WORKSPACE_ID}`);
    
    // Start metric collection loop (every 3 seconds)
    setInterval(collectAndSendMetrics, 3000);
});

async function collectAndSendMetrics() {
    try {
        const [cpu, mem, os, currentLoad] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.osInfo(),
            si.currentLoad()
        ]);

        const metrics = {
            cpu: {
                currentLoad: currentLoad.currentLoad,
                user: currentLoad.currentLoadUser,
                system: currentLoad.currentLoadSystem
            },
            mem: {
                total: mem.total,
                free: mem.free,
                used: mem.used,
                active: mem.active
            },
            uptime: si.time().uptime
        };

        // Emit to server
        socket.emit('agent-metrics', {
            workspaceId: WORKSPACE_ID,
            hostId: HOST_ID,
            metrics
        });
        
    } catch (err) {
        console.error('PulseAgent Error collecting metrics:', err.message);
    }
}

socket.on('disconnect', () => {
    console.log('PulseAgent disconnected from server. Retrying...');
});
