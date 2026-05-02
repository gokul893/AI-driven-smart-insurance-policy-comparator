import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Users, MapPin, Battery, Signal, Search, X, Clock, Activity,
  Phone, History, ShieldAlert, CheckCircle2, Navigation,
  Briefcase, FileText, ChevronRight, AlertCircle
} from 'lucide-react';
import L from 'leaflet';

// --- MANGADU HQ CONFIG ---
const MANGADU_HQ = [13.0390, 80.1240];
const ALLOWED_RADIUS = 500; // 500 Meters

// Distance calculator (Haversine Formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- CUSTOM MARKER ENGINE ---
const createCustomIcon = (status, name) => {
  let color = status === 'PRESENT' ? '#10b981' : status === 'PART-TIME' ? '#3b82f6' : '#ef4444';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${status === 'PRESENT' ? `<div class="absolute w-10 h-10 rounded-full opacity-20 animate-ping" style="background-color: ${color}"></div>` : ''}
        <div class="relative w-8 h-8 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center text-[11px] font-black text-white" style="background-color: ${color}">
          ${name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom, { animate: true, duration: 1.5 });
  return null;
}

export default function LiveTracking() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState(MANGADU_HQ);
  const [zoom, setZoom] = useState(14);

  // --- FULL 17-EMPLOYEE ROSTER WITH GEOFENCING ---
  const initialAgents = [
    { id: 1, name: 'Gokul Raj', role: 'Admin Executive', in: '09:00 AM', out: '08:00 PM', loc: [13.0395, 80.1245], battery: 82, signal: 'Strong', phone: '+91 90877 11111' },
    { id: 2, name: 'Dharshini', role: 'Admin Executive', in: '09:45 AM', out: '07:00 PM', loc: [13.0385, 80.1235], battery: 74, signal: 'Strong', phone: '+91 90877 22222' },
    { id: 3, name: 'Rajan', role: 'Admin Executive', in: '09:00 AM', out: '07:00 PM', loc: [13.0410, 80.1260], battery: 91, signal: 'Average', phone: '+91 90877 33333' },
    { id: 4, name: 'Sri Lakshmi', role: 'Admin Executive', in: '08:55 AM', out: '08:45 PM', loc: [13.0800, 80.2000], battery: 45, signal: 'Strong', phone: '+91 90877 44444' }, // Breach Example
    { id: 5, name: 'Sreeja', role: 'Admin Executive', in: '--', out: '--', loc: [12.9716, 80.2446], battery: 0, signal: 'Offline', phone: 'Not Available' },
    { id: 6, name: 'Beulah', role: 'Claim Advisor', in: '04:00 PM', out: '08:00 PM', loc: [13.0392, 80.1242], battery: 88, signal: 'Strong', phone: '+91 90877 66666' },
    { id: 7, name: 'Balaji', role: 'Insurance Advisor', in: '10:30 AM', out: '07:30 PM', loc: [13.0210, 80.1280], battery: 62, signal: 'Weak', phone: '+91 90877 77777' },
    { id: 8, name: 'Priyadharshini', role: 'Insurance Advisor', in: '08:45 AM', out: '06:10 PM', loc: [13.0390, 80.1240], battery: 77, signal: 'Strong', phone: '+91 90877 88888' },
    { id: 9, name: 'Abi', role: 'Insurance Advisor', in: '09:45 AM', out: '06:50 PM', loc: [13.0300, 80.1100], battery: 54, signal: 'Average', phone: '+91 90877 99999' },
    { id: 10, name: 'Jessie', role: 'Insurance Advisor', in: '09:20 AM', out: '06:20 PM', loc: [13.0450, 80.1300], battery: 69, signal: 'Strong', phone: '+91 90877 10101' },
    { id: 11, name: 'Sasikala', role: 'Insurance Advisor', in: '09:45 AM', out: '06:50 PM', loc: [13.0398, 80.1230], battery: 83, signal: 'Strong', phone: '+91 90877 11122' },
    { id: 12, name: 'Priya', role: 'Insurance Advisor', in: '10:45 AM', out: '07:50 PM', loc: [13.0800, 80.2000], battery: 41, signal: 'Weak', phone: '+91 90877 12131' }, // Breach Example
    { id: 13, name: 'Koteeswari', role: 'Insurance Advisor', in: '09:45 AM', out: '06:50 PM', loc: [13.0400, 80.1250], battery: 95, signal: 'Strong', phone: '+91 90877 14141' },
    { id: 14, name: 'Malathi', role: 'Insurance Advisor', in: '09:35 AM', out: '06:30 PM', loc: [13.0380, 80.1220], battery: 88, signal: 'Average', phone: '+91 90877 15151' },
    { id: 15, name: 'Devi', role: 'Insurance Advisor', in: '09:15 AM', out: '06:15 PM', loc: [13.0394, 80.1249], battery: 72, signal: 'Strong', phone: '+91 90877 16161' },
    { id: 16, name: 'Valli', role: 'Insurance Advisor', in: '--', out: '--', loc: [13.1000, 80.3000], battery: 0, signal: 'Offline', phone: 'Not Available' },
    { id: 17, name: 'Usha', role: 'Insurance Advisor', in: '09:45 AM', out: '07:30 PM', loc: [13.0382, 80.1242], battery: 66, signal: 'Strong', phone: '+91 90877 17171' },
  ];

  // Process data to apply geofence status
  const agents = useMemo(() => initialAgents.map(agent => {
    const dist = getDistance(agent.loc[0], agent.loc[1], MANGADU_HQ[0], MANGADU_HQ[1]);
    const isAtWork = dist <= ALLOWED_RADIUS;
    const isLeaveExplicit = agent.in === '--';

    return {
      ...agent,
      distance: Math.round(dist),
      status: isLeaveExplicit ? 'LEAVE' : (isAtWork ? 'PRESENT' : 'LEAVE'),
      violation: !isAtWork && !isLeaveExplicit
    };
  }), []);

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const focusAgent = (agent) => {
    setMapCenter(agent.loc);
    setZoom(16);
    setSelectedAgent(agent);
  };

  const handleCall = () => {
    if (selectedAgent?.phone && selectedAgent.phone !== 'Not Available') {
      window.location.href = `tel:${selectedAgent.phone.replace(/\s/g, '')}`;
    }
  };

  return (
    <div className="flex-1 h-screen bg-gray-50 flex overflow-hidden relative font-sans">

      {/* --- SIDEBAR --- */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col z-[100] shadow-xl">
        <div className="p-8 pb-6 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              <Navigation className="text-yellow-600" /> Mangadu HQ
            </h1>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
              {agents.filter(a => a.status === 'PRESENT').length} Active
            </span>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-3.5 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Filter employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-yellow-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar bg-gray-50/30">
          {filteredAgents.map(agent => (
            <div
              key={agent.id}
              onClick={() => focusAgent(agent)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group ${selectedAgent?.id === agent.id
                ? 'bg-white border-yellow-500 shadow-lg'
                : 'bg-white border-transparent hover:border-gray-200'
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-sm ${agent.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-black text-sm">{agent.name}</h3>
                    <p className={`text-[10px] font-black uppercase ${agent.status === 'PRESENT' ? 'text-emerald-500' : 'text-red-400'}`}>
                      {agent.status} • {agent.distance}m away
                    </p>
                  </div>
                </div>
                {agent.violation && <ShieldAlert size={16} className="text-red-600 animate-bounce" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MAP CANVAS --- */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={zoom} className="w-full h-full" zoomControl={false}>
          <ChangeView center={mapCenter} zoom={zoom} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />

          {/* HQ & RADIUS */}
          <Circle center={MANGADU_HQ} radius={ALLOWED_RADIUS} pathOptions={{ fillColor: '#ca8a04', color: '#ca8a04', weight: 1, opacity: 0.5, fillOpacity: 0.1 }} />
          <Marker position={MANGADU_HQ} icon={L.divIcon({ html: '<div class="w-4 h-4 bg-gray-800 border-2 border-yellow-500 rounded-full"></div>' })} />

          {agents.map(agent => (
            <Marker key={agent.id} position={agent.loc} icon={createCustomIcon(agent.status, agent.name)} eventHandlers={{ click: () => focusAgent(agent) }}>
              <Popup>
                <div className="p-1 text-center">
                  <p className="font-black text-gray-800">{agent.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">{agent.distance}m from Mangadu</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Quick Summary Overlay */}
        <div className="absolute top-8 left-8 flex gap-4 z-[1000]">
          <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Users size={20} /></div>
            <div><p className="text-[10px] font-black text-gray-400 uppercase">On-Site</p><p className="text-lg font-black text-gray-800">{agents.filter(a => a.status === 'PRESENT').length}</p></div>
          </div>
          {agents.some(a => a.violation) && (
            <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center gap-4 shadow-xl animate-pulse">
              <ShieldAlert size={20} />
              <div><p className="text-[10px] font-black uppercase opacity-80">Geofence Breach</p><p className="text-lg font-black">{agents.filter(a => a.violation).length} Flagged</p></div>
            </div>
          )}
        </div>
      </div>

      {/* --- DETAIL DRAWER --- */}
      {selectedAgent && (
        <>
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-[110]" onClick={() => setSelectedAgent(null)}></div>
          <div className="fixed inset-y-0 right-0 w-[420px] bg-white shadow-2xl z-[120] animate-in slide-in-from-right duration-500 flex flex-col border-l">

            <div className="bg-gray-800 p-10 text-white relative">
              <button onClick={() => setSelectedAgent(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-all"><X size={20} /></button>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-yellow-600 rounded-[2rem] flex items-center justify-center border-4 border-gray-800 shadow-2xl text-3xl font-black text-gray-900">{selectedAgent.name.charAt(0)}</div>
                <div>
                  <h2 className="text-2xl font-black">{selectedAgent.name}</h2>
                  <p className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest">{selectedAgent.role}</p>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-8 flex-1 overflow-y-auto no-scrollbar">
              <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Geofence Intelligence</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedAgent.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {selectedAgent.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-700">Currently <span className="text-yellow-600">{selectedAgent.distance}m</span> from Mangadu Office.</p>
                {selectedAgent.violation && <p className="text-xs text-red-600 font-bold mt-2 italic flex items-center gap-1"><AlertCircle size={12} /> Automatically marked as LEAVE due to location breach.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Shift Start</p>
                  <p className="text-lg font-black text-gray-800">{selectedAgent.in}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Shift End</p>
                  <p className="text-lg font-black text-gray-800">{selectedAgent.out}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleCall} className="w-full bg-gray-800 text-yellow-500 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-black transition-all border-2 border-yellow-600 flex items-center justify-center gap-3">
                  <Phone size={14} /> Call Employee
                </button>
                <button onClick={() => setShowLogModal(true)} className="w-full bg-white text-gray-400 border border-gray-200 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                  <History size={14} /> View Activity Log
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- AUDIT LOG MODAL --- */}
      {showLogModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-gray-800 p-8 flex justify-between items-center text-white">
              <div><h3 className="font-black uppercase tracking-widest text-xs">Security Audit Log</h3><p className="text-yellow-500 text-[10px] font-bold uppercase mt-1">Trail for {selectedAgent?.name}</p></div>
              <button onClick={() => setShowLogModal(false)}><X size={20} /></button>
            </div>
            <div className="p-10 space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
              {[
                { time: selectedAgent?.in, event: 'Login Detected', desc: 'Secure device authentication successful.', type: 'success' },
                { time: '11:45 AM', event: 'Geofence Check', desc: `Agent validated at Mangadu (${selectedAgent?.distance}m).`, type: 'success' },
                { time: '01:30 PM', event: 'Status Sync', desc: 'Battery telemetry updated to database.', type: 'info' },
                { time: '04:15 PM', event: 'Network Ping', desc: 'Active signal verified via tower sync.', type: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1"></div>
                    {i !== 3 && <div className="w-0.5 h-full bg-gray-100 my-1"></div>}
                  </div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase">{log.time}</p><p className="font-black text-gray-800 text-sm">{log.event}</p><p className="text-xs text-gray-500">{log.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 border-t"><button onClick={() => setShowLogModal(false)} className="w-full bg-gray-800 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest">Close Audit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}