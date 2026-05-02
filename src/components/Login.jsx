import React, { useState } from 'react';
import { Mail, Lock, ChevronRight, ShieldCheck, AlertCircle, Zap, Kanban, BarChart3 } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 
    
    // Check credentials and assign roles
    if (email === 'admin' && password === 'Direct@2026') {
      onLogin('admin');
    } else if (email === 'sales' && password === 'Sales@2026') {
      onLogin('sales');
    } else {
      setError('Invalid identity credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 font-sans selection:bg-yellow-500/30 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-[#0d5c5a]">
      
      {/* GIANT TRANSPARENT LOGO WATERMARK BACKGROUND */}
      {/* ADJUST TRANSPARENCY HERE:
          Change opacity-[0.04] to opacity-[0.02] to make it more transparent.
          Change to opacity-10 or opacity-20 to make the image more solid/visible.
      */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/logo.png')",
          backgroundSize: '65%', /* Adjust this percentage to make the logo larger or smaller */
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* LIGHT ACCENT GLOWS (Adds depth behind the modal) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#318f8e] rounded-full blur-[120px] opacity-20 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600 rounded-full blur-[120px] opacity-10 z-0 pointer-events-none"></div>

      {/* MAIN FROSTED GLASS CARD (SPLIT LAYOUT) */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 border border-white/10">
        
        {/* LEFT COLUMN: BRANDING & FEATURES */}
        <div className="p-12 flex flex-col justify-between bg-gradient-to-br from-[#0d5c5a]/95 to-[#318f8e]/95 text-white relative">
          
          {/* Subtle logo watermark inside the left panel only */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "url('/logo.png')", backgroundSize: '120%', backgroundPosition: '-50% 50%', backgroundRepeat: 'no-repeat' }}
          ></div>

          <div className="relative z-10">
            {/* Header Brand */}
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-white p-2.5 rounded-2xl shadow-lg">
                <img src="/logo.png" alt="Direct Insurance Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h2 className="font-black tracking-widest text-xl leading-none">DIRECT INSURANCE</h2>
                <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold mt-1">Enterprise Service Portal</p>
              </div>
            </div>

            <h3 className="text-3xl font-black mb-8 leading-tight tracking-tight">
              Streamline Your <br/>
              <span className="text-yellow-400">Insurance Operations</span>
            </h3>

            {/* FEATURES LIST */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 group-hover:bg-white/20 transition-colors">
                  <Zap size={22} className="text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Instant Premium Quotes</h4>
                  <p className="text-xs text-teal-100/70 mt-1 leading-relaxed">Access real-time market scans, compare IDV limits, and generate official proposal PDFs instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 group-hover:bg-white/20 transition-colors">
                  <Kanban size={22} className="text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Efficient Claim Pipeline</h4>
                  <p className="text-xs text-teal-100/70 mt-1 leading-relaxed">Track customer lifecycles, manage agent assignments, and monitor active policy issuances effortlessly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 group-hover:bg-white/20 transition-colors">
                  <BarChart3 size={22} className="text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Corporate Reporting & Analytics</h4>
                  <p className="text-xs text-teal-100/70 mt-1 leading-relaxed">Gain oversight with live GPS tracking, attendance logs, and financial performance metrics.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-300 tracking-widest uppercase">System Online & Secure</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="bg-white p-12 flex flex-col justify-center relative">
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-500 font-bold">Please authenticate to access the dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-900 px-4 py-3 rounded-xl flex items-center gap-3 text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Credential Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0d5c5a] transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. admin or sales"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 text-gray-900 outline-none transition-all font-bold border-2 border-gray-100 placeholder:text-gray-400 placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-[#0d5c5a]/10 focus:border-[#0d5c5a]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0d5c5a] transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 text-gray-900 outline-none transition-all font-bold border-2 border-gray-100 placeholder:text-gray-400 placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-[#0d5c5a]/10 focus:border-[#0d5c5a]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="text-right mb-6">
              <span className="text-xs font-bold text-[#0d5c5a] hover:text-[#318f8e] cursor-pointer transition-colors">Forgot Access Key?</span>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0d5c5a] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-gray-900 transition-all active:scale-95 flex items-center justify-center gap-3 group border border-[#0a4746]"
            >
              <span className="text-sm uppercase tracking-widest">Access Dashboard</span>
              <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Dev Hint */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Authorized Personnel Only</p>
            <p className="text-[10px] text-gray-400/80 font-medium">
              Admin: admin / Direct@2026<br/>
              Sales: sales / Sales@2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}