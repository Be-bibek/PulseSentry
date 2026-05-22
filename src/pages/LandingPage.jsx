import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, ChevronRight, Server, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-primary/30">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md fixed w-full z-50">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center">
             <Heart className="text-white w-5 h-5 animate-pulse" />
          </div>
          <span className="glowing-text text-emerald-400">PulseSentry Health</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Pricing</a>
          <Link to="/app" className="bg-emerald-500 text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors">
            Enter App
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PulseAgent Clinical v2.0 Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 pb-4">
            Real-Time Clinical IoT <br /> & Medical Server Monitoring
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deploy the ultra-lightweight PulseAgent to your medical databases and instruments. Stream HL7 telemetry over WebSockets, configure vital thresholds, and utilize Gemini AI to auto-diagnose clinical systems failures.
          </p>
          <div className="flex items-center justify-center gap-4 pt-8">
            <Link to="/app" className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              Launch Clinical Deck <ChevronRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-full text-lg font-bold border border-white/20 hover:bg-white/5 transition-colors">
              Systems Manual
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8" id="features">
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
               <Zap className="text-emerald-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sub-Second HL7 Telemetry</h3>
            <p className="text-gray-400">Watch CPU, memory, and instrument telemetry live. Our low-latency WebSocket pipeline ensures real-time oversight of hospital servers without data lag.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
               <Shield className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Clinical AI Diagnostics</h3>
            <p className="text-gray-400">When thresholds breach, click to invoke Gemini AI. It inspects recent metric logs, PACS spool queues, and HL7 deadlocks to output remediation actions.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
               <Server className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Medical IoT Rules Engine</h3>
            <p className="text-gray-400">Configure alert rules tailored for clinical environments. Monitor EMR thread-pool exhausts, lab interface disconnects, and DICOM spool queue sizes.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PulseSentry Health | Clinical Telemetry SaaS. HIPAA Compliant Monitoring Templates.
      </footer>
    </div>
  );
}

