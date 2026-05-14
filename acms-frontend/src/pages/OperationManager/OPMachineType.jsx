// src/pages/OperationManager/OPMachineType.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencil, mdiClose, mdiCheckCircleOutline, mdiFilterVariant } from '@mdi/js';

const OPMachineType = () => {
  const [machineTypes, setMachineTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelFilter, setFuelFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false }); 
  const [editingType, setEditingType] = useState(null);
  
  
  const [formData, setFormData] = useState({ 
    machine_type_id: "", 
    machine_type_name: "", 
    machine_brand: "", 
    fuel_type: "Gasoline" 
  });

  const [alertConfig, setAlertConfig] = useState({ title: "", message: "" });

  useEffect(() => { fetchMachineTypes(); }, []);

  const fetchMachineTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-types');
      setMachineTypes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await axios.put(`http://localhost:5000/api/machine-types/${editingType.machine_type_id}`, formData);
      } else {
        const { machine_type_id, ...dataToSend } = formData;
        await axios.post('http://localhost:5000/api/machine-types', dataToSend);
      }
      fetchMachineTypes();

      setAlertConfig({
        title: "Success!",
        message: editingType ? "Machine Type Updated Successfully!" : "Machine Type Created Successfully!"
      });
      setModalState({ type: 'success', open: true });

    } catch (err) {
      console.error("Save Error:", err);
      alert(err.response?.data?.error || "Error saving data. Please check if the ID field is being sent incorrectly.");
    }
  };

  // Search and Fuel Filter Logic
  const filteredTypes = machineTypes.filter(t => {
    const matchesSearch = t.machine_type_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.machine_brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuel = fuelFilter === "All" || t.fuel_type === fuelFilter;
    return matchesSearch && matchesFuel;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Machine Types</h1>
          <p className="text-gray-500 text-sm">Configure equipment categories, brands, and fuel specifications</p>
        </div>
        <button 
          onClick={() => { 
            setEditingType(null); 
            setFormData({ machine_type_id: "", machine_type_name: "", machine_brand: "", fuel_type: "Gasoline" }); 
            setModalState({type: 'form', open: true}); 
          }}
          className="bg-[#10a34a] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
        >
          <Icon path={mdiPlus} size={0.7} /> Add Machine Type
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search and Filter Row  */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-72">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-600"
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
            >
              <option value="All">All Fuel Types</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Machine Type</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Fuel Type</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTypes.map((type) => (
              <tr key={type.machine_type_id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 font-bold text-slate-700 text-sm">{type.machine_type_name}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{type.machine_brand}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    type.fuel_type === 'Diesel' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {type.fuel_type}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => { 
                      setEditingType(type); 
                      setFormData(type); 
                      setModalState({type: 'form', open: true}); 
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
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingType ? "Edit Machine Type" : "Add Machine Type"}
              </h2>
              <hr className="mb-8 border-gray-100" />
              
              <form onSubmit={handleSave} className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Machine Type ID</label>
                <input 
                    disabled
                    type="text" 
                    placeholder="Auto-generated"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed outline-none text-sm"
                    value={editingType ? formData.machine_type_id : ""}
                    readOnly
                />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Machine Type Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., 4-Wheel Tractor"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.machine_type_name}
                    onChange={(e) => setFormData({...formData, machine_type_name: e.target.value})}
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Machine Brand</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Kubota"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.machine_brand}
                    onChange={(e) => setFormData({...formData, machine_brand: e.target.value})}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Fuel Type</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-sm bg-white"
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setModalState({open: false})}
                    className="px-8 py-2 border border-gray-300 rounded-lg text-gray-500 font-semibold hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2 bg-[#10a34a] text-white rounded-lg font-semibold hover:bg-emerald-700 text-sm"
                  >
                    Save
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
          <div className="bg-white rounded-xl w-[380px] p-10 shadow-2xl text-center flex flex-col items-center animate-scaleIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Icon path={mdiCheckCircleOutline} size={1.5} className="text-[#10a34a]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{alertConfig.title}</h2>
            <p className="text-gray-500 text-sm mb-8">{alertConfig.message}</p>
            <button 
              onClick={() => setModalState({open: false})}
              className="w-full py-3 bg-[#10a34a] text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OPMachineType;