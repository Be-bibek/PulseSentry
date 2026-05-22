import { useState, useEffect } from 'react';
import { Server, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import AgentSimulator from '../components/AgentSimulator';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const [hosts, setHosts] = useState([
    { id: '1', hostname: 'web-prod-01', status: 'online', cpu: 45, mem: 60 },
    { id: '2', hostname: 'db-master-01', status: 'incident', cpu: 95, mem: 88 },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-gray-400 text-sm font-medium mb-1">Workspace Health</div>
           <div className="text-3xl font-bold text-green-400 flex items-center gap-2">
             98.2% <CheckCircle className="w-6 h-6" />
           </div>
        </div>
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-gray-400 text-sm font-medium mb-1">Active Agents</div>
           <div className="text-3xl font-bold flex items-center gap-2">
             2 <Server className="w-6 h-6 text-primary" />
           </div>
        </div>
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-gray-400 text-sm font-medium mb-1">Incidents (24h)</div>
           <div className="text-3xl font-bold text-red-400 flex items-center gap-2">
             1 <AlertTriangle className="w-6 h-6" />
           </div>
        </div>
        <div className="glass-panel p-6 rounded-xl">
           <div className="text-gray-400 text-sm font-medium mb-1">Metrics/sec</div>
           <div className="text-3xl font-bold text-purple-400 flex items-center gap-2">
             ~124 <Zap className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Monitored Hosts</h2>
          <div className="grid grid-cols-1 gap-4">
            {hosts.map(h => (
              <Link to={`/app/host/${h.id}`} key={h.id} className="glass-panel p-5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer border border-white/5 hover:border-primary/50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${h.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'}`}></div>
                  <div>
                    <h3 className="font-bold text-lg">{h.hostname}</h3>
                    <div className="text-xs text-gray-500">Ubuntu 22.04 LTS • 8 Cores • 32GB RAM</div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">CPU Load</div>
                    <div className="w-32 bg-black/50 rounded-full h-2">
                       <div className={`h-2 rounded-full ${h.cpu > 80 ? 'bg-red-500' : 'bg-primary'}`} style={{width: `${h.cpu}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Memory</div>
                    <div className="w-32 bg-black/50 rounded-full h-2">
                       <div className="h-2 rounded-full bg-purple-500" style={{width: `${h.mem}%`}}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Development Tools</h2>
          <AgentSimulator />
        </div>
      </div>
    </div>
  );
}
