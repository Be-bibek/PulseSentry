import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, ChevronRight, Server } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-primary/30">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md fixed w-full z-50">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
             <Activity className="text-white w-5 h-5" />
          </div>
          <span className="glowing-text">PulseSentry</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Pricing</a>
          <Link to="/app" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            Enter App
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            PulseAgent v2.0 Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 pb-4">
            Real-Time Infrastructure <br /> Monitoring & AI Diagnostics
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deploy the ultra-lightweight PulseAgent to your servers. Stream real-time metrics over WebSockets, configure smart thresholds, and let Gemini AI automatically resolve your incidents.
          </p>
          <div className="flex items-center justify-center gap-4 pt-8">
            <Link to="/app" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]">
              Launch Dashboard <ChevronRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-full text-lg font-bold border border-white/20 hover:bg-white/5 transition-colors">
              Read Docs
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8" id="features">
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
               <Zap className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sub-Second WebSockets</h3>
            <p className="text-gray-400">Watch your CPU, Memory, and Network I/O change instantly. Our optimized Node.js pipeline delivers metrics with zero perceivable lag.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
               <Shield className="text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Incident RCA</h3>
            <p className="text-gray-400">When thresholds trigger, click one button to have Google Gemini analyze your metrics buffer and suggest precise bash commands to fix the issue.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
               <Server className="text-green-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rules Engine</h3>
            <p className="text-gray-400">Build complex multi-condition alerting pipelines. Get notified immediately when your event loop lags or node thread pools are exhausted.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PulseSentry MERN SaaS Project. Built for scaling.
      </footer>
    </div>
  );
}
