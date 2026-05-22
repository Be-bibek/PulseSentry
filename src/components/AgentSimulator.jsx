import { useState } from 'react';
import { Play, Square, Cpu, MemoryStick } from 'lucide-react';

export default function AgentSimulator() {
  const [running, setRunning] = useState(false);
  const [anomaly, setAnomaly] = useState(null);

  return (
    <div className="glass-panel p-6 rounded-xl border border-dashed border-gray-600 bg-gray-900/50">
      <div className="mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
           PulseAgent Simulator
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Use this panel to simulate a live host reporting metrics to the WebSocket server if you don't want to run the Node.js agent locally.
        </p>
      </div>

      <div className="space-y-4">
        {!running ? (
          <button 
            onClick={() => setRunning(true)}
            className="w-full py-2 rounded bg-primary hover:bg-primary/80 text-white font-semibold flex justify-center items-center gap-2"
          >
            <Play className="w-4 h-4" /> Start Simulated Agent
          </button>
        ) : (
          <button 
            onClick={() => { setRunning(false); setAnomaly(null); }}
            className="w-full py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-semibold flex justify-center items-center gap-2 border border-gray-600"
          >
            <Square className="w-4 h-4" /> Stop Agent
          </button>
        )}

        {running && (
          <div className="p-3 bg-black/50 rounded-lg space-y-3">
             <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 animate-pulse font-bold">Streaming metrics...</span>
             </div>
             
             <div className="border-t border-white/10 pt-3">
                <div className="text-xs font-semibold mb-2 text-gray-400">Trigger Anomaly</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setAnomaly('cpu')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold border flex items-center justify-center gap-1 ${anomaly === 'cpu' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <Cpu className="w-3 h-3" /> Spike CPU
                  </button>
                  <button 
                    onClick={() => setAnomaly('mem')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold border flex items-center justify-center gap-1 ${anomaly === 'mem' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <MemoryStick className="w-3 h-3" /> Mem Leak
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
