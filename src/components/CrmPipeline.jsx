import React, { useState, useEffect } from 'react';
import { DownloadCloud, Send, ShieldCheck, TrendingUp, Users, Shield, Activity, MessageCircle, FileText, Map, Settings, BarChart2, Car, Award, Mail } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

// --- LOGO MAPPING ---
const LOGO_MAP = {
  'ROYAL SUNDHARAM': 'royalsundharam.png', 'TATA AIG': 'tataaig.png', 'LIBERTY': 'liberty.png',
  'HDFC ERGO': 'hdfcergo.png', 'RELIANCE': 'reliance.png', 'DIGIT': 'digit.png',
  'SBI': 'sbigeneral.png', 'ICICI': 'icicilombard.png', 'NEW INDIA': 'newindiaassurance.png',
  'CHOLAINSURANCE': 'cholams.png', 'ZURICH KOTAK': 'hdfcergo.png', 'UNIVERSAL SAMPO': 'cholams.png'
};

const COMPANY_INSIGHTS = {
  'TATA AIG': "Exceptional claim settlement ratio and hassle-free cashless garage network.",
  'HDFC ERGO': "Lightning-fast AI-driven claim approvals and overnight vehicle repair.",
  'DIGIT': "100% digital, paperless claims process and unmatched smartphone-based self-inspection.",
  'ICICI': "Extensive network of cashless garages and 'InstaSpect' live video claim approvals.",
  'ROYAL SUNDHARAM': "Legacy insurer offering incredibly comprehensive add-ons.",
  'LIBERTY': "Excellent customized coverage packages with highly flexible IDV declaration rules.",
  'RELIANCE': "Highly aggressive pricing while maintaining a strong Pan-India presence.",
  'ZURICH KOTAK': "Seamless bank-integrated claim transfers and zero-depreciation coverage limits.",
  'SBI': "Backed by India's largest bank, unparalleled trust, and widespread rural/urban coverage.",
  'NEW INDIA': "Sovereign-backed PSU, offering supreme reliability for high-IDV vehicles.",
  'UNIVERSAL SAMPO': "Excellent balance of affordability and tier-2/tier-3 city garage networks.",
  'CHOLAINSURANCE': "Highly specialized local network penetration for rapid commercial settlements."
};

export default function CrmPipeline() {
  const [csvData, setCsvData] = useState([]);
  const [carDataDict, setCarDataDict] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [makeInput, setMakeInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedMakeKey, setSelectedMakeKey] = useState(null);

  const [rtoZone, setRtoZone] = useState('CHENNAI');
  const [ncb, setNcb] = useState('0');
  const [idv, setIdv] = useState(500000);

  const [quotes, setQuotes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchError, setSearchError] = useState('');

  const companiesList = [
    'ROYAL SUNDHARAM', 'TATA AIG', 'LIBERTY', 'HDFC ERGO', 'RELIANCE',
    'ZURICH KOTAK', 'DIGIT', 'SBI', 'ICICI', 'NEW INDIA', 'UNIVERSAL SAMPO', 'CHOLAINSURANCE'
  ];

  useEffect(() => {
    Papa.parse('/Generated_Massive_Vehicle_Premiums.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        const dict = {};
        results.data.forEach(row => {
          const make = row.MAKE;
          const variant = row['MODEL VARIANT'];
          if (make && variant) {
            if (!dict[make]) dict[make] = new Set();
            dict[make].add(variant);
          }
        });
        const formattedDict = {};
        Object.keys(dict).sort().forEach(make => {
          formattedDict[make] = Array.from(dict[make]).sort();
        });
        setCarDataDict(formattedDict);
        setIsDataLoading(false);
      },
      error: (err) => {
        console.error("Error loading CSV:", err);
        setIsDataLoading(false);
      }
    });
  }, []);

  const availableMakes = Object.keys(carDataDict);
  const filteredMakes = availableMakes.filter(m => m.toLowerCase().includes(makeInput.toLowerCase())).slice(0, 50);

  const handleMakeSelect = (make) => {
    setMakeInput(make);
    setSelectedMakeKey(make);
    setShowMakeDropdown(false);
    setModelInput('');
  };

  const handleMakeChange = (e) => {
    setMakeInput(e.target.value);
    setSelectedMakeKey(null);
    setShowMakeDropdown(true);
  };

  const availableModels = selectedMakeKey ? carDataDict[selectedMakeKey] : [];
  const filteredModels = availableModels.filter(m => m.toLowerCase().includes(modelInput.toLowerCase())).slice(0, 50);

  const handleModelSelect = (model) => {
    setModelInput(model);
    setShowModelDropdown(false);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setSearchError('');
    if (!selectedMakeKey || !modelInput) {
      setSearchError('Select Make and Variant.');
      return;
    }
    setIsGenerating(true);
    setQuotes([]);

    setTimeout(() => {
      const matchedRow = csvData.find(row =>
        row.LOCATION === rtoZone &&
        parseInt(row.NCB) === parseInt(ncb) &&
        row.MAKE === selectedMakeKey &&
        row['MODEL VARIANT'] === modelInput
      );

      if (!matchedRow) {
        setSearchError('No premium data found.');
        setIsGenerating(false);
        return;
      }

      const formattedIdv = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(idv);
      let generatedQuotes = [];
      companiesList.forEach(company => {
        const premiumValue = parseInt(matchedRow[company]);
        if (premiumValue && premiumValue > 0 && !isNaN(premiumValue)) {
          generatedQuotes.push({
            provider: company,
            id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
            numericPremium: premiumValue,
            premium: `₹${premiumValue.toLocaleString('en-IN')}`,
            idv: formattedIdv,
            tag: null
          });
        }
      });

      generatedQuotes.sort((a, b) => a.numericPremium - b.numericPremium);
      if (generatedQuotes.length > 0) generatedQuotes[0].tag = 'Best Value';
      setQuotes(generatedQuotes);
      setIsGenerating(false);
    }, 800);
  };

  // --- WHATSAPP SHARING ENGINE ---
  const handleWhatsAppShare = async (quote) => {
    await generateQuotePDF(quote.provider, quote.numericPremium);

    const message = `*DIRECT INSURANCE SERVICE - PREMIUM QUOTE*\n\n` +
                    `*Vehicle:* ${selectedMakeKey} - ${modelInput}\n` +
                    `*RTO Zone:* ${rtoZone}\n` +
                    `*NCB:* ${ncb}%\n` +
                    `*Insured Value (IDV):* ${quote.idv}\n\n` +
                    `*Selected Insurer:* ${quote.provider}\n` +
                    `*Gross Premium:* ${quote.premium}\n\n` +
                    `_Disclaimer: Indicative quote subject to final verification._\n\n` +
                    `Please find the official proposal PDF attached above. Reply to this message to proceed!`;
                    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  // --- EMAIL SHARING ENGINE ---
  const handleEmailShare = async (quote) => {
    await generateQuotePDF(quote.provider, quote.numericPremium);

    const subject = `Premium Motor Insurance Proposal - ${selectedMakeKey} ${modelInput}`;
    const body = `Dear Customer,\n\n` +
                 `Please find your indicative motor insurance quote below:\n\n` +
                 `Vehicle: ${selectedMakeKey} - ${modelInput}\n` +
                 `RTO Zone: ${rtoZone}\n` +
                 `NCB: ${ncb}%\n` +
                 `Insured Value (IDV): ${quote.idv}\n\n` +
                 `Selected Insurer: ${quote.provider}\n` +
                 `Gross Premium: ${quote.premium}\n\n` +
                 `Best regards,\n` +
                 `Direct Insurance Service`;

    const mailToUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.open(mailToUrl, '_blank'); 
    }, 500);
  };

  const generateQuotePDF = async (companyName, numericPremium) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const loadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => { resolve(null); };
      });
    };

    const [mainLogo, insurerLogo] = await Promise.all([loadImage('/logo.png'), loadImage(`/logos/${LOGO_MAP[companyName]}`)]);
    const simpleIdv = "Rs. " + idv.toLocaleString('en-IN');
    const netPremium = Math.round(numericPremium / 1.18);
    const gstAmount = numericPremium - netPremium;
    const tpPremium = 3221;
    const odPremium = Math.round((netPremium - tpPremium) * 0.65);
    const addOnPremium = netPremium - tpPremium - odPremium;

    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, pageWidth, 40, 'F');
    if (mainLogo) doc.addImage(mainLogo, 'PNG', 10, 8, 24, 24);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DIRECT INSURANCE SERVICE', 38, 22);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Motor Insurance Proposal', 38, 28);
    if (insurerLogo) { doc.addImage(insurerLogo, 'PNG', pageWidth - 55, 8, 40, 24); } 
    else { doc.setTextColor(202, 138, 4); doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(companyName, pageWidth - 14, 22, { align: 'right' }); }

    doc.setTextColor(0);
    doc.setFontSize(10);
    const quoteId = `QT-${Math.floor(Math.random() * 90000) + 10000}`;
    doc.text(`Quote Reference: ${quoteId}`, 14, 50);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 50, { align: 'right' });

    autoTable(doc, {
      startY: 55, theme: 'grid', headStyles: { fillColor: [31, 41, 55] },
      columnStyles: { 0: { cellWidth: 45 }, 1: { fontStyle: 'bold' }, 2: { cellWidth: 40 }, 3: { fontStyle: 'bold' } },
      head: [[{ content: 'VEHICLE & COVERAGE DETAILS', colSpan: 4 }]],
      body: [['Make & Model', `${makeInput} ${modelInput}`, 'RTO Zone', rtoZone], ['Year of Mfg', '2024 / New', 'Fuel Type', 'Petrol / Diesel'], ['Insured Value (IDV)', simpleIdv, 'NCB Status', `${ncb}%`]],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10, theme: 'plain', columnStyles: { 1: { halign: 'right' } },
      head: [['PREMIUM BREAKDOWN', 'AMOUNT (INR)']],
      body: [['Basic Own Damage (OD)', `Rs. ${odPremium.toLocaleString('en-IN')}`], ['Add-On Covers (Zero Dep+RSA)', `Rs. ${addOnPremium.toLocaleString('en-IN')}`], ['Third Party Liability', `Rs. ${tpPremium.toLocaleString('en-IN')}`], [{ content: 'Net Premium', fontStyle: 'bold' }, { content: `Rs. ${netPremium.toLocaleString('en-IN')}`, fontStyle: 'bold' }], ['GST (18%)', `Rs. ${gstAmount.toLocaleString('en-IN')}`]],
      footStyles: { fillColor: [219, 234, 254], textColor: [0, 0, 0], fontSize: 12, fontStyle: 'bold' },
      foot: [['FINAL PAYABLE PREMIUM', `Rs. ${numericPremium.toLocaleString('en-IN')}`]]
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10, theme: 'grid', headStyles: { fillColor: [31, 41, 55], textColor: 255, fontStyle: 'bold', halign: 'left' }, bodyStyles: { textColor: 50, fontSize: 9, cellPadding: 2, halign: 'left' },
      columnStyles: { 0: { cellWidth: 'auto' } }, head: [['ADD-ON COVERAGES INCLUDED IN THIS PROPOSAL']],
      body: [['Zero Depreciation (Nil Depreciation) Cover'], ['Engine & Gearbox Protection Cover'], ['Consumables Cover'], ['24x7 Roadside Assistance (RSA)']], tableWidth: 'wrap', margin: { left: 14 }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    const disclaimerText = "Disclaimer: Indicative quotation based on parameters provided. Final premium subject to exact variant verification.";
    doc.text(doc.splitTextToSize(disclaimerText, pageWidth - 28), 14, finalY);
    doc.save(`Quote_${companyName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    // Beautiful Teal Background from the Design
    <div className="flex-1 overflow-y-auto bg-[#318f8e] p-6 h-full relative font-sans selection:bg-white/30">
      
      {isDataLoading && (
        <div className="absolute inset-0 bg-[#318f8e]/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-white">Loading Matrices...</p>
        </div>
      )}

      {/* Main Grid matching the new aesthetic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

        {/* LEFT COLUMN: KPI & Smart Comparator */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* KPI Widget */}
          <div className="bg-white rounded-[2rem] p-6 shadow-lg flex items-center justify-between border-4 border-white/40">
             <div className="bg-[#e8f4f4] p-4 rounded-full text-[#318f8e]">
               <Users size={32} strokeWidth={2.5}/>
             </div>
             <div className="text-right">
               <h3 className="text-3xl font-black text-gray-800">128</h3>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Active Leads</p>
             </div>
          </div>

          {/* Smart Comparator */}
          <div className="bg-white rounded-[2rem] shadow-xl p-8 border-4 border-white/40 flex-1 flex flex-col">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#e8f4f4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#318f8e]">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-black text-gray-800">Coverage Portal</h2>
              <p className="text-xs text-gray-400 font-bold mt-1">Enter vehicle data to query premiums</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6 flex-1 flex flex-col">
              
              {/* Make Input */}
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Make</label>
                <input
                  type="text" value={makeInput} onChange={handleMakeChange} onFocus={() => setShowMakeDropdown(true)} onBlur={() => setTimeout(() => setShowMakeDropdown(false), 200)}
                  placeholder="e.g. HYUNDAI"
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-black text-gray-800 focus:ring-4 focus:ring-[#318f8e]/20 focus:border-[#318f8e] outline-none transition-all shadow-sm" required
                />
                {showMakeDropdown && makeInput.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">
                    {filteredMakes.map((make, idx) => (
                      <div key={idx} onMouseDown={() => handleMakeSelect(make)} className="px-5 py-3 text-xs font-black text-gray-700 hover:bg-[#e8f4f4] hover:text-[#318f8e] cursor-pointer transition-colors border-b border-gray-50 last:border-0">{make}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variant Input */}
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Variant</label>
                <input
                  type="text" disabled={!selectedMakeKey} value={modelInput} onChange={(e) => { setModelInput(e.target.value); setShowModelDropdown(true); }} onFocus={() => { if (selectedMakeKey) setShowModelDropdown(true); }} onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                  placeholder={selectedMakeKey ? "Select Variant" : "Select Make first"}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-black text-gray-800 focus:ring-4 focus:ring-[#318f8e]/20 focus:border-[#318f8e] outline-none transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400" required
                />
                {showModelDropdown && selectedMakeKey && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">
                    {filteredModels.map((variant, idx) => (
                      <div key={idx} onMouseDown={() => handleModelSelect(variant)} className="px-5 py-3 text-xs font-black text-gray-700 hover:bg-[#e8f4f4] hover:text-[#318f8e] cursor-pointer transition-colors border-b border-gray-50 last:border-0">{variant}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* RTO & NCB */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Zone</label>
                  <select value={rtoZone} onChange={e => setRtoZone(e.target.value)} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-black text-gray-800 outline-none appearance-none shadow-sm focus:border-[#318f8e]">
                    <option value="CHENNAI">Chennai</option><option value="COIMBATORE">Coimbatore</option><option value="OUTER">Rest of TN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">NCB</label>
                  <select value={ncb} onChange={e => setNcb(e.target.value)} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-black text-gray-800 outline-none appearance-none shadow-sm focus:border-[#318f8e]">
                    <option value="0">0%</option><option value="20">20%</option><option value="25">25%</option><option value="35">35%</option><option value="45">45%</option><option value="50">50%</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <div className="flex justify-between items-end mb-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">IDV Limit</label>
                  <span className="font-black text-xl text-[#318f8e]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(idv)}</span>
                </div>
                <input type="range" min="100000" max="5000000" step="50000" value={idv} onChange={e => setIdv(Number(e.target.value))} className="w-full accent-[#318f8e] h-2.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                
                {searchError && <div className="text-red-500 text-xs font-bold mt-4 text-center">{searchError}</div>}

                <button type="submit" disabled={isGenerating || !selectedMakeKey || !modelInput} className="w-full bg-[#0d5c5a] hover:bg-[#0a4746] text-white font-black py-4 rounded-2xl shadow-xl mt-6 uppercase tracking-widest text-[11px] transition-all active:scale-95 disabled:bg-gray-300">
                  {isGenerating ? "Parsing..." : "Generate Quote"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Dashboard */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visual Area / Results Container */}
          <div className="bg-white rounded-[2rem] shadow-xl p-8 border-4 border-white/40 flex-1 flex flex-col relative overflow-hidden">
            
            {quotes.length === 0 && !isGenerating && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50">
                  <div className="relative w-64 h-64 mb-8">
                     <div className="absolute inset-0 bg-[#e8f4f4] rounded-full scale-150 blur-3xl opacity-70"></div>
                     <ShieldCheck size={120} className="absolute inset-0 m-auto text-[#318f8e] drop-shadow-xl" strokeWidth={1} />
                     <Car size={40} className="absolute bottom-10 right-10 text-[#0d5c5a] bg-white p-2 rounded-xl shadow-lg" />
                     <FileText size={40} className="absolute top-10 left-10 text-orange-500 bg-white p-2 rounded-xl shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0d5c5a] relative z-10">System Ready</h3>
                  <p className="text-gray-500 font-bold mt-2 relative z-10">Configure parameters to initiate scan</p>
               </div>
            )}

            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Activity size={50} className="text-[#318f8e] animate-spin mb-6" />
                <h3 className="text-xl font-black text-gray-800">Processing...</h3>
              </div>
            )}

            {quotes.length > 0 && !isGenerating && (
              <div className="animate-in fade-in flex flex-col h-full z-10 bg-white">
                <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="text-3xl font-black text-[#0d5c5a] tracking-tight">Active Matrix</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                      {selectedMakeKey} • {modelInput}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-black text-orange-500">{quotes.length}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matches</p>
                  </div>
                </div>

                {/* Intelligent Insight Card */}
                <div className="bg-gradient-to-r from-[#0d5c5a] to-[#318f8e] text-white rounded-3xl p-6 shadow-xl mb-6 flex gap-5 items-center">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Award className="text-yellow-300" size={28} />
                  </div>
                  <div>
                    <h4 className="text-yellow-300 font-black text-[20px] uppercase tracking-widest mb-1 drop-shadow-sm">AI Insights</h4>
                    <p className="text-white font-medium text-sm drop-shadow-md">
                      <strong className="font-black text-lg mr-2">{quotes[0].provider}</strong>
                      {COMPANY_INSIGHTS[quotes[0].provider] || "Optimal balance of coverage and pricing for this asset."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 overflow-y-auto no-scrollbar pr-2 flex-1 pb-4">
                  {quotes.map((quote, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#318f8e] transition-all shadow-sm hover:shadow-md group">
                      
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-[#0d5c5a] bg-[#e8f4f4]">
                          {quote.provider.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                             <h4 className="font-black text-lg text-gray-800">{quote.provider}</h4>
                             {idx === 0 && <span className="text-[9px] bg-orange-500 text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-widest shadow-sm">Best Value</span>}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                            IDV Limit: <span className="text-gray-700">{quote.idv}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Premium</p>
                           <p className="text-2xl font-black text-[#0d5c5a]">{quote.premium}</p>
                        </div>
                        
                        <div className="flex gap-2 border-l-2 border-gray-100 pl-6 py-2">
                          <button onClick={() => handleWhatsAppShare(quote)} className="p-3 text-[#318f8e] hover:text-white bg-[#e8f4f4] hover:bg-[#318f8e] rounded-xl transition-all active:scale-95 shadow-sm" title="Share via WhatsApp">
                            <MessageCircle size={20} />
                          </button>
                          
                          <button onClick={() => handleEmailShare(quote)} className="p-3 text-[#318f8e] hover:text-white bg-[#e8f4f4] hover:bg-[#318f8e] rounded-xl transition-all active:scale-95 shadow-sm" title="Share via Email">
                            <Mail size={20} />
                          </button>

                          <button onClick={() => generateQuotePDF(quote.provider, quote.numericPremium)} className="p-3 text-white bg-[#0d5c5a] hover:bg-gray-800 rounded-xl transition-all active:scale-95 shadow-sm" title="Download PDF">
                            <DownloadCloud size={20} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}