import { useParams } from 'react-router-dom';
import { Cpu, MemoryStick, Activity, Terminal } from 'lucide-react';

export default function HostMetrics() {
  const { hostId } = useParams();

  // Mock data for display
  const metrics = { cpu: 45, mem: 62, net: 120 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">web-prod-01</h2>
          <p className="text-gray-400">Host ID: {hostId} • Connected</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm font-medium">Reboot Agent</button>
           <button className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded text-sm font-medium">Configure Alerts</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Chart Panel */}
        <div className="glass-panel p-5 rounded-xl flex flex-col h-72">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold flex items-center gap-2"><Cpu className="w-5 h-5 text-primary" /> CPU Utilization</h3>
             <span className="text-xl font-bold">{metrics.cpu}%</span>
          </div>
          <div className="flex-1 border-b border-l border-gray-700 relative">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,55 L20,60 L40,40 L60,80 L80,20 L100,45 L100,100 Z" fill="rgba(59, 130, 246, 0.2)" />
               <path d="M0,55 L20,60 L40,40 L60,80 L80,20 L100,45" fill="none" stroke="#3b82f6" strokeWidth="2" className="chart-line" />
             </svg>
          </div>
        </div>

        {/* Memory Chart Panel */}
        <div className="glass-panel p-5 rounded-xl flex flex-col h-72">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold flex items-center gap-2"><MemoryStick className="w-5 h-5 text-purple-500" /> Memory Usage</h3>
             <span className="text-xl font-bold">{metrics.mem}%</span>
          </div>
          <div className="flex-1 border-b border-l border-gray-700 relative">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,40 L20,40 L40,42 L60,45 L80,62 L100,60 L100,100 Z" fill="rgba(168, 85, 247, 0.2)" />
               <path d="M0,40 L20,40 L40,42 L60,45 L80,62 L100,60" fill="none" stroke="#a855f7" strokeWidth="2" className="chart-line" />
             </svg>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-64">
        <div className="bg-black/60 px-4 py-2 border-b border-white/10 flex items-center gap-2">
           <Terminal className="w-4 h-4 text-gray-400" />
           <span className="text-sm font-mono text-gray-300">Live Agent Log Stream</span>
        </div>
        <div className="p-4 font-mono text-sm text-green-400/80 space-y-1 overflow-auto flex-1 bg-[#050505]">
          <div>[10:42:01] INFO  Agent initialized, collecting metrics...</div>
          <div>[10:42:04] DEBUG Pushed CPU payload (45%)</div>
          <div>[10:42:07] DEBUG Pushed Mem payload (62%)</div>
          <div className="text-yellow-400">[10:42:12] WARN  I/O latency spike detected on /dev/sda1 (42ms)</div>
          <div>[10:42:15] DEBUG Pushed CPU payload (46%)</div>
        </div>
      </div>
    </div>
  );
}
