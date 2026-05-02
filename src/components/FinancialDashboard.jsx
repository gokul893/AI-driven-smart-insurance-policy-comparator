import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  IndianRupee, TrendingUp, TrendingDown, Clock, Download,
  ShieldCheck, Activity, Target, ArrowUpRight, Zap, Plus, Edit2, Trash2, X
} from 'lucide-react';

const COLORS = ['#1f2937', '#ca8a04', '#4b5563', '#fbbf24', '#71717a'];

export default function FinancialDashboard() {
  // --- STATE MANAGEMENT ---
  const [timeframe, setTimeframe] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const [deals, setDeals] = useState([
    { id: 1, customer: 'L&T Construction', date: '2024-03-15', value: 1200000, type: 'Annual', status: 'Settled', partner: 'Tata AIG' },
    { id: 2, customer: 'Tata Motors Fleet', date: '2024-04-01', value: 450000, type: 'Monthly', status: 'Pending', partner: 'ICICI Lombard' },
    { id: 3, customer: 'Swiggy Fleet Q1', date: '2024-04-12', value: 1850000, type: 'One-Time', status: 'Settled', partner: 'Digit' },
    { id: 4, customer: 'Wipro Cabs', date: '2024-02-22', value: 250000, type: 'Annual', status: 'Settled', partner: 'Reliance' },
  ]);

  const [formData, setFormData] = useState({ id: null, customer: '', date: '', value: '', type: 'Annual', status: 'Settled', partner: 'Tata AIG' });

  // --- CALCULATIONS (Dynamic Intelligence) ---
  const totalRevenue = useMemo(() => deals.reduce((acc, curr) => acc + Number(curr.value), 0), [deals]);
  const activePolicies = deals.length;

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => ({
      name: m,
      revenue: deals.filter(d => d.date.includes(`-0${months.indexOf(m) + 1}-`)).reduce((a, c) => a + c.value, 0),
      target: 4000000 // Mock Target
    }));
  }, [deals]);

  const partnerData = useMemo(() => {
    const partners = [...new Set(deals.map(d => d.partner))];
    return partners.map(p => ({
      name: p,
      value: deals.filter(d => d.partner === p).reduce((a, c) => a + c.value, 0)
    }));
  }, [deals]);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, customer: '', date: new Date().toISOString().split('T')[0], value: '', type: 'Annual', status: 'Settled', partner: 'Tata AIG' });
    setShowModal(true);
  };

  const handleOpenEdit = (deal) => {
    setModalMode('edit');
    setFormData(deal);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setDeals([...deals, { ...formData, id: Date.now(), value: Number(formData.value) }]);
    } else {
      setDeals(deals.map(d => d.id === formData.id ? { ...formData, value: Number(formData.value) } : d));
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this financial record?")) {
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Customer,Date,Value,Type,Status,Partner\n'];
    const rows = deals.map(d => `${d.customer},${d.date},${d.value},${d.type},${d.status},${d.partner}\n`);
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Revenue_Report_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8 h-full no-scrollbar relative font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">Financial Command</h1>
            <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
              <Zap size={14} className="text-yellow-600 fill-yellow-600" /> Automated Revenue Reconciliation
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleOpenAdd} className="bg-yellow-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg hover:bg-yellow-700 flex items-center gap-2 active:scale-95 uppercase text-xs tracking-widest transition-all">
              <Plus size={18} /> New Transaction
            </button>
            <button onClick={exportToCSV} className="bg-gray-800 text-yellow-500 border-2 border-yellow-600 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* --- KPI SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total GWP', value: `₹${(totalRevenue / 10000000).toFixed(2)} Cr`, icon: IndianRupee, color: 'text-blue-600' },
            { label: 'Policies', value: activePolicies, icon: ShieldCheck, color: 'text-emerald-600' },
            { label: 'Avg Ticket', value: `₹${(totalRevenue / activePolicies || 0).toLocaleString('en-IN')}`, icon: Target, color: 'text-purple-600' },
            { label: 'Settled', value: `${((deals.filter(d => d.status === 'Settled').length / deals.length) * 100).toFixed(0)}%`, icon: Activity, color: 'text-yellow-600' }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 hover:shadow-xl transition-all group">
              <div className={`p-3 w-fit rounded-2xl bg-gray-50 mb-4 group-hover:scale-110 transition-transform ${kpi.color}`}>
                <kpi.icon size={24} />
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* --- ANALYTICS CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8">
            <h3 className="font-black text-gray-800 text-xl mb-6 flex items-center gap-2">
              <TrendingUp className="text-yellow-600" /> Revenue Velocity (H1)
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ca8a04" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 900 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `${v / 100000}L`} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#ca8a04" strokeWidth={4} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="target" stroke="#1f2937" strokeWidth={2} strokeDasharray="8 8" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 flex flex-col">
            <h3 className="font-black text-gray-800 text-xl mb-6">Partner Split</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={partnerData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {partnerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {partnerData.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-gray-500">{p.name}</span>
                  </div>
                  <span className="text-gray-800">₹{(p.value / 100000).toFixed(1)} L</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- TRANSACTION TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b flex justify-between items-center">
            <h3 className="font-black text-gray-800 text-xl uppercase tracking-widest">Revenue Ledger</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                <th className="px-8 py-5">Customer</th>
                <th className="px-6 py-5">Partner</th>
                <th className="px-6 py-5 text-center">Plan</th>
                <th className="px-6 py-5 text-right">Value</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-800">{deal.customer}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{deal.date}</p>
                  </td>
                  <td className="px-6 py-6 font-bold text-xs text-gray-600">{deal.partner}</td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase ${deal.type === 'Annual' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {deal.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right font-black text-gray-800">₹{deal.value.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenEdit(deal)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm border"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(deal.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl shadow-sm border"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TRANSACTION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gray-800 p-8 flex justify-between items-center text-white">
              <h3 className="font-black uppercase tracking-[0.3em] text-xs">{modalMode === 'add' ? 'Record Revenue' : 'Adjust Transaction'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 grid grid-cols-2 gap-6">
              <div className="col-span-2"><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Corporate Client</label>
                <input required className="w-full p-4 bg-gray-50 border rounded-2xl font-black" value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })} /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Partner Insurer</label>
                <select className="w-full p-4 bg-gray-50 border rounded-2xl font-black" value={formData.partner} onChange={e => setFormData({ ...formData, partner: e.target.value })}>
                  <option>Tata AIG</option><option>ICICI Lombard</option><option>Digit</option><option>Reliance</option><option>HDFC Ergo</option>
                </select></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Premium Value (₹)</label>
                <input required type="number" className="w-full p-4 bg-gray-50 border rounded-2xl font-black" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Closing Date</label>
                <input type="date" className="w-full p-4 bg-gray-50 border rounded-2xl font-black" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Plan Tier</label>
                <select className="w-full p-4 bg-gray-50 border rounded-2xl font-black" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option>Annual</option><option>Monthly</option><option>One-Time</option>
                </select></div>
              <button type="submit" className="col-span-2 bg-yellow-600 text-white font-black py-5 rounded-2xl shadow-xl mt-4 uppercase text-xs tracking-widest">Commit to Ledger</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}