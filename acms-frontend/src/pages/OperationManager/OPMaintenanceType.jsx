// src/pages/OperationManager/OPMaintenanceType.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiMagnify, 
  mdiPlus, 
  mdiPencil, 
  mdiCheckCircleOutline, 
  mdiFilterVariant, 
  mdiTools 
} from '@mdi/js';

const OPMaintenanceType = () => {
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false });
  const [editingType, setEditingType] = useState(null);

  const [formData, setFormData] = useState({
    maintenance_type_id: "",
    maintenance_type: "",
    status: "Active"
  });

  const [alertConfig, setAlertConfig] = useState({ title: "", message: "" });

  useEffect(() => {
    fetchMaintenanceTypes();
  }, []);

  const fetchMaintenanceTypes = async () => {
    try {
      // For the management page, we want ALL types (Active & Inactive)
      // If your backend 'getMaintenanceTypes' is strictly filtered to 'Active',
      // you might need a separate 'admin' endpoint or remove the WHERE clause there.
      const res = await axios.get('http://localhost:5000/api/maintenance-types');
      setMaintenanceTypes(res.data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await axios.put(`http://localhost:5000/api/maintenance-types/${editingType.maintenance_type_id}`, formData);
      } else {
        // Strip the ID for AUTO_INCREMENT compliance
        const { maintenance_type_id, ...dataToSend } = formData;
        await axios.post('http://localhost:5000/api/maintenance-types', dataToSend);
      }

      await fetchMaintenanceTypes();
      setAlertConfig({
        title: "Success!",
        message: editingType ? "Maintenance Type Updated!" : "New Maintenance Type Added!"
      });
      setModalState({ type: 'success', open: true });
    } catch (err) {
      alert(err.response?.data?.error || "Error saving maintenance type");
    }
  };

  const filteredTypes = maintenanceTypes.filter(t => {
    // Safety check: Convert numeric ID to string to prevent crash
    const typeIdStr = String(t.maintenance_type_id || "");
    const typeName = t.maintenance_type?.toLowerCase() || "";
    
    const matchesSearch = 
      typeIdStr.includes(searchTerm.toLowerCase()) || 
      typeName.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance Types</h1>
          <p className="text-gray-500 text-sm">Define and manage equipment service categories</p>
        </div>
        <button 
          onClick={() => {
            setEditingType(null);
            setFormData({ maintenance_type_id: "", maintenance_type: "", status: "Active" });
            setModalState({ type: 'form', open: true });
          }}
          className="bg-[#10a34a] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
        >
          <Icon path={mdiPlus} size={0.7} /> Add New Type
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-72">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search type or ID..." 
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Type ID</th>
              <th className="px-6 py-4">Maintenance Service Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTypes.map((type) => (
              <tr key={type.maintenance_type_id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 text-sm text-gray-500 font-mono">#{type.maintenance_type_id}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <Icon path={mdiTools} size={0.6} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{type.maintenance_type}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    type.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {type.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => { 
                      setEditingType(type); 
                      setFormData(type); 
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingType ? "Edit Maintenance Type" : "Add Maintenance Type"}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Maintenance Type ID</label>
                  <input 
                    disabled
                    type="text" 
                    placeholder="Auto-generated"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed outline-none text-sm"
                    value={editingType ? formData.maintenance_type_id : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Service Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Change Oil, Engine Overhaul"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.maintenance_type}
                    onChange={(e) => setFormData({...formData, maintenance_type: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Status</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setModalState({open: false, type: null})} 
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-500 font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-[#10a34a] text-white rounded-lg font-semibold text-sm hover:bg-emerald-700"
                  >
                    Save Changes
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
            <button 
              onClick={() => setModalState({open: false, type: null})} 
              className="w-full py-3 bg-[#10a34a] text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OPMaintenanceType;