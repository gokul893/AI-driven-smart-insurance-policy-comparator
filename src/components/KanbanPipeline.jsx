import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreVertical, Phone, Building, Plus, Download, Trash2, X, IndianRupee, MapPin } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialData = {
  columns: {
    'col-1': { id: 'col-1', title: 'Qualification', taskIds: ['deal-1', 'deal-2'] },
    'col-2': { id: 'col-2', title: 'Needs Analysis', taskIds: ['deal-3'] },
    'col-3': { id: 'col-3', title: 'Proposal', taskIds: ['deal-4', 'deal-5'] },
    'col-4': { id: 'col-4', title: 'Negotiation', taskIds: [] },
    'col-5': { id: 'col-5', title: 'Closed Won', taskIds: ['deal-6'] },
    'col-6': { id: 'col-6', title: 'Closed Lost', taskIds: [] },
  },
  tasks: {
    'deal-1': { id: 'deal-1', name: 'Tata Motors Fleet', value: '450000', contact: 'Rahul Verma', company: 'Tata Motors', rto: 'CHENNAI' },
    'deal-2': { id: 'deal-2', name: 'L&T Construction', value: '1200000', contact: 'Anjali Desai', company: 'L&T', rto: 'COIMBATORE' },
    'deal-3': { id: 'deal-3', name: 'Wipro Cabs', value: '250000', contact: 'Suresh Kumar', company: 'Wipro', rto: 'OUTER' },
    'deal-4': { id: 'deal-4', name: 'Infosys Transport', value: '875000', contact: 'Manish Pandey', company: 'Infosys', rto: 'CHENNAI' },
    'deal-5': { id: 'deal-5', name: 'Zomato Delivery Bikes', value: '1500000', contact: 'Kirti Mehta', company: 'Zomato', rto: 'CHENNAI' },
    'deal-6': { id: 'deal-6', name: 'Swiggy Fleet Q1', value: '1850000', contact: 'Rohan Sharma', company: 'Swiggy', rto: 'COIMBATORE' },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6'],
};

// --- MODAL COMPONENT ---
const DealFormModal = ({ title, buttonLabel, deal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: deal ? deal.name : '',
    value: deal ? deal.value : '',
    contact: deal ? deal.contact : '',
    rto: deal ? deal.rto : 'CHENNAI',
    stage: 'col-1'
  });

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-lg w-full relative animate-in zoom-in-95 duration-300 border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 mb-6 inline-block border-b-4 border-yellow-600 pb-1">{title}</h2>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Deal Name</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-600 outline-none font-bold text-gray-800" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Value (₹)</label>
            <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-600 outline-none font-bold text-gray-800" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Name</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-600 outline-none font-bold text-gray-800" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} required />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registration Zone</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-600 outline-none font-bold text-gray-800" value={formData.rto} onChange={(e) => setFormData({ ...formData, rto: e.target.value })}>
              <option value="CHENNAI">Chennai</option>
              <option value="COIMBATORE">Coimbatore</option>
              <option value="OUTER">Outer TN</option>
            </select>
          </div>

          {!deal && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Initial Stage</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-600 outline-none font-bold text-gray-800" value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}>
                <option value="col-1">Qualification</option>
                <option value="col-2">Needs Analysis</option>
                <option value="col-3">Proposal</option>
                <option value="col-4">Negotiation</option>
              </select>
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors uppercase text-xs tracking-widest">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-gray-800 text-white font-black hover:bg-black rounded-xl shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest">
              {buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function KanbanPipeline() {
  const [data, setData] = useState(initialData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // --- ASYNC PDF LOGIC WITH BRANDING ---
  const generateDealPDF = async (deal) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentColumn = Object.values(data.columns).find(col => col.taskIds.includes(deal.id));
    const stageName = currentColumn ? currentColumn.title : 'Pipeline Stage';

    const loadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      });
    };

    const mainLogo = await loadImage('/logo.png');

    // 1. Header (Charcoal Gray)
    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, pageWidth, 40, 'F');
    if (mainLogo) doc.addImage(mainLogo, 'PNG', 10, 8, 24, 24);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DIRECT INSURANCE SERVICE', 40, 22);
    doc.setFontSize(9);
    doc.text('Official B2B Proposal Document', 40, 28);

    // 2. Body
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text('Client Opportunity Analysis', 14, 55);

    autoTable(doc, {
      startY: 60,
      theme: 'grid',
      headStyles: { fillColor: [31, 41, 55] },
      head: [['Parameter', 'Description / Value']],
      body: [
        ['Opportunity Name', deal.name],
        ['Associated Company', deal.company || 'Direct Insurance B2B'],
        ['Primary Contact', deal.contact],
        ['Estimated Deal Value', `INR ${Number(deal.value).toLocaleString('en-IN')}`],
        ['Registration Region', deal.rto || 'South Zone'],
        ['Current Pipeline Stage', stageName],
      ],
    });

    // 3. Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Direct CRM - Generated Securely by Admin | Confidential Document", pageWidth / 2, 285, { align: 'center' });

    doc.save(`Proposal_${deal.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSaveEdit = (updatedDetails) => {
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [selectedDeal.id]: { ...prev.tasks[selectedDeal.id], ...updatedDetails }
      }
    }));
    setShowEditModal(false);
  };

  const handleCreateLead = (newDetails) => {
    const newId = `deal-${Date.now()}`;
    const newTask = {
      id: newId,
      ...newDetails,
      company: newDetails.name.split(' ')[0]
    };

    setData(prev => {
      const stageColumn = prev.columns[newDetails.stage];
      return {
        ...prev,
        tasks: { ...prev.tasks, [newId]: newTask },
        columns: {
          ...prev.columns,
          [newDetails.stage]: { ...stageColumn, taskIds: [...stageColumn.taskIds, newId] }
        }
      };
    });
    setShowAddModal(false);
  };

  const handleDelete = (taskId) => {
    if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;

    setData(prev => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach(colId => {
        newColumns[colId].taskIds = newColumns[colId].taskIds.filter(id => id !== taskId);
      });

      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns
      };
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startCol = data.columns[source.droppableId];
    const finishCol = data.columns[destination.droppableId];

    if (startCol === finishCol) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      setData({ ...data, columns: { ...data.columns, [startCol.id]: { ...startCol, taskIds: newTaskIds } } });
      return;
    }

    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);
    const finishTaskIds = Array.from(finishCol.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    setData({
      ...data,
      columns: {
        ...data.columns,
        [startCol.id]: { ...startCol, taskIds: startTaskIds },
        [finishCol.id]: { ...finishCol, taskIds: finishTaskIds }
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-8 overflow-hidden relative">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Sales Pipeline</h1>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
            Drag deals to update progress • {Object.keys(data.tasks).length} Active Leads
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-yellow-50 p-2 rounded-lg"><IndianRupee size={18} className="text-yellow-600" /></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pipeline Value</p>
            <p className="text-lg font-black text-gray-800">
              ₹{Object.values(data.tasks).reduce((acc, curr) => acc + Number(curr.value || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {data.columnOrder.map(columnId => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

              return (
                <div key={column.id} className="w-80 shrink-0 bg-gray-100/40 rounded-[2rem] flex flex-col h-full border border-gray-200/50">
                  <div className="px-6 py-4 flex items-center justify-between shrink-0">
                    <h3 className="font-black text-gray-600 text-xs uppercase tracking-widest">{column.title}</h3>
                    <span className="bg-white text-gray-400 text-[10px] font-black px-2 py-1 rounded-full border border-gray-100">
                      {tasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`px-3 flex-1 overflow-y-auto no-scrollbar transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-yellow-50/30' : ''}`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-5 rounded-3xl border border-gray-100 mb-4 group transition-all relative ${snapshot.isDragging ? 'shadow-2xl scale-105 rotate-2 z-50 ring-2 ring-yellow-500' : 'hover:shadow-md hover:border-yellow-200'}`}
                              >
                                {/* HOVER ACTION BUTTONS */}
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => generateDealPDF(task)} className="bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-gray-50 rounded-xl p-2 shadow-sm" title="Download Proposal">
                                    <Download size={14} />
                                  </button>
                                  <button onClick={() => { setSelectedDeal(task); setShowEditModal(true); }} className="bg-white text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 border border-gray-50 rounded-xl p-2 shadow-sm" title="Edit">
                                    <MoreVertical size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(task.id)} className="bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-50 rounded-xl p-2 shadow-sm" title="Delete">
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                <h4 className="font-black text-gray-800 text-sm mb-1 pr-10 truncate">{task.name}</h4>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
                                  <MapPin size={10} className="text-yellow-600" /> {task.rto}
                                </div>

                                <div className="text-yellow-600 font-black text-xl mb-4">₹{Number(task.value).toLocaleString('en-IN')}</div>

                                <div className="space-y-2 pt-3 border-t border-gray-50">
                                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    <Building size={14} className="text-gray-300" /> {task.company}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    <Phone size={14} className="text-gray-300" /> {task.contact}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* FLOATING ACTION BUTTON (CORNER RIGHT) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-gray-800 text-yellow-500 rounded-[1.5rem] shadow-2xl flex items-center justify-center border-2 border-yellow-600 hover:bg-black hover:scale-110 transition-all active:scale-95 z-[90] group"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* MODALS */}
      {showEditModal && <DealFormModal title="Update Opportunity" buttonLabel="Save Changes" deal={selectedDeal} onSave={handleSaveEdit} onClose={() => setShowEditModal(false)} />}
      {showAddModal && <DealFormModal title="Build New Lead" buttonLabel="Construct Lead" onSave={handleCreateLead} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}