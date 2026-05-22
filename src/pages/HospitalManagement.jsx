import { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { 
  Heart, 
  Activity, 
  UserPlus, 
  Layers, 
  User, 
  Calendar, 
  ShieldAlert, 
  UserCheck, 
  FileImage, 
  Loader2, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export default function HospitalManagement() {
  const { 
    patients, 
    doctors, 
    dicomScan, 
    admitPatient, 
    dischargePatient, 
    startDICOMScan 
  } = useTelemetry();

  // Local Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bed: 'ICU-101',
    condition: '',
    bp: '120/80',
    temp: '37.0'
  });

  const [scanType, setScanType] = useState('MRI Brain Scan');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.condition) return;
    admitPatient(formData);
    setFormData({
      name: '',
      age: '',
      bed: `Gen-${Math.floor(Math.random() * 100) + 200}`,
      condition: '',
      bp: '120/80',
      temp: '37.0'
    });
  };

  // Compute stats
  const criticalPatients = patients.filter(p => p.status === 'danger').length;
  const warningPatients = patients.filter(p => p.status === 'warning').length;
  const icuOccupied = patients.filter(p => p.bed.startsWith('ICU')).length;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-emerald-500">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Admissions</div>
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
            {patients.length} <span className="text-xs text-gray-500 font-medium">Patients active</span>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-purple-500">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">ICU Bed Occupancy</div>
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
            {Math.round((icuOccupied / 8) * 100)}% <span className="text-xs text-gray-500 font-medium">({icuOccupied}/8 Beds)</span>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-red-500">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Critical Vitals Alerts</div>
          <div className="text-3xl font-extrabold text-red-400 flex items-center gap-2">
            {criticalPatients} 
            {criticalPatients > 0 && <ShieldAlert className="w-5 h-5 animate-bounce text-red-400" />}
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border-l-4 border-l-blue-500">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Active PACS Scans</div>
          <div className="text-3xl font-extrabold text-blue-400 flex items-center gap-2">
            {dicomScan.scanning ? (
              <span className="flex items-center gap-2 text-xl font-bold animate-pulse text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" /> In Progress ({dicomScan.progress}%)
              </span>
            ) : 'Idle'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: ICU Patients vitals board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Patient Vitals Monitor (ICU / Wards)
            </h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">
              Live updates via HL7 stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map(p => (
              <div 
                key={p.id} 
                className={`glass-panel p-5 rounded-xl border relative transition-all duration-300 ${
                  p.status === 'danger' 
                    ? 'border-red-500/40 bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                    : p.status === 'warning'
                    ? 'border-yellow-500/30 bg-yellow-950/5'
                    : 'border-white/5 hover:border-emerald-500/30'
                }`}
              >
                {/* Bed Badge */}
                <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-xxs font-bold uppercase ${
                  p.status === 'danger' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-white/10 text-gray-300'
                }`}>
                  {p.bed}
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-200">{p.name}</h3>
                  <div className="text-xs text-gray-500">ID: {p.id} • Age: {p.age} • {p.condition}</div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  {/* Heart Rate */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${p.status === 'danger' ? 'text-red-500 animate-ping' : 'text-emerald-500 animate-pulse'}`} /> 
                      Pulse Rate
                    </div>
                    <div className={`text-xl font-extrabold ${p.status === 'danger' ? 'text-red-400' : 'text-gray-200'}`}>
                      {p.hr} <span className="text-xs font-normal text-gray-500">BPM</span>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">O2 Saturation (SpO2)</div>
                    <div className={`text-xl font-extrabold ${p.spo2 < 93 ? 'text-red-400' : p.spo2 < 95 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                      {p.spo2}%
                    </div>
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${p.spo2 < 93 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${p.spo2}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* BP */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Blood Pressure</div>
                    <div className="text-sm font-bold text-gray-300">{p.bp} <span className="text-xxs font-normal text-gray-500">mmHg</span></div>
                  </div>

                  {/* Temp */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Temperature</div>
                    <div className={`text-sm font-bold ${p.temp > 38.0 ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {p.temp.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                {/* Patient actions */}
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 justify-end">
                  <button 
                    onClick={() => {
                      setScanType(p.bed.startsWith('ICU') ? 'MRI Brain Scan' : 'Chest CT Scan');
                      startDICOMScan(p.id, scanType);
                    }}
                    disabled={dicomScan.scanning}
                    className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded text-xxs font-bold transition-all flex items-center gap-1"
                  >
                    <FileImage className="w-3 h-3" /> DICOM Scan
                  </button>
                  <button 
                    onClick={() => dischargePatient(p.id)}
                    className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-xxs font-bold transition-all"
                  >
                    Discharge
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PACS Imaging Panel (Interactive) */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
              <FileImage className="w-5 h-5" /> PACS DICOM Diagnostic Imaging Viewer
            </h3>

            {dicomScan.scanning ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                <div className="text-center">
                  <div className="font-bold text-gray-200">Executing Clinical Imaging Scan</div>
                  <div className="text-xs text-gray-500 mt-1">Acquiring magnetic slices, establishing handshake...</div>
                </div>
                <div className="w-64 bg-black/50 border border-white/10 rounded-full h-2">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${dicomScan.progress}%` }}></div>
                </div>
              </div>
            ) : dicomScan.result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual SVG scan render */}
                <div className="bg-black/80 aspect-square rounded-lg border border-white/10 flex items-center justify-center p-4 relative">
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-blue-400">PACS-MR-v1.4</span>
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-gray-500">Slice: 42/90</span>
                  
                  {scanType.includes('Brain') ? (
                    <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-80">
                      {/* Outer skull */}
                      <ellipse cx="50" cy="50" rx="35" ry="42" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Brain lobe lobes */}
                      <path d="M50,15 C68,15 78,30 78,50 C78,72 65,85 50,85 C35,85 22,72 22,50 C22,30 32,15 50,15 Z" fill="none" stroke="#2563eb" strokeWidth="2" />
                      {/* Inner cerebellum creases */}
                      <path d="M50,15 C52,25 60,35 68,45" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
                      <path d="M50,85 C45,70 35,60 25,50" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
                      <path d="M50,40 C60,40 65,55 50,70 C35,55 40,40 50,40 Z" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-pulse" />
                      {/* Grid overlay */}
                      <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5" />
                      <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-80">
                      {/* Ribcage / Lung CT */}
                      <ellipse cx="50" cy="50" rx="38" ry="32" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                      {/* Lungs */}
                      <path d="M35,30 C45,30 45,65 38,72 C32,78 20,70 20,50 C20,35 25,30 35,30 Z" fill="none" stroke="#2563eb" strokeWidth="2" />
                      <path d="M65,30 C55,30 55,65 62,72 C68,78 80,70 80,50 C80,35 75,30 65,30 Z" fill="none" stroke="#2563eb" strokeWidth="2" />
                      {/* Spine / Heart */}
                      <rect x="47" y="28" width="6" height="44" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
                      <ellipse cx="50" cy="48" rx="8" ry="12" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-pulse" />
                    </svg>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Active Scan Object</div>
                    <div className="text-xl font-bold text-gray-200">{scanType}</div>
                    <div className="font-mono text-xs text-blue-400 mt-1">{dicomScan.result}</div>
                  </div>

                  <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Modality:</span>
                      <span className="text-gray-300 font-bold">{scanType.split(' ')[0]} (Diagnostic)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Patient:</span>
                      <span className="text-gray-300">
                        {patients.find(p => p.id === dicomScan.activePatientId)?.name || 'Unknown Patient'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PACS Queue status:</span>
                      <span className="text-emerald-400 font-semibold">Synced OK</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setDicomScan(prev => ({ ...prev, result: null }))}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded text-xs transition-colors"
                  >
                    Clear Diagnostics Viewer
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-gray-500">
                <FileImage className="w-12 h-12 mb-3 opacity-20 text-blue-400" />
                <p className="text-sm">No active DICOM scan loaded.</p>
                <p className="text-xs mt-1 text-gray-600">Click "DICOM Scan" on any patient card above to begin imaging diagnostics.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Admissions form, Roster & Bed occupancies */}
        <div className="space-y-6">
          {/* Admissions Form */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
              <UserPlus className="w-5 h-5" /> Patient Intake (Admit Patient)
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Age</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    placeholder="45"
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Bed Allocation</label>
                  <select 
                    value={formData.bed}
                    onChange={e => setFormData({ ...formData, bed: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ICU-101">ICU-101</option>
                    <option value="ICU-102">ICU-102</option>
                    <option value="ICU-105">ICU-105</option>
                    <option value="WARD-202">Ward-202</option>
                    <option value="WARD-205">Ward-205</option>
                    <option value="PED-215">Ped-215</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Primary Diagnosis / Condition</label>
                <input 
                  type="text" 
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g. Respiratory failure"
                  className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Init BP (mmHg)</label>
                  <input 
                    type="text" 
                    value={formData.bp}
                    onChange={e => setFormData({ ...formData, bp: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Init Temp (°C)</label>
                  <input 
                    type="text" 
                    value={formData.temp}
                    onChange={e => setFormData({ ...formData, temp: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" /> Commit Admission to EHR
              </button>
            </form>
          </div>

          {/* Active Wards bed occupancy grid */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Ward Beds Allocation Matrix
            </h3>
            <p className="text-xs text-gray-400 mb-4">Clicking highlights allocated EMR databases endpoints.</p>

            <div className="grid grid-cols-4 gap-2">
              {['ICU-101', 'ICU-102', 'ICU-104', 'ICU-108', 'WARD-202', 'WARD-205', 'PED-214', 'CAR-301'].map(bed => {
                const occupancy = patients.find(p => p.bed === bed);
                return (
                  <div 
                    key={bed}
                    onClick={() => {
                      if (!occupancy) {
                        setFormData(prev => ({ ...prev, bed }));
                      }
                    }}
                    className={`p-2 rounded border text-center cursor-pointer transition-all ${
                      occupancy 
                        ? occupancy.status === 'danger'
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'bg-green-500/10 border-green-500/20 hover:border-green-500/50 text-green-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold font-mono">{bed}</div>
                    <div className="text-[8px] opacity-75 truncate">{occupancy ? occupancy.name.split(' ')[1] : 'Empty'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* On-Duty Medical Roster */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" /> On-Duty Clinician Roster
            </h3>
            
            <div className="space-y-3">
              {doctors.map(d => (
                <div key={d.id} className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                  <div>
                    <div className="font-bold text-gray-200">{d.name}</div>
                    <div className="text-gray-500 text-[10px]">{d.specialty}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      d.status === 'On-Duty' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : d.status === 'On-Call'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {d.status}
                    </span>
                    <div className="text-gray-500 font-mono text-[9px] mt-1">Pager: {d.pager}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
