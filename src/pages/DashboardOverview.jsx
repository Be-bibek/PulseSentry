import { useTelemetry } from '../context/TelemetryContext';
import { Server, Zap, CheckCircle, AlertTriangle, Heart, Activity } from 'lucide-react';
import AgentSimulator from '../components/AgentSimulator';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const { hosts, patients, incidents } = useTelemetry();

  const activeAlerts = incidents.filter(i => i.status === 'active').length;
  const criticalPatients = patients.filter(p => p.status === 'danger').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-muted text-sm font-medium mb-1">Clinical Uptime</div>
           <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
             99.98% <CheckCircle className="w-6 h-6 text-emerald-500" />
           </div>
        </div>
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-muted text-sm font-medium mb-1">Clinical IoT Agents</div>
           <div className="text-3xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
             {hosts.length} <Heart className="w-6 h-6 text-emerald-500 animate-pulse" />
           </div>
        </div>
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-muted text-sm font-medium mb-1">Active Incidents</div>
           <div className={`text-3xl font-bold flex items-center gap-2 ${activeAlerts > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
             {activeAlerts} <AlertTriangle className="w-6 h-6" />
           </div>
        </div>
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-muted text-sm font-medium mb-1">ICU Patients Status</div>
           <div className={`text-3xl font-bold flex items-center gap-2 ${criticalPatients > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-purple-600 dark:text-purple-400'}`}>
             {patients.length} <Activity className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Medical Devices & Servers</h2>
            <Link to="/app/hms" className="text-emerald-600 dark:text-emerald-400 hover:opacity-80 text-xs font-semibold flex items-center gap-1">
              Go to HMS Portal <Zap className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {hosts.map(h => (
              <Link to={`/app/host/${h.id}`} key={h.id} className="glass-panel p-5 rounded-xl hover:bg-foreground/5 transition-colors flex items-center justify-between cursor-pointer border border-border hover:border-emerald-500/50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${h.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'}`}></div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground/95">{h.hostname}</h3>
                    <div className="text-xs text-muted">{h.type} • HL7 Listener Enabled</div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs text-muted mb-1">CPU Load</div>
                    <div className="w-32 bg-foreground/10 rounded-full h-2">
                       <div className={`h-2 rounded-full ${h.cpu > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${h.cpu}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1">Memory</div>
                    <div className="w-32 bg-foreground/10 rounded-full h-2">
                       <div className="h-2 rounded-full bg-purple-500" style={{width: `${h.mem}%`}}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Uptime Simulator</h2>
          <AgentSimulator />
        </div>
      </div>
    </div>
  );
}

