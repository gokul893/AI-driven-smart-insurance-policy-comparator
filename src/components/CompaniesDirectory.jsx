import React, { useState } from 'react';
import {
  Search, Building2, MapPin, Plus,
  Edit2, Trash2, ExternalLink, Briefcase, TrendingUp,
  X, ShieldCheck, FileText, History, PieChart, CheckCircle2, Clock
} from 'lucide-react';

export default function CompaniesDirectory() {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedPortfolio, setSelectedPortfolio] = useState(null); // Controls the side drawer

  // Enterprise Client Database
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Tata Motors', phone: '+91 98765 11111', revenue: '500', city: 'Mumbai', industry: 'Automotive', status: 'Active', policies: 12, health: 94 },
    { id: 2, name: 'L&T Construction', phone: '+91 98765 22222', revenue: '850', city: 'Chennai', industry: 'Infrastructure', status: 'Proposal', policies: 8, health: 88 },
    { id: 3, name: 'Wipro Technologies', phone: '+91 98765 33333', revenue: '420', city: 'Bangalore', industry: 'IT Services', status: 'Active', policies: 24, health: 91 },
    { id: 4, name: 'Infosys Limited', phone: '+91 98765 44444', revenue: '950', city: 'Pune', industry: 'IT Services', status: 'Prospect', policies: 0, health: 0 },
    { id: 5, name: 'Reliance Retail', phone: '+91 98765 55555', revenue: '1200', city: 'Mumbai', industry: 'Retail', status: 'Active', policies: 45, health: 97 },
  ]);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    id: null, name: '', industry: 'Automotive', phone: '', city: '', revenue: '', status: 'Prospect', policies: 0
  });

  // --- BUSINESS LOGIC HANDLERS ---

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, name: '', industry: 'Automotive', phone: '', city: '', revenue: '', status: 'Prospect', policies: 0 });
    setShowModal(true);
  };

  const handleOpenEdit = (company) => {
    setModalMode('edit');
    setFormData(company);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("CRITICAL: Are you sure you want to permanently remove this corporate account?")) {
      setCompanies(companies.filter(c => c.id !== id));
      if (selectedPortfolio?.id === id) setSelectedPortfolio(null);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newEntry = { ...formData, id: Date.now(), health: formData.status === 'Active' ? 85 : 0 };
      setCompanies([...companies, newEntry]);
    } else {
      setCompanies(companies.map(c => c.id === formData.id ? formData : c));
    }
    setShowModal(false);
  };

  const filteredCompanies = companies.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-hidden bg-gray-50 flex h-full relative font-sans">

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto">

          {/* Executive Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-800 tracking-tight">Corporate Directory</h1>
              <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-yellow-600" /> B2B Portfolio & Risk Management
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Briefcase size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Accounts</p>
                  <p className="text-2xl font-black text-gray-800">{companies.length}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retention Rate</p>
                  <p className="text-2xl font-black text-gray-800">98.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar: Search & Global Add */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="relative flex-1 max-w-lg group">
              <Search className="absolute left-5 top-4 text-gray-400 group-focus-within:text-yellow-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Filter by Client Name, Industry, or City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-600 outline-none font-bold text-gray-700 transition-all"
              />
            </div>

            <button
              onClick={handleOpenAdd}
              className="bg-gray-800 text-yellow-500 font-black px-8 py-4 rounded-[1.5rem] shadow-xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3 active:scale-95 uppercase text-xs tracking-widest border-2 border-yellow-600 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Register New Corporation
            </button>
          </div>

          {/* Corporate Inventory Table */}
          {filteredCompanies.length > 0 ? (
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-800 text-[10px] uppercase tracking-[0.25em] text-gray-400">
                      <th className="px-10 py-6 font-black">Company Identity</th>
                      <th className="px-6 py-6 font-black">Segment</th>
                      <th className="px-6 py-6 font-black">Status</th>
                      <th className="px-6 py-6 font-black text-right">Policies</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCompanies.map((comp) => (
                      <tr key={comp.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-yellow-600 group-hover:text-white transition-all shadow-inner">
                              <Building2 size={28} />
                            </div>
                            <div>
                              <p className="font-black text-lg text-gray-800 group-hover:text-yellow-700 transition-colors">{comp.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                <MapPin size={10} /> {comp.city} • ₹{comp.revenue} Cr
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
                            {comp.industry}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] border ${comp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            comp.status === 'Prospect' ? 'bg-gray-50 text-gray-400 border-gray-200' :
                              'bg-yellow-50 text-yellow-600 border-yellow-100'
                            }`}>
                            {comp.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right font-black text-gray-800">
                          {comp.policies}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <button onClick={() => handleOpenEdit(comp)} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-blue-100 transition-all" title="Edit Profile"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(comp.id)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-red-100 transition-all" title="Remove Client"><Trash2 size={18} /></button>
                            <button onClick={() => setSelectedPortfolio(comp)} className="p-3 text-gray-400 hover:text-yellow-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-yellow-200 transition-all" title="View Risk Portfolio"><ExternalLink size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-200 p-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8 border border-gray-100">
                <Building2 size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">No Enterprise Matches Found</h3>
              <p className="text-gray-400 font-medium max-w-xs">Adjust your filters or register a new corporation to expand your directory.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- DYNAMIC PORTFOLIO DRAWER --- */}
      {selectedPortfolio && (
        <>
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[110] animate-in fade-in duration-300" onClick={() => setSelectedPortfolio(null)}></div>

          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[120] border-l border-gray-100 animate-in slide-in-from-right duration-500 flex flex-col">

            <div className="bg-gray-800 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <button onClick={() => setSelectedPortfolio(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all"><X size={20} /></button>

              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-yellow-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-gray-800"><Building2 size={40} className="text-gray-900" /></div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{selectedPortfolio.name}</h2>
                  <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">{selectedPortfolio.industry} Segment</p>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-10 flex-1 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText size={12} className="text-yellow-600" /> Active Covers</p>
                  <p className="text-4xl font-black text-gray-800">{selectedPortfolio.policies}</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 shadow-sm">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck size={12} /> Health Score</p>
                  <p className="text-4xl font-black text-emerald-600">{selectedPortfolio.health || 0}%</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] flex items-center gap-2"><PieChart className="text-yellow-600" size={16} /> Risk Ledger</h3>
                </div>
                <div className="space-y-4">
                  {['Group Health (GHI)', 'Fleet Motor Liability', 'Marine Transit Cover'].map((policy, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl hover:border-yellow-500 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                          <p className="font-black text-gray-800 text-sm">{policy}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Expires: Dec 2026</p>
                        </div>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><History className="text-yellow-600" size={16} /> Claim Integrity</h3>
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Clock size={20} className="text-gray-300" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                    No critical claims filed in the last 36 months. <br />
                    <span className="text-emerald-600 not-italic uppercase tracking-widest font-black">Premier Risk maintained.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* UPDATED DRAWER ACTION - REMOVED DOWNLOAD AUDIT */}
            <div className="p-8 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => { handleOpenEdit(selectedPortfolio); setSelectedPortfolio(null); }}
                className="w-full bg-gray-800 text-yellow-500 border-2 border-yellow-600 font-black py-5 rounded-[1.5rem] shadow-xl uppercase text-[10px] tracking-[0.25em] hover:bg-black transition-all active:scale-95"
              >
                Edit Master Profile
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- ADD/EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

            <div className="bg-gray-800 p-8 flex justify-between items-center text-white relative">
              <div className="absolute inset-y-0 left-0 w-2 bg-yellow-600"></div>
              <div>
                <h3 className="font-black uppercase tracking-[0.3em] text-xs">Identity Management</h3>
                <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">{modalMode === 'add' ? 'Register New Corporate' : `Updating ${formData.name}`}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-xl transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-10 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Legal Entity Name</label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-gray-800 focus:ring-2 focus:ring-yellow-600 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Segment</label>
                <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-gray-800 focus:ring-2 focus:ring-yellow-600 outline-none appearance-none" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })}>
                  <option>Automotive</option><option>IT Services</option><option>Infrastructure</option><option>Retail</option><option>Logistics</option><option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Revenue (₹ Cr)</label>
                <input required type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-gray-800 focus:ring-2 focus:ring-yellow-600 outline-none" value={formData.revenue} onChange={e => setFormData({ ...formData, revenue: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-gray-800 focus:ring-2 focus:ring-yellow-600 outline-none" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-gray-800 focus:ring-2 focus:ring-yellow-600 outline-none appearance-none" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option>Prospect</option><option>Negotiation</option><option>Proposal</option><option>Active</option>
                </select>
              </div>

              <div className="col-span-2 flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-5 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-50 rounded-2xl transition-all">Decline</button>
                <button type="submit" className="flex-[2] bg-yellow-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-[10px] tracking-[0.2em] hover:bg-yellow-700 transition-all active:scale-95">Commit Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}