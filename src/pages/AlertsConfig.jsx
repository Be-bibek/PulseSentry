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
          <p className="text-gray-400">Configure thresholds to trigger incidents and push notifications</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-gray-400 text-sm">
              <th className="p-4 font-medium">Rule Name</th>
              <th className="p-4 font-medium">Metric Condition</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rules.map(rule => (
              <tr key={rule.id} className="hover:bg-white/5">
                <td className="p-4 font-medium">{rule.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {rule.metric === 'cpu' ? <Cpu className="w-4 h-4 text-primary" /> : <MemoryStick className="w-4 h-4 text-purple-400" />}
                    <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-sm text-gray-300">
                      {rule.metric} {rule.condition} {rule.threshold}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-400 text-sm">{rule.duration}</td>
                <td className="p-4">
                   {rule.active ? (
                     <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30">Active</span>
                   ) : (
                     <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs font-bold border border-gray-500/30">Disabled</span>
                   )}
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
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
