import { useState } from 'react';
import { AlertTriangle, Sparkles, Check, ChevronRight } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function IncidentCenter() {
  const { incidents, resolveIncident } = useTelemetry();
  const [selectedId, setSelectedId] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeRca, setActiveRca] = useState(null);

  const triggerRca = (id) => {
    setSelectedId(id);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      if (id === 'INC-HL7-402') {
        setActiveRca(`### Automated Gemini Clinical RCA
Based on the telemetry metrics buffer, \`emr-database-main\` experienced a deadlock due to un-indexed HIPAA audit log queries scanning 40M patient records.

**Action Required:**
1. Access the main records DB: \`ssh administrator@emr-database-main\`
2. Apply the missing query index: \`db.audit_logs.createIndex({ "patientId": 1 })\`
3. Force restart the HL7 message gateway thread: \`systemctl restart hl7-broker-daemon.service\``);
      } else {
        setActiveRca(`### Automated Gemini Clinical RCA
The PACS imaging server \`pacs-imaging-mri\` experienced memory saturation during a high-resolution 3D CT scan batch processing run.

**Action Required:**
1. SSH into the storage cluster: \`ssh administrator@pacs-imaging-mri\`
2. Flush the local DICOM spooler buffer: \`rm -rf /var/spool/dicom/tmp/*\`
3. Restart the PACS transmission broker: \`systemctl restart pacs-tx-daemon.service\``);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Incident Center</h2>
          <p className="text-gray-400">Track alerts and run AI Root Cause Analysis (RCA)</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/3 glass-panel rounded-xl flex flex-col overflow-hidden">
           <div className="p-4 border-b border-white/10 font-bold bg-black/40">Incident Timeline</div>
           <div className="flex-1 overflow-auto p-2 space-y-2">
             {incidents.map(inc => (
               <div key={inc.id} className={`p-4 rounded-lg border cursor-pointer transition-colors ${inc.status === 'active' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">{inc.id}</span>
                    <span className="text-xs text-gray-500">{inc.time}</span>
                 </div>
                 <div className="text-sm font-medium mb-1">{inc.host}</div>
                 <div className="text-xs text-red-400 bg-red-400/10 inline-block px-2 py-0.5 rounded">{inc.rule}</div>
                 
                 <div className="mt-4 flex gap-2">
                    {inc.status === 'active' ? (
                      <button 
                        onClick={() => triggerRca(inc.id)}
                        disabled={analyzing}
                        className="flex-1 text-xs bg-gradient-to-r from-purple-600 to-primary hover:opacity-90 py-1.5 rounded font-bold flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      >
                         <Sparkles className="w-3 h-3" /> {analyzing ? 'Analyzing...' : 'Gemini RCA'}
                      </button>
                    ) : (
                      <div className="text-xs text-green-500 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> Resolved
                      </div>
                    )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="flex-1 glass-panel rounded-xl p-6 overflow-auto">
           {activeRca ? (
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-bold border-b border-white/10 pb-4">
                   <Sparkles className="w-6 h-6 text-purple-400" /> AI Diagnostic Report
                </div>
                <div className="prose prose-invert prose-purple max-w-none">
                  {/* Manually render basic markdown for demo since react-markdown isn't installed */}
                  {activeRca.split('\n').map((line, i) => {
                    if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-white mt-4">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('**')) return <p key={i} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>;
                    if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) return <div key={i} className="ml-4 my-1 text-gray-300 font-mono text-sm bg-black/40 p-2 rounded border border-white/10">{line}</div>;
                    return <p key={i} className="text-gray-400">{line}</p>;
                  })}
                </div>
                <div className="pt-6">
                   <button 
                     onClick={() => { resolveIncident(selectedId); setActiveRca(null); }}
                     className="bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded flex items-center gap-2"
                   >
                     <Check className="w-4 h-4" /> Mark Incident Resolved
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <AlertTriangle className="w-16 h-16 mb-4 opacity-20" />
                <p>Select an active incident and click "Gemini RCA" to generate a diagnostic report.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
