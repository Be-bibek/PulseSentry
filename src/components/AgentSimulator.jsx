import { useTelemetry } from '../context/TelemetryContext';
import { Play, Square, Cpu, MemoryStick, Heart } from 'lucide-react';

export default function AgentSimulator() {
  const { connected, toggleConnection, anomaly, triggerAnomaly } = useTelemetry();

  return (
    <div className="glass-panel p-6 rounded-xl border border-dashed border-emerald-500 bg-emerald-500/5">
      <div className="mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
           <Heart className="w-5 h-5 text-emerald-500 animate-pulse" /> Clinical Telemetry Simulator
        </h3>
        <p className="text-xs text-muted mt-1">
          Use this control deck to simulate a medical instrument (e.g., MRI machine or Lab analyzer) streaming vital telemetry to the Express server.
        </p>
      </div>

      <div className="space-y-4">
        {!connected ? (
          <button 
            onClick={toggleConnection}
            className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex justify-center items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" /> Connect Instrument
          </button>
        ) : (
          <button 
            onClick={toggleConnection}
            className="w-full py-2 rounded bg-foreground/10 hover:bg-foreground/20 text-foreground font-semibold flex justify-center items-center gap-2 border border-border transition-colors"
          >
            <Square className="w-4 h-4" /> Disconnect Instrument
          </button>
        )}

        {connected && (
          <div className="p-3 bg-foreground/5 rounded-lg space-y-3">
             <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 animate-pulse font-bold">HL7 Socket Streaming...</span>
             </div>
             
             <div className="border-t border-border pt-3">
                <div className="text-xs font-semibold mb-2 text-muted">Trigger Device Stress Test</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerAnomaly(anomaly === 'cpu' ? null : 'cpu')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold border flex items-center justify-center gap-1 transition-all ${anomaly === 'cpu' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50' : 'bg-card border-border hover:bg-foreground/5 text-foreground'}`}
                  >
                    <Cpu className="w-3 h-3" /> DICOM Burst
                  </button>
                  <button 
                    onClick={() => triggerAnomaly(anomaly === 'mem' ? null : 'mem')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold border flex items-center justify-center gap-1 transition-all ${anomaly === 'mem' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50' : 'bg-card border-border hover:bg-foreground/5 text-foreground'}`}
                  >
                    <MemoryStick className="w-3 h-3" /> HL7 Queue Leak
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

