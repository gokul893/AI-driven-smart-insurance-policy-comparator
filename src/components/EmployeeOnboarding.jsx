import React, { useState } from 'react';
import { Check, ChevronRight, UserPlus, ShieldCheck, Briefcase, IndianRupee } from 'lucide-react';

export default function EmployeeOnboarding({ onOnboard }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    role: '', salary: '',
    kyc: false, rules: false
  });

  const steps = [
    { id: 1, title: 'Identity' },
    { id: 2, title: 'Role & Comp' },
    { id: 3, title: 'Compliance' }
  ];

  const handleComplete = () => {
    // 1. Create the new employee object with defaults for Tracking & Attendance
    const newEmployee = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      status: 'PRESENT', // New employees start as present
      mode: 'WFO',       // Default to office
      in: '09:30 AM',    // Default shift start
      out: '--',
      phone: formData.phone,
      // Default location set to Mangadu HQ for Live Tracking
      loc: [13.0390, 80.1240],
      battery: 100,
      signal: 'Strong'
    };

    // 2. Send to Parent State (This adds them to Attendance & Live Tracking)
    if (onOnboard) {
      onOnboard(newEmployee);
    }

    // 3. Reset UI
    alert(`${formData.name} has been integrated into Agency systems!`);
    setStep(1);
    setFormData({ name: '', email: '', phone: '', role: '', salary: '', kyc: false, rules: false });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex items-center justify-center p-8 h-full font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-12 relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-600"></div>

        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl border-4 border-yellow-600">
            <UserPlus size={36} className="text-yellow-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">System Integration</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">New Employee Onboarding Protocol</p>
        </div>

        {/* Custom Progress Bar */}
        <div className="mb-12 relative px-10">
          <div className="absolute top-5 left-10 right-10 h-1 bg-gray-100 rounded-full"></div>
          <div
            className="absolute top-5 left-10 h-1 bg-yellow-500 transition-all duration-700 rounded-full"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          <div className="flex justify-between relative z-10">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 ${step > s.id ? 'bg-emerald-500 text-white shadow-lg' :
                  step === s.id ? 'bg-gray-800 text-yellow-500 shadow-xl scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'
                  }`}>
                  {step > s.id ? <Check size={20} /> : s.id}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-gray-800' : 'text-gray-300'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Legal Full Name</label>
                <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 font-bold text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Enter name as per Aadhar" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Corporate Email</label>
                  <input type="email" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 font-bold text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="name@direct.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Terminal Phone</label>
                  <input type="tel" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 font-bold text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="+91" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="bg-gray-800 p-6 rounded-[2rem] mb-6 flex items-center gap-4 border-2 border-yellow-600/20 shadow-xl">
                <Briefcase className="text-yellow-500" size={32} />
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-widest">Role Designation</h4>
                  <p className="text-gray-400 text-[10px] font-medium uppercase">Selection affects system access & shift timings</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <select
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="">Select Official Designation...</option>
                  <option value="Insurance Advisor">Insurance Advisor (9:30 - 6:30)</option>
                  <option value="Admin Executive">Admin Executive (9:30 - 7:30)</option>
                  <option value="Claim Advisor">Claim Advisor</option>
                </select>
                <div className="relative">
                  <input type="number" className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 font-black text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition-all pl-14" placeholder="Monthly CTC (INR)" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                  <IndianRupee className="absolute left-6 top-5 text-gray-400" size={20} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="p-6 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[2rem] flex items-center gap-4">
                <ShieldCheck className="text-emerald-600" size={32} />
                <p className="text-xs font-bold text-emerald-800 leading-relaxed uppercase tracking-tighter">Compliance Verification: Ensure Aadhar & PAN documents match the terminal data provided in Step 1.</p>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-yellow-500 group">
                  <input type="checkbox" className="w-5 h-5 accent-yellow-600" checked={formData.kyc} onChange={(e) => setFormData({ ...formData, kyc: e.target.checked })} />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-gray-900 transition-colors">I confirm Aadhar/PAN verification is successful.</span>
                </label>
                <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-yellow-500 group">
                  <input type="checkbox" className="w-5 h-5 accent-yellow-600" checked={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.checked })} />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-gray-900 transition-colors">I accept the Direct Insurance Force policy manual.</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-50">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className={`px-8 py-4 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-3 px-10 py-4 bg-gray-800 hover:bg-black text-yellow-500 font-black rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em] border-2 border-yellow-600"
          >
            {step === 3 ? 'Finalize Integration' : 'Continue'}
            {step < 3 && <ChevronRight size={16} />}
          </button>
        </div>

      </div>
    </div>
  );
}