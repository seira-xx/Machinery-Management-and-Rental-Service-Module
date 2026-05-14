// src/pages/MechanicHead/MechanicHeadRegistry.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiMagnify, mdiCheckCircleOutline, mdiWrenchClock, mdiAlert } from '@mdi/js';

const MechanicHeadRegistry = () => {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [formData, setFormData] = useState({
    machine_condition: "Good",
    machine_status: "Available"
  });

  useEffect(() => { fetchMachines(); }, []);

  const fetchMachines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-registry');
      setMachines(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/machine-registry/status/${selectedMachine.machine_id}`, formData);
      fetchMachines();
      setModalOpen(false);
      setSuccessModal(true);
    } catch (err) { alert("Update failed. Check if server is running."); }
  };

  const filteredMachines = machines.filter(m => 
    m.machine_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.machine_type_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Machinery Registry</h1>
        <p className="text-gray-500 text-sm">Review equipment and update technical status.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-80">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search equipment..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1DA04D]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Machine Unit</th>
              <th className="px-6 py-4">Condition</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMachines.map((m) => (
              <tr key={m.machine_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-700 text-sm">
                  {m.machine_brand} {m.machine_type_name}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    m.machine_condition === 'Good' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {m.machine_condition}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      m.machine_status === 'Available' ? 'bg-emerald-500' : 
                      m.machine_status === 'Under Maintenance' ? 'bg-orange-500' : 'bg-gray-400'
                    }`} />
                    {m.machine_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => {
                      setSelectedMachine(m);
                      setFormData({ machine_condition: m.machine_condition, machine_status: m.machine_status });
                      setModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-[#1DA04D] hover:bg-emerald-50 rounded-lg transition-all"
                  >
                    <Icon path={mdiWrenchClock} size={0.8} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPDATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-8 shadow-2xl animate-scaleIn">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Update Condition</h2>
            
            <form onSubmit={handleUpdateStatus} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Machine Condition</label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-[#1DA04D] outline-none"
                  value={formData.machine_condition}
                  onChange={(e) => setFormData({...formData, machine_condition: e.target.value})}
                >
                  <option value="Good">Good</option>
                  <option value="Bad">Bad</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Operating Status</label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-[#1DA04D] outline-none"
                  value={formData.machine_status}
                  onChange={(e) => setFormData({...formData, machine_status: e.target.value})}
                >
                  <option value="Available">Available</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="In Use">In Use</option>
                  <option value="Decommissioned">Decommissioned</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1DA04D] text-white font-bold rounded-xl text-sm shadow-md">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-[320px] p-8 text-center shadow-2xl animate-scaleIn">
            <Icon path={mdiCheckCircleOutline} size={2} className="text-[#1DA04D] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-800">Status Synced</h2>
            <p className="text-gray-500 text-xs mt-2 mb-6">Database updated with latest machine health data.</p>
            <button onClick={() => setSuccessModal(false)} className="w-full py-2.5 bg-[#1DA04D] text-white rounded-xl font-bold text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicHeadRegistry;