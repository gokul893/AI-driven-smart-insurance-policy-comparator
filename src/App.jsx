import React, { useState, Component } from 'react';
import Sidebar from './components/Sidebar';
import CrmPipeline from './components/CrmPipeline';
import AttendanceTracker from './components/AttendanceTracker';
import EmployeeOnboarding from './components/EmployeeOnboarding';
import Login from './components/Login';
import KanbanPipeline from './components/KanbanPipeline';
import CompaniesDirectory from './components/CompaniesDirectory';
import LiveTracking from './components/LiveTracking';
import FinancialDashboard from './components/FinancialDashboard';
import ReportsModule from './components/ReportsModule';
import PolicyUploader from "./components/PolicyUploader";

// --- ENTERPRISE CRASH CATCHER (ERROR BOUNDARY) ---
class SystemErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo: errorInfo });
    console.error("System Caught Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 m-8 bg-red-50 border-2 border-red-200 rounded-[2rem] text-red-800 font-sans shadow-lg">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-2">⚠️ Module Crash Detected</h2>
          <p className="font-bold mb-6 text-red-600">The application caught a fatal error. Here are the details:</p>
          <div className="bg-white p-6 rounded-xl shadow-inner overflow-x-auto border border-red-100">
            <p className="font-mono text-sm font-black text-red-700">{this.state.error && this.state.error.toString()}</p>
            <pre className="font-mono text-[10px] text-gray-500 mt-4 leading-relaxed">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Reload Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- CENTRAL EMPLOYEE DATABASE ---
const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Gokul Raj', role: 'Admin Executive', status: 'PRESENT', mode: 'WFO', in: '09:00 AM', out: '08:00 PM', loc: [13.0395, 80.1245], battery: 82, signal: 'Strong', phone: '+91 90877 11111' },
  { id: 2, name: 'Dharshini', role: 'Admin Executive', status: 'PRESENT', mode: 'WFO', in: '09:45 AM', out: '07:00 PM', loc: [13.0385, 80.1235], battery: 74, signal: 'Strong', phone: '+91 90877 22222' },
  { id: 3, name: 'Rajan', role: 'Admin Executive', status: 'PRESENT', mode: 'WFO', in: '09:00 AM', out: '07:00 PM', loc: [13.0410, 80.1260], battery: 91, signal: 'Average', phone: '+91 90877 33333' },
  { id: 4, name: 'Sri Lakshmi', role: 'Admin Executive', status: 'PRESENT', mode: 'WFH', in: '08:55 AM', out: '08:45 PM', loc: [13.0800, 80.2000], battery: 45, signal: 'Strong', phone: '+91 90877 44444' },
  { id: 5, name: 'Sreeja', role: 'Admin Executive', status: 'LEAVE', mode: 'WFO', in: '--', out: '--', loc: [12.9716, 80.2446], battery: 0, signal: 'Offline', phone: 'Not Available' },
  { id: 6, name: 'Beulah', role: 'Claim Advisor', status: 'PART-TIME', mode: 'WFO', in: '04:00 PM', out: '08:00 PM', loc: [13.0392, 80.1242], battery: 88, signal: 'Strong', phone: '+91 90877 66666' },
  { id: 7, name: 'Balaji', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '10:30 AM', out: '07:30 PM', loc: [13.0210, 80.1280], battery: 62, signal: 'Weak', phone: '+91 90877 77777' },
  { id: 8, name: 'Priyadharshini', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '08:45 AM', out: '06:10 PM', loc: [13.0390, 80.1240], battery: 77, signal: 'Strong', phone: '+91 90877 88888' },
  { id: 9, name: 'Abi', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '09:45 AM', out: '06:50 PM', loc: [13.0300, 80.1100], battery: 54, signal: 'Average', phone: '+91 90877 99999' },
  { id: 10, name: 'Jessie', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '09:20 AM', out: '06:20 PM', loc: [13.0450, 80.1300], battery: 69, signal: 'Strong', phone: '+91 90877 10101' },
  { id: 11, name: 'Sasikala', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '09:45 AM', out: '06:50 PM', loc: [13.0398, 80.1230], battery: 83, signal: 'Strong', phone: '+91 90877 11122' },
  { id: 12, name: 'Priya', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '10:45 AM', out: '07:50 PM', loc: [13.0800, 80.2000], battery: 41, signal: 'Weak', phone: '+91 90877 12131' },
  { id: 13, name: 'Koteeswari', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFH', in: '09:45 AM', out: '06:50 PM', loc: [13.0400, 80.1250], battery: 95, signal: 'Strong', phone: '+91 90877 14141' },
  { id: 14, name: 'Malathi', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '09:35 AM', out: '06:30 PM', loc: [13.0380, 80.1220], battery: 88, signal: 'Average', phone: '+91 90877 15151' },
  { id: 15, name: 'Devi', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '09:15 AM', out: '06:15 PM', loc: [13.0394, 80.1249], battery: 72, signal: 'Strong', phone: '+91 90877 16161' },
  { id: 16, name: 'Valli', role: 'Insurance Advisor', status: 'LEAVE', mode: 'WFO', in: '--', out: '--', loc: [13.1000, 80.3000], battery: 0, signal: 'Offline', phone: 'Not Available' },
  { id: 17, name: 'Usha', role: 'Insurance Advisor', status: 'PRESENT', mode: 'WFO', in: '09:45 AM', out: '07:30 PM', loc: [13.0382, 80.1242], battery: 66, signal: 'Strong', phone: '+91 90877 17171' }
];

export default function App() {
  const [activeView, setActiveView] = useState('smart-comparator');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'sales'

  const [globalEmployees, setGlobalEmployees] = useState(INITIAL_EMPLOYEES);

  const handleAddNewEmployee = (newEmployee) => {
    setGlobalEmployees(prev => [...prev, newEmployee]);
  };

  // --- LOGIN HANDLER ---
  // Receives the role from Login.jsx and sets the state
  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={(role) => { 
          setIsLoggedIn(true); 
          setUserRole(role); 
        }} 
      />
    );
  }

  return (
    <div className="flex h-screen w-full font-sans bg-gray-50 overflow-hidden text-gray-800 selection:bg-yellow-500/30">
      
      {/* We pass userRole down to the Sidebar so it can hide the buttons */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userRole={userRole} 
      />

      <main className="flex-1 w-full h-full relative flex flex-col">
        {/* Top Accent Header */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-100 flex items-center px-8 shadow-sm justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-600">System Online</span>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Dynamic View Rendering Area */}
        <div className="flex-1 overflow-hidden relative">
          <SystemErrorBoundary key={activeView}>
            {(activeView === 'smart-comparator' || activeView === 'crm-pipeline') && <CrmPipeline />}
            {activeView === 'pipeline' && <KanbanPipeline />}
            {activeView === 'companies' && <CompaniesDirectory />}
            {activeView === 'financials' && <FinancialDashboard />}

            {/* HR Modules that share the Central Database */}
            {activeView === 'live-tracking' && <LiveTracking globalAgents={globalEmployees} />}
            {activeView === 'attendance' && <AttendanceTracker globalEmployees={globalEmployees} setGlobalEmployees={setGlobalEmployees} />}
            {activeView === 'onboard' && <EmployeeOnboarding onOnboard={handleAddNewEmployee} />}

            {/* Reports Module */}
            {activeView === 'reports' && <ReportsModule />}
            {activeView === 'policy-extractor' && <PolicyUploader />}
          </SystemErrorBoundary>
        </div>
      </main>
    </div>
  );
}