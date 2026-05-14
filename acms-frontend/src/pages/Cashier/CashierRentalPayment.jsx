// src/pages/Cashier/CashierRentalPayment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiMagnify, 
  mdiPencil, 
  mdiEye, 
  mdiCheckCircleOutline, 
  mdiFilterVariant, 
  mdiPrinter 
} from '@mdi/js';

const CashierRentalPayment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false });
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [formData, setFormData] = useState({
    rental_payment_id: "",
    payment_date: "",
    rental_usage: "",
    payment_status: "Pending",
    equipment_name: "",
    renter_name: "",
    rental_rate: 0,
    total: 0
  });

  useEffect(() => { 
    fetchPayments(); 
  }, []);

  useEffect(() => {
    const usage = parseFloat(formData.rental_usage) || 0;
    const rate = parseFloat(formData.rental_rate) || 0;
    setFormData(prev => ({ ...prev, total: (usage * rate).toFixed(2) }));
  }, [formData.rental_usage, formData.rental_rate]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rental-payments');
      setPayments(res.data);
    } catch (err) { 
      console.error("Error fetching payments:", err); 
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/rental-payments/${formData.rental_payment_id}`, {
        payment_date: formData.payment_date || null,
        rental_usage: formData.rental_usage || null,
        payment_status: formData.payment_status
      });
      
      fetchPayments();
      setModalState({ type: 'success', open: true });
    } catch (err) {
      alert("Update failed. Please ensure the usage and date are valid.");
    }
  };

  const isReceiptReady = (p) => p.payment_status === 'Paid' && p.payment_date && p.rental_usage;

  const filteredPayments = payments.filter(p => {
    const renterName = `${p.member_fname || ''} ${p.member_lname || ''}`.toLowerCase();
    const equipment = (p.machine_type_name || '').toLowerCase();
    const searchMatch = renterName.includes(searchTerm.toLowerCase()) || equipment.includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "All" || p.payment_status === statusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen animate-fadeIn font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Rental Payments</h1>
        <p className="text-gray-500 text-sm">View and process machine rental transactions</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-80">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search equipment or renter..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1DA04D]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white focus:ring-1 focus:ring-[#1DA04D]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            <Icon path={mdiFilterVariant} size={0.6} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-slate-900 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Equipment</th>
              <th className="px-6 py-4">Renter</th>
              <th className="px-6 py-4">Payment Date</th>
              <th className="px-6 py-4 text-center">Usage</th>
              <th className="px-6 py-4">Rates</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPayments.map((p) => (
              <tr key={p.rental_payment_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700">{p.machine_type_name}</td>
                <td className="px-6 py-5 text-sm text-slate-600">{p.member_fname} {p.member_lname}</td>
                <td className="px-6 py-5 text-sm font-mono text-slate-600">
                  {p.payment_date ? p.payment_date.split('T')[0] : "—"}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 text-center">
                  {p.rental_usage ? `${p.rental_usage} hrs` : "—"}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-600">{p.rental_rate} php/hr</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-700">
                    {p.rental_usage ? `${(p.rental_usage * p.rental_rate).toLocaleString()} php` : "—"}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase ${
                    p.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.payment_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right flex items-center justify-end gap-3">
                  <button 
                    disabled={!isReceiptReady(p)}
                    onClick={() => { setSelectedPayment(p); setModalState({ type: 'receipt', open: true }); }}
                    className={`transition-colors ${isReceiptReady(p) ? 'text-gray-400 hover:text-[#1DA04D] cursor-pointer' : 'text-gray-200 cursor-not-allowed'}`}
                  >
                    <Icon path={mdiEye} size={0.7} />
                  </button>
                  <button 
                    onClick={() => {
                        setSelectedPayment(p);
                        setFormData({
                            rental_payment_id: p.rental_payment_id,
                            payment_date: p.payment_date ? p.payment_date.split('T')[0] : "",
                            rental_usage: p.rental_usage || "",
                            payment_status: p.payment_status,
                            equipment_name: p.machine_type_name,
                            renter_name: `${p.member_fname} ${p.member_lname}`,
                            rental_rate: p.rental_rate
                        });
                        setModalState({ type: 'edit', open: true });
                    }}
                    className="text-gray-400 hover:text-[#1DA04D]"
                  >
                    <Icon path={mdiPencil} size={0.7} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPDATE MODAL */}
      {modalState.open && modalState.type === 'edit' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-[450px] p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-scaleIn">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Update Record</h2>
            <form onSubmit={handleUpdatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Equipment</label>
                    <input type="text" readOnly className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm" value={formData.equipment_name} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Renter</label>
                    <input type="text" readOnly className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm" value={formData.renter_name} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rate</label>
                    <input type="text" readOnly className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm" value={`${formData.rental_rate} php/hr`} />
                </div>
              </div>

              <hr className="border-gray-50" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Usage (Hours)</label>
                    <input type="number" step="0.01" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#1DA04D] outline-none text-sm" value={formData.rental_usage} onChange={(e) => setFormData({...formData, rental_usage: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Total Amount</label>
                    <input type="text" readOnly className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold text-center text-sm" value={`${formData.total} php`} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Payment Date</label>
                <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#1DA04D] outline-none text-sm" value={formData.payment_date} onChange={(e) => setFormData({...formData, payment_date: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#1DA04D] outline-none text-sm" value={formData.payment_status} onChange={(e) => setFormData({...formData, payment_status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setModalState({open:false})} className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#1DA04D] text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors text-sm">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {modalState.open && modalState.type === 'receipt' && selectedPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[60] animate-fadeIn">
          <div className="bg-white rounded-2xl w-[450px] p-10 shadow-2xl text-center animate-scaleIn">
            <h2 className="text-2xl font-bold text-slate-800">Payment Receipt</h2>
            <p className="text-gray-400 mb-6 uppercase tracking-widest text-[10px] font-semibold">ACMS - Machinery Rental</p>
            
            <div className="space-y-4 text-left border-t border-b border-gray-100 py-6 my-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Receipt ID:</span> 
                <span className="font-bold text-slate-800">#{String(selectedPayment.rental_payment_id).padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Equipment:</span> 
                <span className="font-bold text-slate-800">{selectedPayment.machine_type_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Renter:</span> 
                <span className="font-bold text-slate-800">{selectedPayment.member_fname} {selectedPayment.member_lname}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Date:</span> 
                <span className="font-bold text-slate-800 font-mono">{selectedPayment.payment_date.split('T')[0]}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Usage:</span> 
                  <span className="font-semibold text-slate-700">{selectedPayment.rental_usage} hrs</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Hourly Rate:</span> 
                  <span className="font-semibold text-slate-700">{selectedPayment.rental_rate} php/hr</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-800 font-bold text-lg">Total Amount:</span> 
                <span className="text-[#1DA04D] font-bold text-2xl">
                  {(selectedPayment.rental_usage * selectedPayment.rental_rate).toLocaleString()} php
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setModalState({open: false})} className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 text-sm">Close</button>
              <button onClick={() => window.print()} className="flex-1 py-3 bg-[#1DA04D] text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-emerald-700 text-sm shadow-lg"><Icon path={mdiPrinter} size={0.6} /> Print</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {modalState.open && modalState.type === 'success' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl w-[350px] p-10 text-center shadow-2xl animate-scaleIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon path={mdiCheckCircleOutline} size={1.5} className="text-[#1DA04D]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Record Updated</h2>
            <p className="text-gray-500 text-sm mb-8">The payment information has been successfully saved.</p>
            <button onClick={() => setModalState({open: false})} className="w-full py-3 bg-[#1DA04D] text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierRentalPayment;