import React, { useState, useMemo } from 'react';
import {
  Search, Clock, Download, Edit2, X,
  CheckCircle2, AlertCircle, Briefcase, Users,
  Home, Building2, Calendar as CalendarIcon, ChevronDown
} from 'lucide-react';

// Notice we are now receiving 'globalEmployees' and 'setGlobalEmployees' as props!
export default function AttendanceTracker({ globalEmployees: employees, setGlobalEmployees: setEmployees }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeEmp, setActiveEmp] = useState(null);

  // --- 1. SMART DATE LOGIC: Generate Working Days (Mon-Fri) for Current Month ---
  const currentMonthWorkingDays = useMemo(() => {
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Weekends
        dates.push(date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      }
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(currentMonthWorkingDays[currentMonthWorkingDays.length - 1]);

  // --- 2. EXPORT TO CSV ENGINE ---
  const handleExportCSV = () => {
    const headers = ["Employee Name", "Role", "Status", "Work Mode", "Check In", "Check Out"];
    const csvContent = [
      headers.join(","),
      ...employees.map(e => `${e.name},${e.role},${e.status},${e.mode},${e.in},${e.out}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${selectedDate.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkLateStatus = (emp) => {
    if (emp.status !== 'PRESENT' || emp.in === '--') return false;
    const [time, period] = emp.in.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM') return true;
    if (hours > 9) return true;
    if (hours === 9 && minutes > 30) return true;
    return false;
  };

  // Safely fallback to an empty array if employees is undefined momentarily
  const safeEmployees = employees || [];

  const filteredEmployees = safeEmployees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'All' || emp.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="flex-1 overflow-hidden bg-gray-50 flex h-full relative font-sans">
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto">

          {/* --- DASHBOARD HEADER --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight">Attendance Ledger</h1>
              <p className="text-gray-500 font-medium mt-1">Direct Insurance Service • Internal HR Console</p>
            </div>

            <div className="flex items-center gap-3">
              {/* DYNAMIC WORKING DAY SELECTOR */}
              <div className="relative group">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="appearance-none bg-white pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-bold text-gray-700 outline-none cursor-pointer hover:border-yellow-500 transition-all"
                >
                  {currentMonthWorkingDays.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                <CalendarIcon size={16} className="absolute left-3.5 top-3 text-yellow-600 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={handleExportCSV}
                className="bg-gray-800 text-yellow-500 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-yellow-600 flex items-center gap-2 shadow-lg hover:bg-black transition-all active:scale-95"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          {/* --- KPI ANALYTICS --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><CheckCircle2 size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Present Today</p><p className="text-2xl font-black text-gray-800">{safeEmployees.filter(e => e.status === 'PRESENT').length}</p></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-red-50 p-3 rounded-2xl text-red-600"><AlertCircle size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Late Markers</p><p className="text-2xl font-black text-gray-800">{safeEmployees.filter(checkLateStatus).length}</p></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Home size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">WFH Personnel</p><p className="text-2xl font-black text-gray-800">{safeEmployees.filter(e => e.mode === 'WFH').length}</p></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-gray-50 p-3 rounded-2xl text-gray-400"><Users size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase">Total Force</p><p className="text-2xl font-black text-gray-800">{safeEmployees.length}</p></div>
            </div>
          </div>

          {/* --- MANAGEMENT TABLE --- */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-sm group">
                <Search size={16} className="absolute left-4 top-3 text-gray-300 group-focus-within:text-yellow-600 transition-colors" />
                <input
                  type="text" placeholder="Lookup employee..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:bg-white focus:border-yellow-500 transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', 'Insurance Advisor', 'Admin Executive', 'Claim Advisor'].map(role => (
                  <button
                    key={role} onClick={() => setSelectedRole(role)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${selectedRole === role ? 'bg-gray-800 text-yellow-500 border-yellow-600' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                  <th className="px-8 py-5">Corporate Identity</th>
                  <th className="px-6 py-5">Work Mode</th>
                  <th className="px-6 py-5 text-center">Daily Status</th>
                  <th className="px-6 py-5 text-right">Log In/Out</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => {
                  const isLate = checkLateStatus(emp);
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-yellow-500 group-hover:text-yellow-700 transition-all shadow-inner">{emp.name.charAt(0)}</div>
                          <div><p className="font-black text-gray-800 text-sm">{emp.name}</p><p className="text-[9px] font-bold text-gray-400 uppercase">{emp.role}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`flex items-center gap-2 w-fit px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase ${emp.mode === 'WFO' ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {emp.mode === 'WFO' ? <Building2 size={10} /> : <Home size={10} />} {emp.mode}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${emp.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{emp.status}</span>
                          {isLate && <span className="text-[8px] font-black text-red-600 uppercase mt-1 animate-pulse">Late Arrival</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-sm font-black text-gray-800">{emp.in}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Exit: {emp.out}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => { setActiveEmp(emp); setIsEditOpen(true); }} className="p-2.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all shadow-sm"><Edit2 size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- HR CORRECTION MODAL --- */}
      {isEditOpen && activeEmp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-gray-800 p-8 flex justify-between items-center text-white relative">
              <div className="absolute inset-y-0 left-0 w-2 bg-yellow-600"></div>
              <div><h3 className="font-black uppercase tracking-widest text-xs">Shift Override</h3><p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Adjusting Records for {activeEmp.name}</p></div>
              <button onClick={() => setIsEditOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setEmployees(prev => prev.map(emp => emp.id === activeEmp.id ? activeEmp : emp));
              setIsEditOpen(false);
            }} className="p-10 grid grid-cols-2 gap-6">
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Punch In</label><input type="text" value={activeEmp.in} onChange={e => setActiveEmp({ ...activeEmp, in: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none" /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Punch Out</label><input type="text" value={activeEmp.out} onChange={e => setActiveEmp({ ...activeEmp, out: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none" /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Work Setup</label>
                <select value={activeEmp.mode} onChange={e => setActiveEmp({ ...activeEmp, mode: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none appearance-none">
                  <option value="WFO">WFO (Office)</option><option value="WFH">WFH (Remote)</option>
                </select>
              </div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Status</label>
                <select value={activeEmp.status} onChange={e => setActiveEmp({ ...activeEmp, status: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none appearance-none">
                  <option value="PRESENT">Present</option><option value="LEAVE">Leave</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-4 mt-6">
                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Discard</button>
                <button type="submit" className="flex-[2] bg-yellow-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-[10px] hover:bg-yellow-700 transition-all active:scale-95">Update Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}