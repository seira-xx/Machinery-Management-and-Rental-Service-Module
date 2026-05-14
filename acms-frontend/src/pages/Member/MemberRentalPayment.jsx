// src/pages/Member/MemberRentalPayment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiMagnify, mdiEye, mdiPrinter } from '@mdi/js';

const MemberRentalPayment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalState, setModalState] = useState({ type: null, open: false });
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Robust helper to get ID
  const getMemberId = () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    let rawId = savedUser?.id || ""; 

    if (rawId.startsWith('U-')) {
      return rawId.replace('U-', 'MEM-');
    }
    return rawId;
  } catch (e) {
    return "";
  }
};

const fetchMyPayments = async () => {
  const targetId = getMemberId(); 
  if (!targetId) return;

  try {
    const res = await axios.get('http://localhost:5000/api/rental-payments');
    
    const myData = res.data.filter(p => 
      String(p.member_id).trim() === String(targetId).trim()
    );

    setPayments(myData);
  } catch (err) { 
    console.error("Error fetching payments:", err); 
  }
};

  useEffect(() => { 
    fetchMyPayments(); 
  }, []);

  const isReceiptReady = (p) => p.payment_status === 'Paid' && p.payment_date && p.rental_usage;

  const filteredPayments = payments.filter(p => {
    const equipment = (p.machine_type_name || '').toLowerCase();
    const searchMatch = equipment.includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "All" || p.payment_status === statusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Rental Payments</h1>
        <p className="text-gray-500 text-sm">View your history and print payment receipts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-80">
            <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search equipment..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-slate-900 text-sm font-bold border-b border-gray-100 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Equipment</th>
              <th className="px-6 py-4">Payment Date</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4">Rate</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPayments.map((p) => (
              <tr key={p.rental_payment_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-sm font-semibold text-slate-700">{p.machine_type_name || 'N/A'}</td>
                <td className="px-6 py-5 text-sm font-mono text-slate-600">
                  {p.payment_date ? p.payment_date.split('T')[0] : "—"}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {p.rental_usage ? `${p.rental_usage} hrs` : "—"}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">{p.rental_rate || 0} php/hr</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-700">
                    {p.rental_usage ? `${(p.rental_usage * (p.rental_rate || 0)).toFixed(2)} php` : "Calculated upon return"}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                    p.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.payment_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <button 
                    disabled={!isReceiptReady(p)}
                    onClick={() => { setSelectedPayment(p); setModalState({ type: 'receipt', open: true }); }}
                    className={`transition-all p-2 rounded-lg ${
                      isReceiptReady(p) 
                      ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer' 
                      : 'text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <Icon path={mdiEye} size={0.7} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400 text-sm">
                  No payment records found for your account.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RECEIPT MODAL (View & Print Only) */}
      {modalState.open && modalState.type === 'receipt' && selectedPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl w-[450px] p-10 shadow-2xl text-center relative">
            <h2 className="text-2xl font-bold text-slate-800">Payment Receipt</h2>
            <p className="text-gray-400 mb-6 uppercase tracking-widest text-xs font-semibold">PPAC - Machinery Rental</p>
            
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
                <span className="text-gray-800 font-bold text-lg">Total Paid:</span> 
                <span className="text-emerald-600 font-bold text-2xl">
                  {(selectedPayment.rental_usage * selectedPayment.rental_rate).toFixed(2)} php
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setModalState({open: false})} 
                className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-3 bg-[#10a34a] text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <Icon path={mdiPrinter} size={0.6} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberRentalPayment;