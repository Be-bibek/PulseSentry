import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Server, AlertTriangle, Settings, Menu } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/app', icon: <Activity className="w-5 h-5" /> },
    { name: 'Incidents', path: '/app/incidents', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Alert Rules', path: '/app/alerts', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="glowing-text">PulseSentry</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold">
              DO
            </div>
            <div>
              <div className="font-semibold text-sm">Demo Owner</div>
              <div className="text-xs text-gray-500">Premium Tier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/10 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-200">
              {navItems.find(i => i.path === location.pathname)?.name || 'Host Metrics'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Socket Connected
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
