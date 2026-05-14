// src/pages/OperationManager/OPMachineRegistry.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiMagnify, 
  mdiPlus, 
  mdiPencil, 
  mdiCheckCircleOutline, 
  mdiFilterVariant, 
  mdiTractor 
} from '@mdi/js';

const OPMachineRegistry = () => {
  const [machines, setMachines] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]); // For the dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false });
  const [editingMachine, setEditingMachine] = useState(null);

  const [formData, setFormData] = useState({
    machine_id: "",
    machine_type_id: "",
    acquisition_date: "",
    machine_condition: "Good",
    machine_status: "Available"
  });

  const [alertConfig, setAlertConfig] = useState({ title: "", message: "" });

  useEffect(() => {
    fetchMachines();
    fetchMachineTypes();
  }, []);

  const fetchMachines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-registry');
      setMachines(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMachineTypes = async () => {
    try {
      // Fetches the 'Active' types for the dropdown
      const res = await axios.get('http://localhost:5000/api/machine-types');
      setMachineTypes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingMachine) {
        await axios.put(`http://localhost:5000/api/machine-registry/${editingMachine.machine_id}`, formData);
      } else {
        // Omit machine_id for AUTO_INCREMENT
        const { machine_id, ...dataToSend } = formData;
        await axios.post('http://localhost:5000/api/machine-registry', dataToSend);
      }

      await fetchMachines();
      setAlertConfig({
        title: "Success!",
        message: editingMachine ? "Machine Details Updated!" : "Machine Successfully Registered!"
      });
      setModalState({ type: 'success', open: true });
    } catch (err) {
      alert(err.response?.data?.error || "Error saving machine");
    }
  };

  const filteredMachines = machines.filter(m => {
    const machineIdStr = String(m.machine_id || "");
    const typeName = (m.machine_type_name || "").toLowerCase();
    const brandName = (m.machine_brand || "").toLowerCase();
    
    const matchesSearch = 
      machineIdStr.includes(searchTerm.toLowerCase()) || 
      typeName.includes(searchTerm.toLowerCase()) || 
      brandName.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || m.machine_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Machine Registry</h1>
          <p className="text-gray-500 text-sm">Inventory of all physical equipment and assets</p>
        </div>
        <button 
          onClick={() => {
            setEditingMachine(null);
            setFormData({ machine_id: "", machine_type_id: "", acquisition_date: "", machine_condition: "Good", machine_status: "Available" });
            setModalState({ type: 'form', open: true });
          }}
          className="bg-[#10a34a] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-all"
        >
          <Icon path={mdiPlus} size={0.7} /> Register New Machine
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-72">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Machine Type..." 
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
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4">Machine Type</th>
              <th className="px-6 py-4">Acquired</th>
              <th className="px-6 py-4">Condition</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMachines.map((m) => (
              <tr key={m.machine_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-sm font-mono text-gray-500">#{m.machine_id}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Icon path={mdiTractor} size={0.6} />
                    </div>
                    <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-sm">
                        {m.machine_brand} {m.machine_type_name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {m.fuel_type} Fuel
                    </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {new Date(m.acquisition_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                    m.machine_condition === 'Good' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {m.machine_condition}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                    <div className={`w-2 h-2 rounded-full ${
                      m.machine_status === 'Available' ? 'bg-emerald-500' : 
                      m.machine_status === 'In Use' ? 'bg-blue-500' : 
                      m.machine_status === 'Under Maintenance' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    {m.machine_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => { 
                      setEditingMachine(m); 
                      // Format date for the HTML input field (YYYY-MM-DD)
                      const formattedDate = m.acquisition_date.split('T')[0];
                      setFormData({ ...m, acquisition_date: formattedDate }); 
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

      {/* FORM MODAL */}
      {modalState.open && modalState.type === 'form' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingMachine ? "Update Machine Record" : "Register New Machine"}
              </h2>
              
              <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Machine ID</label>
                  <input 
                    disabled readOnly 
                    type="text" 
                    placeholder="Auto-generated"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm outline-none"
                    value={editingMachine ? formData.machine_id : ""}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Machine Type</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.machine_type_id}
                    onChange={(e) => setFormData({...formData, machine_type_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {machineTypes.map(type => (
                      <option key={type.machine_type_id} value={type.machine_type_id}>
                        {type.machine_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Acquisition Date</label>
                  <input 
                    required 
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.acquisition_date}
                    onChange={(e) => setFormData({...formData, acquisition_date: e.target.value})}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Initial Condition</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.machine_condition}
                    onChange={(e) => setFormData({...formData, machine_condition: e.target.value})}
                  >
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Operational Status</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.machine_status}
                    onChange={(e) => setFormData({...formData, machine_status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setModalState({open: false, type: null})} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-500 font-semibold text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-[#10a34a] text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all">
                    {editingMachine ? "Update Machine" : "Register Machine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
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

export default OPMachineRegistry;