import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, Server, AlertTriangle, Settings, Menu, Activity, Sun, Moon } from 'lucide-react';
import { TelemetryProvider } from '../context/TelemetryContext';

export default function Layout() {
  const location = useLocation();
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const navItems = [
    { name: 'Clinical Deck', path: '/app', icon: <Heart className="w-5 h-5" /> },
    { name: 'HMS Operations', path: '/app/hms', icon: <Activity className="w-5 h-5" /> },
    { name: 'Incidents Tracker', path: '/app/incidents', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Vital Rules', path: '/app/alerts', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <TelemetryProvider>
      <div className="min-h-screen bg-background text-foreground flex transition-colors duration-200">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card/30 flex flex-col">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center">
                <Heart className="text-white w-5 h-5 animate-pulse" />
              </div>
              <span className="glowing-text text-emerald-600 dark:text-emerald-400">PulseSentry Health</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                    : 'text-muted hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-white">
                DO
              </div>
              <div>
                <div className="font-semibold text-sm">Demo Owner</div>
                <div className="text-xs text-muted">Premium Tier</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/10 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">
                {navItems.find(i => i.path === location.pathname)?.name || 'Host Metrics'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
               <button 
                 onClick={toggleTheme}
                 className="p-2 rounded-full hover:bg-foreground/5 text-muted hover:text-foreground transition-all duration-200 focus:outline-none"
                 title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
               >
                 {theme === 'dark' ? (
                   <Sun className="w-5 h-5 text-amber-400 animate-[pulse_3s_infinite]" />
                 ) : (
                   <Moon className="w-5 h-5 text-indigo-600" />
                 )}
               </button>
               <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold border border-green-500/20 flex items-center gap-2">
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
    </TelemetryProvider>
  );
}
