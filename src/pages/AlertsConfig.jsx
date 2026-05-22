import { useState } from 'react';
import { Settings, Plus, Trash2, Cpu, MemoryStick } from 'lucide-react';

export default function AlertsConfig() {
  const [rules, setRules] = useState([
    { id: '1', name: 'Critical CPU Spike', metric: 'cpu', condition: '>', threshold: 90, duration: '30s', active: true },
    { id: '2', name: 'Memory Exhaustion', metric: 'memory', condition: '>', threshold: 85, duration: '1m', active: true },
    { id: '3', name: 'Low Disk Space', metric: 'disk', condition: '<', threshold: 10, duration: '5m', active: false },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Alert Rules Engine</h2>
          <p className="text-muted">Configure thresholds to trigger incidents and push notifications</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-card/40 text-muted text-sm">
              <th className="p-4 font-medium">Rule Name</th>
              <th className="p-4 font-medium">Metric Condition</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rules.map(rule => (
              <tr key={rule.id} className="hover:bg-foreground/5 transition-colors">
                <td className="p-4 font-medium text-foreground/95">{rule.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {rule.metric === 'cpu' ? <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <MemoryStick className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    <span className="font-mono bg-foreground/10 px-2 py-0.5 rounded text-sm text-foreground/90">
                      {rule.metric} {rule.condition} {rule.threshold}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-muted text-sm">{rule.duration}</td>
                <td className="p-4">
                   {rule.active ? (
                     <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/20">Active</span>
                   ) : (
                     <span className="bg-foreground/5 text-muted px-2 py-1 rounded text-xs font-bold border border-border">Disabled</span>
                   )}
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-muted hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
