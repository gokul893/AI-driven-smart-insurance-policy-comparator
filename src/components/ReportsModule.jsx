import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Activity,
  Database, Plus, X, Search, HardDrive, Filter, CheckCircle
} from 'lucide-react';

export default function ReportsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- SAFE REPORT DATABASE ---
  const [reports, setReports] = useState([
    { id: 1, name: 'Closed Deals Q3 2025', module: 'Sales Pipeline', type: 'CSV (.csv)', size: '2.4 MB', date: 'Oct 01, 2025', iconType: 'activity' },
    { id: 2, name: 'Active Contacts Backup', module: 'Companies', type: 'CSV (.csv)', size: '1.1 MB', date: 'Oct 15, 2025', iconType: 'database' },
    { id: 3, name: 'Monthly Agent Attendance', module: 'HR & Admin', type: 'CSV (.csv)', size: '4.8 MB', date: 'Oct 31, 2025', iconType: 'calendar' },
    { id: 4, name: 'Revenue Forecast', module: 'Financials', type: 'CSV (.csv)', size: '3.2 MB', date: 'Nov 05, 2025', iconType: 'activity' },
    { id: 5, name: 'Lost Opportunities Analysis', module: 'Sales Pipeline', type: 'CSV (.csv)', size: '1.7 MB', date: 'Nov 12, 2025', iconType: 'file' },
  ]);

  const [formData, setFormData] = useState({
    name: '', module: 'Financials', type: 'CSV (.csv)'
  });

  // --- CRASH-PROOF ICON RENDERER ---
  const renderIcon = (type) => {
    switch (type) {
      case 'activity': return <Activity size={20} className="text-gray-500" />;
      case 'database': return <Database size={20} className="text-gray-500" />;
      case 'calendar': return <Calendar size={20} className="text-gray-500" />;
      case 'file': return <FileText size={20} className="text-gray-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  // --- FUNCTIONAL DOWNLOAD ---
  const handleDownload = (reportName) => {
    const csvContent = "Report Name, Data Status, Verification\n" + reportName + ", Validated, 100%";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportName.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNCTIONAL GENERATION ---
  const handleGenerateReport = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      let iconStr = 'file';
      if (formData.module === 'Financials') iconStr = 'activity';
      if (formData.module === 'HR & Admin') iconStr = 'calendar';
      if (formData.module === 'Companies') iconStr = 'database';

      const newReport = {
        id: Date.now(),
        name: formData.name,
        module: formData.module,
        type: formData.type,
        size: '1.5 MB',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        iconType: iconStr
      };

      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setShowModal(false);
      setFormData({ name: '', module: 'Financials', type: 'CSV (.csv)' });
    }, 1500);
  };

  const safeReports = reports || [];
  const filteredReports = safeReports.filter(r =>
    r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col h-full relative font-sans">
      <div className="flex-1 p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-800 tracking-tight">Enterprise Reports</h1>
              <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                <Database size={16} className="text-yellow-600" /> Secure Data Backups & System Analytics
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-800 text-yellow-500 font-black px-8 py-4 rounded-[1.5rem] shadow-xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3 active:scale-95 uppercase text-xs tracking-widest border-2 border-yellow-600 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Generate Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><FileText size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Generated</p><p className="text-3xl font-black text-gray-800">{reports.length}</p></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><CheckCircle size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Health</p><p className="text-3xl font-black text-gray-800">Secure</p></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-600"><HardDrive size={24} /></div>
              <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage Used</p><p className="text-3xl font-black text-gray-800">1.2 GB</p></div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-black text-gray-800 text-xl uppercase tracking-widest">Report Archive</h3>
              <div className="relative flex-1 max-w-sm group">
                <Search size={18} className="absolute left-5 top-3.5 text-gray-300 group-focus-within:text-yellow-600 transition-colors" />
                <input type="text" placeholder="Search report name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:bg-white focus:border-yellow-500 transition-all shadow-inner" />
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    <th className="px-8 py-5 font-black">Report Identity</th>
                    <th className="px-6 py-5 font-black">Data Module</th>
                    <th className="px-6 py-5 font-black">Format</th>
                    <th className="px-6 py-5 font-black">Creation Date</th>
                    <th className="px-8 py-5 font-black text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-all shadow-inner">
                            {renderIcon(report.iconType)}
                          </div>
                          <div>
                            <span className="font-black text-gray-800 group-hover:text-yellow-700 transition-colors">{report.name}</span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{report.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                          {report.module}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-black text-xs text-gray-600">
                        {report.type}
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-gray-500">
                        {report.date}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleDownload(report.name)}
                          className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 border hover:border-gray-800 rounded-2xl transition-all shadow-sm active:scale-90"
                          title="Download Secure File"
                        >
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReports.length === 0 && (
                <div className="p-16 flex flex-col items-center justify-center text-gray-400 text-center">
                  <Filter size={40} className="mb-4 opacity-50" />
                  <p className="font-black text-lg text-gray-800">No Reports Found</p>
                  <p className="text-sm font-bold mt-1">Try adjusting your search filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- REPORT GENERATOR MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gray-800 p-8 flex justify-between items-center text-white relative">
              <div className="absolute inset-y-0 left-0 w-2 bg-yellow-600"></div>
              <div><h3 className="font-black uppercase tracking-[0.3em] text-xs">Analytics Engine</h3><p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Configure New Report</p></div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-xl transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleGenerateReport} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Report Title</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Q4 Attendance Audit" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Module</label>
                <select value={formData.module} onChange={e => setFormData({ ...formData, module: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none appearance-none cursor-pointer">
                  <option>Financials</option><option>Sales Pipeline</option><option>HR & Admin</option><option>Companies</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Output Format</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none appearance-none cursor-pointer">
                  <option>CSV (.csv)</option>
                </select>
              </div>

              <button type="submit" disabled={isGenerating} className="w-full bg-yellow-600 text-white font-black py-5 rounded-2xl shadow-xl mt-4 uppercase text-[10px] tracking-[0.2em] hover:bg-yellow-700 transition-all active:scale-95 disabled:bg-gray-400 flex justify-center items-center gap-2">
                {isGenerating ? <><Activity size={16} className="animate-spin" /> Extracting Data...</> : 'Initiate Extraction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}