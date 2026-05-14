// src/pages/Cashier/CashierMachineRate.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencil, mdiCheckCircleOutline, mdiFilterVariant } from '@mdi/js';

const CashierMachineRate = () => {
  const [rates, setRates] = useState([]);
  const [machines, setMachines] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false });
  const [editingRate, setEditingRate] = useState(null);

  const [formData, setFormData] = useState({
    rate_id: "",
    machine_id: "",
    rate_amount: "",
    rate_type: "hour"
  });

  const [alertConfig, setAlertConfig] = useState({ title: "", message: "" });

  useEffect(() => {
    fetchRates();
    fetchMachines();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-rates');
      setRates(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMachines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-registry');
      setMachines(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingRate) {
        await axios.put(`http://localhost:5000/api/machine-rates/${editingRate.rate_id}`, formData);
      } else {
        const { rate_id, ...dataToSend } = formData;
        await axios.post('http://localhost:5000/api/machine-rates', dataToSend);
      }
      
      await fetchRates();
      setAlertConfig({
        title: "Success!",
        message: editingRate ? "Machine Rate Updated Successfully!" : "Machine Rate Created Successfully!"
      });
      setModalState({ type: 'success', open: true });
    } catch (err) { 
        alert(err.response?.data?.error || "Error saving rate"); 
    }
  };

  const filteredRates = rates.filter(r => {
    const machineIdStr = String(r.machine_id || "");
    const rateIdStr = String(r.rate_id || "");
    
    const matchesSearch = 
        machineIdStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
        rateIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.machine_type_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (r.machine_brand?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "All" || r.rate_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans animate-fadeIn">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Machine Rates</h1>
          <p className="text-gray-500 text-sm">Manage billing rates for equipment operation</p>
        </div>
        <button 
          onClick={() => {
            setEditingRate(null);
            setFormData({ rate_id: "", machine_id: "", rate_amount: "", rate_type: "hour" });
            setModalState({ type: 'form', open: true });
          }}
          className="bg-[#1DA04D] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold text-sm"
        >
          <Icon path={mdiPlus} size={0.7} /> Add Machine Rate
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-72">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search machine, brand, or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm focus:ring-1 focus:ring-[#1DA04D]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none text-gray-600 focus:ring-1 focus:ring-[#1DA04D]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Rate Types</option>
              <option value="hour">Per Hour</option>
              <option value="bag">Per Bag</option>
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Rate ID</th>
              <th className="px-6 py-4">Machine</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRates.map((rate) => (
              <tr key={rate.rate_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-sm text-gray-500">#{rate.rate_id}</td>
                <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{rate.machine_brand} {rate.machine_type_name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {rate.machine_id}</span>
                    </div>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-700">₱{parseFloat(rate.rate_amount).toLocaleString()}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    rate.rate_type === 'hour' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    Per {rate.rate_type}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => { setEditingRate(rate); setFormData(rate); setModalState({ type: 'form', open: true }); }}
                    className="text-gray-400 hover:text-[#1DA04D] transition-colors"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingRate ? "Edit Machine Rate" : "Add Machine Rate"}
              </h2>
              <hr className="mb-8 border-gray-100" />
              
              <form onSubmit={handleSave} className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Rate ID</label>
                <input 
                    disabled
                    type="text" 
                    placeholder="Auto-generated"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed outline-none text-sm"
                    value={editingRate ? formData.rate_id : ""}
                    readOnly
                />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Target Machine</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1DA04D] outline-none text-sm bg-white"
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                  >
                    <option value="">Select a Machine</option>
                    {machines.map(m => (
                      <option key={m.machine_id} value={m.machine_id}>
                        Unit #{m.machine_id} — {m.machine_brand} {m.machine_type_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Rate Amount (₱)</label>
                  <input 
                    required type="number" step="0.01" placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1DA04D] outline-none text-sm"
                    value={formData.rate_amount}
                    onChange={(e) => setFormData({...formData, rate_amount: e.target.value})}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Billing Basis</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#1DA04D] outline-none text-sm bg-white"
                    value={formData.rate_type}
                    onChange={(e) => setFormData({...formData, rate_type: e.target.value})}
                  >
                    <option value="hour">Per Hour</option>
                    <option value="bag">Per Bag</option>
                  </select>
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setModalState({open: false, type: null})} className="px-8 py-2 border border-gray-300 rounded-lg text-gray-500 font-semibold text-sm">Cancel</button>
                  <button type="submit" className="px-8 py-2 bg-[#1DA04D] text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors">Save Rate</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {modalState.open && modalState.type === 'success' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-[380px] p-10 shadow-2xl text-center flex flex-col items-center animate-scaleIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Icon path={mdiCheckCircleOutline} size={1.5} className="text-[#1DA04D]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{alertConfig.title}</h2>
            <p className="text-gray-500 text-sm mb-8">{alertConfig.message}</p>
            <button onClick={() => setModalState({open: false, type: null})} className="w-full py-3 bg-[#1DA04D] text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-all">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierMachineRate;