// src/pages/OperationManager/OPRentalRecord.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiMagnify, 
  mdiPlus, 
  mdiPencil, 
  mdiCheckCircleOutline, 
  mdiFilterVariant 
} from '@mdi/js';

const OPRentalRecord = () => {
  const [rentals, setRentals] = useState([]);
  const [machines, setMachines] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false });
  const [editingRental, setEditingRental] = useState(null);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "" });
  const [rates, setRates] = useState([]);
  

  
  const getLoggedUserId = () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    return savedUser?.id || ""; // Local Storage from Dev tools
  };

  const [formData, setFormData] = useState({
    rental_id: "",
    member_id: "", 
    machine_id: "", 
    user_id: getLoggedUserId(),
    rental_purpose: "",
    date_rented: "",
    rental_status: "Pending"
  });

  useEffect(() => {
    fetchRentals();
    fetchMachines();
    fetchMembers();
    fetchRates();
  }, []);

  const fetchRates = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/machine-rates');
    setRates(res.data);
  } catch (err) {
    console.error("Error fetching rates:", err);
  }
};

  const fetchRentals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rental-requests');
      setRentals(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMachines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/machine-registry');
      const availableOnly = res.data.filter(m => m.machine_status === 'Available');
      setMachines(availableOnly);
    } catch (err) { console.error(err); }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/members');
      setMembers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const currentId = getLoggedUserId();
    
    if (!currentId) {
      alert("Error: Logged-in User ID is missing. Please re-login.");
      return;
    }

    const finalData = { ...formData, user_id: currentId };

    try {
      if (editingRental) {
        const { rental_id, ...dataToUpdate } = finalData; 
        
        await axios.put(`http://localhost:5000/api/rental-requests/${editingRental.rental_id}`, dataToUpdate);

        
        if (dataToUpdate.rental_status === 'Approved') {
          // Find the specific rate for the selected machine
          const machineRateEntry = rates.find(r => r.machine_id === parseInt(dataToUpdate.machine_id));
          const actualRate = machineRateEntry ? machineRateEntry.rate_amount : 0;

          try {
            await axios.post('http://localhost:5000/api/rental-payments', {
              rental_id: editingRental.rental_id,
              member_id: dataToUpdate.member_id,
              machine_id: dataToUpdate.machine_id,
              rental_rate: actualRate, 
              payment_status: 'Pending'
            });
          } catch (payErr) {
            console.error("Payment record creation failed:", payErr);
          }
        }
      } else {
        const { rental_id, ...dataToSend } = finalData; 
        await axios.post('http://localhost:5000/api/rental-requests', dataToSend);
      }

      await fetchRentals();
      setAlertConfig({
        title: "Success!",
        message: editingRental ? "Rental Request Updated!" : "Rental Record Successfully Created!"
      });
      setModalState({ type: 'success', open: true });
    } catch (err) {
      alert(err.response?.data?.error || "Error saving rental record");
    }
  };

  const filteredRentals = rentals.filter(r => {
    const renterName = (r.member_id || "").toLowerCase();
    const purpose = (r.rental_purpose || "").toLowerCase();
    const matchesSearch = renterName.includes(searchTerm.toLowerCase()) || purpose.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.rental_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rental Request</h1>
          <p className="text-gray-500 text-sm font-medium">Approve Rental Request</p>
        </div>
        <button 
          onClick={() => {
            setEditingRental(null);
            setFormData({ 
              rental_id: "", 
              member_id: "", 
              machine_id: "", 
              user_id: getLoggedUserId(), // Pull user_id from localStorage for new records
              rental_purpose: "", 
              date_rented: "", 
              rental_status: "Pending" 
            });
            setMemberSearchTerm(""); 
            setModalState({ type: 'form', open: true });
          }}
          className="bg-[#10a34a] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-all shadow-sm"
        >
          <Icon path={mdiPlus} size={0.7} /> Create Record
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-80">
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
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none text-gray-600 font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Filter by</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Disapproved">Disapproved</option>
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-slate-900 text-sm font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Equipment</th>
              <th className="px-6 py-4">Renter</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Date Rented</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRentals.map((r) => (
              <tr key={r.rental_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-sm text-slate-700 font-medium">
                  {machines.find(m => m.machine_id === r.machine_id)?.machine_type_name || "Machine " + r.machine_id}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {(() => {
                    const m = members.find(m => m.member_id === r.member_id);
                    return m ? `${m.member_fname} ${m.member_lname}` : r.member_id;
                  })()}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 truncate max-w-xs">{r.rental_purpose}</td>
                <td className="px-6 py-5 text-sm text-slate-600 font-mono">
                  {r.date_rented 
                    ? new Date(r.date_rented).toLocaleDateString('en-CA') 
                    : "N/A"}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    r.rental_status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                    r.rental_status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {r.rental_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <button 
                    onClick={() => { 
                      setEditingRental(r); 
                      const formattedDate = r.date_rented ? r.date_rented.split('T')[0] : "";
                      setFormData({ ...r, date_rented: formattedDate, user_id: getLoggedUserId() });
                      const currentMember = members.find(m => m.member_id === r.member_id);
                      setMemberSearchTerm(currentMember ? `${currentMember.member_fname} ${currentMember.member_lname}` : r.member_id); 
                      setModalState({ type: 'form', open: true }); 
                    }}
                    className="text-gray-400 hover:text-emerald-600"
                  >
                    <Icon path={mdiPencil} size={0.7} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalState.open && modalState.type === 'form' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Request</h2>
              <div className="h-0.5 w-full bg-gray-100 mb-8" />
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Equipment</label>
                    <select 
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                      value={formData.machine_id}
                      onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                    >
                      <option value="">Select Equipment</option>
                      {machines.map(m => (
                        <option key={m.machine_id} value={m.machine_id}>
                          {m.machine_brand} {m.machine_type_name} (#{m.machine_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Date Rented</label>
                    <input 
                      required 
                      type="date"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                      value={formData.date_rented}
                      onChange={(e) => setFormData({...formData, date_rented: e.target.value})}
                    />
                  </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-bold text-slate-500">Renter</label>
                  <input 
                      required 
                      type="text"
                      placeholder="Search member name..."
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                      value={memberSearchTerm}
                      onChange={(e) => {
                        setMemberSearchTerm(e.target.value);
                        setShowMemberDropdown(true);
                      }}
                      onFocus={() => setShowMemberDropdown(true)}
                  />
                  {showMemberDropdown && memberSearchTerm && (
                    <div className="absolute top-[70px] w-full bg-white border border-gray-200 rounded-lg shadow-lg z-[70] max-h-48 overflow-y-auto">
                        {members
                        .filter(m => {
                            const search = memberSearchTerm.toLowerCase().trim();
                            const fname = (m.member_fname || "").toLowerCase();
                            const lname = (m.member_lname || "").toLowerCase();
                            const mid = (m.member_id || "").toLowerCase();
                            return fname.includes(search) || lname.includes(search) || mid.includes(search);
                        })
                        .map(m => (
                            <div 
                              key={m.member_id}
                              className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm border-b border-gray-50 last:border-none"
                              onClick={() => {
                                  setFormData({...formData, member_id: m.member_id});
                                  setMemberSearchTerm(`${m.member_fname} ${m.member_lname}`);
                                  setShowMemberDropdown(false);
                              }}
                            >
                              <p className="font-bold text-slate-700">{m.member_fname} {m.member_lname}</p>
                              <p className="text-[10px] text-gray-500 font-mono uppercase">{m.member_id}</p>
                            </div>
                        ))}
                    </div>
                  )}
                </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Status</label>
                    <select 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                      value={formData.rental_status}
                      onChange={(e) => setFormData({...formData, rental_status: e.target.value})}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Disapproved">Disapproved</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Purpose</label>
                    <textarea 
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500 h-28"
                      value={formData.rental_purpose}
                      onChange={(e) => setFormData({...formData, rental_purpose: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setModalState({open: false, type: null})} 
                    className="px-8 py-2 border border-gray-300 rounded-lg text-gray-500 font-bold text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-10 py-2 bg-[#10a34a] text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalState.open && modalState.type === 'success' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-[380px] p-10 shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Icon path={mdiCheckCircleOutline} size={1.5} className="text-[#10a34a]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{alertConfig.title}</h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">{alertConfig.message}</p>
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

export default OPRentalRecord;