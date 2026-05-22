import { useParams } from 'react-router-dom';
import { Cpu, MemoryStick, Heart, Terminal } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function HostMetrics() {
  const { hostId } = useParams();
  const { hosts } = useTelemetry();

  // Resolve host details from global telemetry state
  const host = hosts.find(h => h.id === hostId) || hosts[0];
  const hostname = host?.hostname || 'emr-database-main';
  const type = host?.type || 'Electronic Medical Records Core';

  // Mock net speed alongside live CPU/memory
  const metrics = { cpu: host?.cpu || 32, mem: host?.mem || 58, net: 482 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{hostname}</h2>
          <p className="text-muted">Device Type: {type} • HL7 Connected</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded text-sm font-medium transition-colors">Reboot HL7 Agent</button>
           <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors">Configure Vitals</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Chart Panel */}
        <div className="glass-panel p-5 rounded-xl flex flex-col h-72">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold flex items-center gap-2"><Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> CPU Utilization</h3>
             <span className="text-xl font-bold text-foreground">{metrics.cpu}%</span>
          </div>
          <div className="flex-1 border-b border-l border-border relative">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,55 L20,60 L40,40 L60,80 L80,20 L100,45 L100,100 Z" fill="rgba(16, 185, 129, 0.1)" />
               <path d="M0,55 L20,60 L40,40 L60,80 L80,20 L100,45" fill="none" stroke="#10b981" strokeWidth="2" className="chart-line" />
             </svg>
          </div>
        </div>

        {/* Memory Chart Panel */}
        <div className="glass-panel p-5 rounded-xl flex flex-col h-72">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold flex items-center gap-2"><MemoryStick className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Memory (Buffer Queue)</h3>
             <span className="text-xl font-bold text-foreground">{metrics.mem}%</span>
          </div>
          <div className="flex-1 border-b border-l border-border relative">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,40 L20,40 L40,42 L60,45 L80,62 L100,60 L100,100 Z" fill="rgba(168, 85, 247, 0.15)" />
               <path d="M0,40 L20,40 L40,42 L60,45 L80,62 L100,60" fill="none" stroke="#a855f7" strokeWidth="2" className="chart-line" />
             </svg>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-64 border border-border">
        <div className="bg-slate-900 px-4 py-2 border-b border-border flex items-center gap-2">
           <Terminal className="w-4 h-4 text-gray-400" />
           <span className="text-sm font-mono text-gray-300">Live Clinical HL7 / DICOM Log Stream</span>
        </div>
        <div className="p-4 font-mono text-sm text-green-400/80 space-y-1 overflow-auto flex-1 bg-slate-950">
          <div>[17:48:01] INFO  HL7 listener socket initialized on port 8080</div>
          <div>[17:48:04] DEBUG Ingested EMR Patient record ID #94821 (Success)</div>
          <div>[17:48:07] DEBUG DICOM image spooler flush OK (4.8MB sent to PACS)</div>
          <div className="text-yellow-400">[17:48:12] WARN  DICOM transmission latency spike detected on port 104 (520ms)</div>
          <div>[17:48:15] DEBUG Pushed telemetry payload to PulseSentry (CPU: {metrics.cpu}%)</div>
        </div>
      </div>
    </div>
  );
}

