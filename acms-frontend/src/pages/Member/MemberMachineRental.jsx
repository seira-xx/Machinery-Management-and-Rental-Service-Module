// src/pages/Member/MemberMachineRental.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiMagnify, 
  mdiPlus, 
  mdiCheckCircleOutline, 
  mdiInformationOutline
} from '@mdi/js';

const MachineRental = () => {
  const [rentals, setRentals] = useState([]);
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({ type: null, open: false });

  const getMemberData = () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      let rawId = savedUser?.member_id || savedUser?.id || "";
      if (rawId.startsWith('U-')) {
        rawId = rawId.replace('U-', 'MEM-');
      }
      return { 
        id: rawId, 
        db_user_id: savedUser?.user_id || null 
      };
    } catch (e) {
      return { id: null, db_user_id: null };
    }
  };

  const [formData, setFormData] = useState({
    member_id: "", 
    machine_id: "", 
    user_id: null, 
    rental_purpose: "",
    date_rented: null, 
    rental_status: "Pending" 
  });

  useEffect(() => {
    const member = getMemberData();
    if (member.id) {
      setFormData(prev => ({ 
        ...prev, 
        member_id: member.id,
        user_id: member.db_user_id 
      }));
    }
    fetchMyRentals();
    fetchAvailableMachines();
  }, []);

  const fetchMyRentals = async () => {
    const memberId = getMemberData().id;
    if (!memberId) return;
    try {
      const res = await axios.get('http://localhost:5000/api/rental-requests');
      const myData = res.data.filter(r => String(r.member_id) === String(memberId));
      setRentals(myData);
    } catch (err) { console.error(err); }
  };

  const fetchAvailableMachines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-registry');
      // Filter for Available equipment
      setMachines(res.data.filter(m => m.machine_status === 'Available'));
    } catch (err) { 
      console.error("Error fetching machines:", err); 
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    const payload = {
      member_id: formData.member_id,
      machine_id: formData.machine_id,
      user_id: formData.user_id,
      rental_purpose: formData.rental_purpose,
      date_rented: null, 
      rental_status: "Pending"
    };

    try {
      await axios.post('http://localhost:5000/api/rental-requests', payload);
      await fetchMyRentals();
      setModalState({ type: 'success', open: true });
    } catch (err) {
      console.error(err);
      alert("Error: Please select a machine and provide a purpose.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Rental Requests</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your equipment bookings</p>
        </div>
        <button 
          onClick={() => setModalState({ type: 'form', open: true })}
          className="bg-[#10a34a] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors hover:bg-emerald-700"
        >
          <Icon path={mdiPlus} size={0.7} /> New Request
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-64">
            <Icon path={mdiMagnify} size={0.6} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-slate-900 text-xs font-bold border-b border-gray-100 uppercase">
            <tr>
              <th className="px-6 py-4">Equipment</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rentals.map((r) => (
              <tr key={r.rental_id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">Machine #{r.machine_id}</td>
                <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">{r.rental_purpose}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    r.rental_status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{r.rental_status}</span>
                </td>
                <td className="px-6 py-4 text-center text-gray-300">
                  <Icon path={mdiInformationOutline} size={0.6} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {modalState.open && modalState.type === 'form' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-[460px] shadow-2xl p-10">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-1">New Rental Request</h2>
            <p className="text-sm text-slate-500 mb-8">Choose from available inventory.</p>
            
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Available Equipment</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white appearance-none cursor-pointer"
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                  >
                    <option value="">Choose equipment...</option>
                    {machines.map(m => (
                      <option key={m.machine_id} value={m.machine_id}>
                        {/* 
                          Using machine_brand and machine_type_name 
                          based on the OPMachineType logic 
                        */}
                        {m.machine_brand} - {m.machine_type_name || "Equipment"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Purpose</label>
                <textarea 
                  required
                  placeholder="What will you use the equipment for?"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 h-36 bg-white resize-none"
                  value={formData.rental_purpose}
                  onChange={(e) => setFormData({...formData, rental_purpose: e.target.value})}
                />
              </div>

              <div className="flex justify-end items-center gap-6 pt-4">
                <button 
                  type="button" 
                  onClick={() => setModalState({open: false})} 
                  className="text-sm font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-[#065f46] text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-shadow shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {modalState.open && modalState.type === 'success' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl w-[320px] p-8 shadow-2xl text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 mx-auto text-[#10a34a]">
              <Icon path={mdiCheckCircleOutline} size={1} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Request Sent!</h2>
            <p className="text-slate-500 text-xs mb-6 font-medium">Your submission is now pending approval.</p>
            <button 
              onClick={() => {
                setModalState({open: false});
                setFormData(prev => ({...prev, machine_id: "", rental_purpose: ""}));
              }} 
              className="w-full py-2.5 bg-[#10a34a] text-white rounded-lg font-bold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineRental;