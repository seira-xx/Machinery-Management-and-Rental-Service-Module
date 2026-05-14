// src/pages/MechanicHead/MechanicHeadMaintenance.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiWrench, 
  mdiPlus, 
  mdiPencil, 
  mdiCheckCircleOutline, 
  mdiMagnify, 
  mdiFilterVariant
} from '@mdi/js';

const MechanicHeadMaintenance = () => {
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]); 
  const [maintTypes, setMaintTypes] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [modalState, setModalState] = useState({ open: false, type: null });
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    machine_id: "",
    maintenance_type_id: "",
    maintenance_date: "",
    maintenance_status: "Scheduled",
    part_replaced: "",
    maintenance_cost: ""
  });

  const [alertConfig, setAlertConfig] = useState({ title: "", message: "" });

  useEffect(() => {
    fetchRecords();
    fetchDropdownData();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/maintenance-records');
      setRecords(res.data);
    } catch (err) { console.error("Error fetching records:", err); }
  };

  const fetchDropdownData = async () => {
    try {
      const [mRes, tRes] = await Promise.all([
        axios.get('http://localhost:5000/api/machine-registry'),
        axios.get('http://localhost:5000/api/maintenance-types')
      ]);
      
      setMachines(mRes.data);

      const activeTypes = tRes.data.filter(type => type.status === 'Active');
      setMaintTypes(activeTypes); 
      
    } catch (err) { 
      console.error("Error fetching dropdowns:", err); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await axios.put(`http://localhost:5000/api/maintenance-records/${editingRecord.maintenance_id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/maintenance-records', formData);
      }
      
      await fetchRecords();
      setAlertConfig({
        title: "Success!",
        message: editingRecord ? "Maintenance Details Updated!" : "New Maintenance Activity Scheduled!"
      });
      setModalState({ type: 'success', open: true });
    } catch (err) {
      alert(err.response?.data?.error || "Error saving record");
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      String(r.machine_id).includes(searchTerm) || 
      r.maintenance_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.part_replaced || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || r.maintenance_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Scheduled': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Cancelled': return 'bg-gray-50 text-gray-400 border-gray-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance Logs</h1>
          <p className="text-gray-500 text-sm">Track repairs, scheduled servicing, and part replacements</p>
        </div>
        <button 
          onClick={() => {
            setEditingRecord(null);
            setFormData({ machine_id: "", maintenance_type_id: "", maintenance_date: "", maintenance_status: "Scheduled", part_replaced: "", maintenance_cost: "" });
            setModalState({ type: 'form', open: true });
          }}
          className="bg-[#10a34a] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-all"
        >
          <Icon path={mdiPlus} size={0.7} /> Schedule Maintenance
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-72">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Machine ID or Type..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none text-gray-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {['Scheduled', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Machine</th>
              <th className="px-6 py-4">Service Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Parts Replaced</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRecords.map((r) => (
              <tr key={r.maintenance_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    #{r.machine_id}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Icon path={mdiWrench} size={0.5} className="text-gray-400" />
                    <span className="font-semibold text-slate-700 text-sm">{r.maintenance_type}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {r.maintenance_date ? new Date(r.maintenance_date).toLocaleDateString() : '---'}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 italic">
                  {r.part_replaced || "None"}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                  {r.maintenance_cost ? `₱${Number(r.maintenance_cost).toLocaleString()}` : '---'}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(r.maintenance_status)}`}>
                    {r.maintenance_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => { 
                      setEditingRecord(r);
                      setFormData({
                        ...r,
                        maintenance_date: r.maintenance_date ? r.maintenance_date.split('T')[0] : ""
                      }); 
                      setModalState({ type: 'form', open: true }); 
                    }}
                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <Icon path={mdiPencil} size={0.7} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL  */}
      {modalState.open && modalState.type === 'form' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingRecord ? "Update Maintenance Log" : "New Maintenance Activity"}
              </h2>
              
              <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Machine Asset</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                  >
                    <option value="">Select Asset ID</option>
                    {machines.map(m => (
                      <option key={m.machine_id} value={m.machine_id}>#{m.machine_id} - {m.machine_brand} {m.machine_type_name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Service Type</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.maintenance_type_id}
                    onChange={(e) => setFormData({...formData, maintenance_type_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {maintTypes.map(t => (
                      <option key={t.maintenance_type_id} value={t.maintenance_type_id}>{t.maintenance_type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Service Date</label>
                  <input 
                    required 
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.maintenance_date}
                    onChange={(e) => setFormData({...formData, maintenance_date: e.target.value})}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Current Status</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.maintenance_status}
                    onChange={(e) => setFormData({...formData, maintenance_status: e.target.value})}
                  >
                    {['Scheduled', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Parts Replaced</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Engine Oil, Hydraulic Hose"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.part_replaced}
                    onChange={(e) => setFormData({...formData, part_replaced: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Maintenance Cost (₱)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-semibold text-emerald-600"
                    value={formData.maintenance_cost}
                    onChange={(e) => setFormData({...formData, maintenance_cost: e.target.value})}
                  />
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setModalState({open: false, type: null})} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-500 font-semibold text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-[#10a34a] text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all">
                    {editingRecord ? "Update Log" : "Save Log"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL  */}
      {modalState.open && modalState.type === 'success' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-[380px] p-10 shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Icon path={mdiCheckCircleOutline} size={1.5} className="text-[#10a34a]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{alertConfig.title}</h2>
            <p className="text-gray-500 text-sm mb-8">{alertConfig.message}</p>
            <button onClick={() => setModalState({open: false, type: null})} className="w-full py-3 bg-[#10a34a] text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicHeadMaintenance;