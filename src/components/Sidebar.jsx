import React from 'react';
import { Briefcase, CalendarCheck, FileText, UserPlus, ShieldAlert, Grid, Building2, Map, BarChart3, Activity, LogOut } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, userRole }) {
  const navItems = [
    { id: 'smart-comparator', label: 'Smart Comparator', icon: ShieldAlert, module: 'sales' },
    { id: 'pipeline', label: 'Pipeline', icon: Grid, module: 'sales' },
    { id: 'companies', label: 'Companies', icon: Building2, module: 'sales' },
    { id: 'financials', label: 'Financials', icon: BarChart3, module: 'sales' },
    { id: 'live-tracking', label: 'Live Tracking', icon: Map, module: 'hr' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, module: 'hr' },
    { id: 'onboard', label: 'Onboard Employee', icon: UserPlus, module: 'hr' },
    { id: 'reports', label: 'Reports', icon: Activity, module: 'hr' },
    { id: 'policy-extractor', label: 'Policy Extractor', icon: FileText, module: 'hr' }, 
  ];

  return (
    <aside className="w-72 bg-gray-800 text-gray-300 flex flex-col h-screen shrink-0 relative overflow-hidden">
      {/* Decorative Blur Accent */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* --- BRANDING SECTION --- */}
      <div className="px-6 py-10 flex flex-col items-center border-b border-gray-700/50 mb-4">
        {/* Circular Logo with Glow */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-1 bg-yellow-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img
            src="/logo.png"
            alt="Direct Insurance Logo"
            className="relative w-16 h-16 object-contain"
          />
        </div>

        {/* Company Name Wordmark (Inverted to White) */}
        <img
          src="/Company Name.png"
          alt="Direct Insurance Service"
          className="h-20 object-contain brightness-80 invert opacity-60"
        />

        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-[0.4em] mt-3">
          Service Dashboard
        </span>
      </div>

      {/* --- NAVIGATION SECTION --- */}
      <div className="px-6 py-4 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-8">

          {/* Sales Module Group (Always Visible) */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-3">Sales Module</h3>
            <ul className="space-y-1.5">
              {navItems.filter(item => item.module === 'sales').map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeView === item.id
                      ? 'bg-yellow-600/10 text-yellow-500 font-semibold'
                      : 'hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    <item.icon size={20} className={activeView === item.id ? 'text-yellow-500' : 'text-gray-400'} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* HR Module Group (ONLY VISIBLE IF ADMIN) */}
          {userRole === 'admin' && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-3">HR & Admin</h3>
              <ul className="space-y-1.5">
                {navItems.filter(item => item.module === 'hr').map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeView === item.id
                        ? 'bg-yellow-600/10 text-yellow-500 font-semibold'
                        : 'hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                      <item.icon size={20} className={activeView === item.id ? 'text-yellow-500' : 'text-gray-400'} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* --- USER FOOTER (Dynamic based on role) --- */}
      <div className="p-6">
        <div className="bg-gray-700/50 rounded-2xl p-4 flex items-center justify-between border border-gray-700/50 group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${userRole === 'admin' ? 'bg-yellow-600' : 'bg-gray-600'}`}>
              {userRole === 'admin' ? 'AD' : 'SA'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {userRole === 'admin' ? 'Admin User' : 'Sales Agent'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userRole === 'admin' ? 'Head Office' : 'Telecaller'}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={() => window.location.reload()} 
            className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg shrink-0"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}