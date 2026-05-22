import { createContext, useContext, useState, useEffect } from 'react';

const TelemetryContext = createContext(null);

export function TelemetryProvider({ children }) {
  const [connected, setConnected] = useState(true);
  const [anomaly, setAnomaly] = useState(null);
  
  const [hosts, setHosts] = useState([
    { id: '1', hostname: 'emr-database-main', status: 'online', cpu: 32, mem: 58, type: 'Electronic Medical Records Core' },
    { id: '2', hostname: 'pacs-imaging-mri', status: 'online', cpu: 22, mem: 48, type: 'PACS Imaging (MRI/CT Gateway)' },
    { id: '3', hostname: 'lab-analyzer-chemistry', status: 'online', cpu: 15, mem: 38, type: 'Biochemistry Analyzer Interface' },
  ]);

  const [incidents, setIncidents] = useState([
    { id: 'INC-PACS-911', host: 'pacs-imaging-mri', rule: 'DICOM Buffer Limit > 90%', time: '1 hour ago', status: 'resolved', rca: 'DICOM transfer threads saturated. Spooled files to local disk and restarted DICOM broker service.' }
  ]);

  const [patients, setPatients] = useState([
    { id: 'PAT-001', name: 'Sarah Jenkins', age: 48, bed: 'ICU-104', condition: 'Critical (Cardiac Monitoring)', hr: 74, spo2: 98, bp: '120/80', temp: 37.1, status: 'stable' },
    { id: 'PAT-002', name: 'Marcus Vance', age: 62, bed: 'ICU-108', condition: 'Post-Op Ventilation Recovery', hr: 82, spo2: 96, bp: '135/85', temp: 38.2, status: 'warning' },
    { id: 'PAT-003', name: 'Elena Rostova', age: 12, bed: 'PED-214', condition: 'Severe Asthma Monitoring', hr: 95, spo2: 99, bp: '110/70', temp: 36.9, status: 'stable' },
    { id: 'PAT-004', name: 'David Kim', age: 71, bed: 'CAR-301', condition: 'Chronic Coronary Failure', hr: 68, spo2: 95, bp: '115/75', temp: 37.0, status: 'stable' }
  ]);

  const [doctors] = useState([
    { id: 'DOC-01', name: 'Dr. Evelyn Carter', specialty: 'Cardiologist', status: 'On-Duty', pager: 'P-502' },
    { id: 'DOC-02', name: 'Dr. Michael Chen', specialty: 'Radiology Lead', status: 'On-Call', pager: 'P-911' },
    { id: 'DOC-03', name: 'Dr. Sarah Patel', specialty: 'Intensive Care specialist', status: 'On-Duty', pager: 'P-104' },
    { id: 'DOC-04', name: 'Dr. James Mitchell', specialty: 'Pediatric Consultant', status: 'Off-Duty', pager: 'P-214' }
  ]);

  const [dicomScan, setDicomScan] = useState({
    activePatientId: null,
    scanning: false,
    progress: 0,
    result: null
  });

  // Telemetry fluctuation loop
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      // 1. Update Hosts CPU & Memory
      setHosts(prev => prev.map(host => {
        let cpuTarget = host.cpu;
        let memTarget = host.mem;
        let statusTarget = 'online';

        if (anomaly === 'cpu') {
          if (host.hostname === 'emr-database-main') { cpuTarget = 95; memTarget = 62; statusTarget = 'incident'; }
          if (host.hostname === 'pacs-imaging-mri') { cpuTarget = 93; memTarget = 55; statusTarget = 'incident'; }
        } else if (anomaly === 'mem') {
          if (host.hostname === 'emr-database-main') { cpuTarget = 45; memTarget = 92; statusTarget = 'incident'; }
          if (host.hostname === 'pacs-imaging-mri') { cpuTarget = 30; memTarget = 94; statusTarget = 'incident'; }
        } else {
          // Standard fluctuation
          const cpuDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const memDelta = Math.floor(Math.random() * 3) - 1; // -1 to +1
          cpuTarget = Math.max(10, Math.min(80, host.cpu + cpuDelta));
          memTarget = Math.max(30, Math.min(85, host.mem + memDelta));
        }

        return { ...host, cpu: cpuTarget, mem: memTarget, status: statusTarget };
      }));

      // 2. Update Patient Vitals
      setPatients(prev => prev.map(patient => {
        let hrDelta = Math.floor(Math.random() * 3) - 1;
        let spo2Delta = Math.floor(Math.random() * 3) - 1;
        
        let hr = patient.hr + hrDelta;
        let spo2 = patient.spo2 + (Math.random() > 0.8 ? spo2Delta : 0);
        let status = 'stable';

        // Anomaly effects patient vitals
        if (anomaly === 'cpu') {
          // HL7 Queue bottleneck stresses EMR and patients vitals tracking
          hr = Math.min(130, hr + 3);
          spo2 = Math.max(89, spo2 - 1);
        } else if (anomaly === 'mem') {
          // PACS transmission failure stresses recovering critical ICU cases
          hr = Math.min(115, hr + 1);
          spo2 = Math.max(91, spo2 - 0.5);
        } else {
          // Return to baseline
          const baselineHr = patient.id === 'PAT-001' ? 74 : patient.id === 'PAT-002' ? 82 : patient.id === 'PAT-003' ? 95 : 68;
          const baselineSpo2 = patient.id === 'PAT-002' ? 96 : patient.id === 'PAT-004' ? 95 : 98;
          
          if (hr > baselineHr) hr--;
          if (hr < baselineHr) hr++;
          if (spo2 < baselineSpo2) spo2++;
        }

        // Clamp values
        hr = Math.max(45, Math.min(150, Math.round(hr)));
        spo2 = Math.max(80, Math.min(100, Math.round(spo2)));

        if (spo2 < 93 || hr > 110) {
          status = 'danger';
        } else if (spo2 < 95 || hr > 90 || patient.temp > 38.0) {
          status = 'warning';
        }

        return { ...patient, hr, spo2, status };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [connected, anomaly]);

  // Handle setting anomalies (Stress tests)
  const triggerAnomaly = (type) => {
    if (!connected) return;
    setAnomaly(type);
    
    // Add corresponding incident if not already active
    const incidentId = type === 'cpu' ? 'INC-HL7-402' : 'INC-MEM-505';
    const host = type === 'cpu' ? 'emr-database-main' : 'pacs-imaging-mri';
    const rule = type === 'cpu' ? 'HL7 Queue Deadlock (CPU load > 90%)' : 'PACS Buffer Memory Spool Limit (Memory > 90%)';

    setIncidents(prev => {
      if (prev.some(i => i.id === incidentId && i.status === 'active')) return prev;
      return [
        {
          id: incidentId,
          host,
          rule,
          time: 'Just now',
          status: 'active',
          rca: null
        },
        ...prev
      ];
    });

    // Update specific hosts status immediately
    setHosts(prev => prev.map(h => h.hostname === host ? { ...h, status: 'incident' } : h));
  };

  // Resolve incident
  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved' } : inc));
    setAnomaly(null);
    setHosts(prev => prev.map(h => ({ ...h, status: 'online' })));
  };

  const toggleConnection = () => {
    setConnected(prev => !prev);
    if (connected) {
      setAnomaly(null);
    }
  };

  // Admissions
  const admitPatient = (newPatient) => {
    const nextId = `PAT-0${patients.length + 1}`;
    setPatients(prev => [
      ...prev,
      {
        id: nextId,
        name: newPatient.name,
        age: parseInt(newPatient.age) || 30,
        bed: newPatient.bed || 'Gen-Ward',
        condition: newPatient.condition || 'Observation',
        hr: 75,
        spo2: 98,
        bp: newPatient.bp || '120/80',
        temp: parseFloat(newPatient.temp) || 37.0,
        status: 'stable'
      }
    ]);
  };

  // Discharge
  const dischargePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  // DICOM Simulation
  const startDICOMScan = (patientId, scanType) => {
    setDicomScan({
      activePatientId: patientId,
      scanning: true,
      progress: 0,
      result: null
    });
  };

  useEffect(() => {
    if (!dicomScan.scanning) return;

    const timer = setInterval(() => {
      setDicomScan(prev => {
        if (prev.progress >= 100) {
          clearInterval(timer);
          return {
            ...prev,
            scanning: false,
            progress: 100,
            result: `DICOM_${prev.activePatientId}_${Date.now()}.dcm`
          };
        }
        return { ...prev, progress: prev.progress + 20 };
      });
    }, 600);

    return () => clearInterval(timer);
  }, [dicomScan.scanning]);

  return (
    <TelemetryContext.Provider value={{
      connected,
      anomaly,
      hosts,
      incidents,
      patients,
      doctors,
      dicomScan,
      toggleConnection,
      triggerAnomaly,
      resolveIncident,
      admitPatient,
      dischargePatient,
      startDICOMScan,
      setAnomaly
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
