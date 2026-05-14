// src/pages/Member/MemberMachineDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiTractor, 
  mdiCreditCardOutline, 
  mdiAlertCircleOutline, 
  mdiCheckDecagram,
  mdiArrowRight 
} from '@mdi/js';


const MemberDashboard = () => {
  const { setActiveTab } = useOutletContext();
  
  const [stats, setStats] = useState({ pendingRequests: 0, unpaidPayments: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMemberId = () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      let rawId = savedUser?.id || "";
      return rawId.startsWith('U-') ? rawId.replace('U-', 'MEM-') : rawId;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const memberId = getMemberId();
      if (!memberId) return;

      try {
        const reqRes = await axios.get('http://localhost:5000/api/rental-requests');
        const myRequests = reqRes.data.filter(r => String(r.member_id) === String(memberId));
        
        const payRes = await axios.get('http://localhost:5000/api/rental-payments');
        const myPayments = payRes.data.filter(p => String(p.member_id) === String(memberId));

        setStats({
          pendingRequests: myRequests.filter(r => r.rental_status === 'Pending').length,
          unpaidPayments: myPayments.filter(p => p.payment_status === 'Pending').length
        });

        const sorted = myRequests.sort((a, b) => b.rental_id - a.rental_id).slice(0, 3);
        setRecentRequests(sorted);
        
        setLoading(false);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Ready to start your next harvest?</h2>
          <p className="opacity-90 max-w-md text-sm">
            Browse our available machinery and manage your rental requests all in one place.
          </p>
          <button 
            onClick={() => setActiveTab('machine-rental')}
            className="mt-6 bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2"
          >
            Explore Catalog <Icon path={mdiArrowRight} size={0.6} />
          </button>
        </div>
        <Icon path={mdiTractor} size={8} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
      </div>

      {/* Stats and Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* ACTION: Rent a Machine */}
        <div 
          onClick={() => setActiveTab('machine-rental')}
          className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Icon path={mdiTractor} size={1} />
          </div>
          <h3 className="mt-4 font-bold text-slate-800">Rent a Machine</h3>
          <p className="text-xs text-gray-500 mt-1">Browse and book equipment</p>
        </div>

        {/* ACTION: Unpaid Rental Payment */}
        <div 
          onClick={() => setActiveTab('rental-payment')}
          className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Icon path={mdiCreditCardOutline} size={1} />
          </div>
          <h3 className="mt-4 font-bold text-slate-800">Unpaid Rental Payment</h3>
          <p className="text-xs text-gray-500 mt-1">Settle your outstanding balances</p>
        </div>

        {/* INFO: Pending Requests */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Icon path={mdiAlertCircleOutline} size={1} />
            </div>
            <span className="text-2xl font-black text-slate-700">
                {loading ? "..." : String(stats.pendingRequests).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-4 font-bold text-slate-800">Pending Requests</h3>
          <p className="text-xs text-gray-500 mt-1">Awaiting manager approval</p>
        </div>

        {/* INFO: Unpaid Balance Count */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Icon path={mdiCreditCardOutline} size={1} />
            </div>
            <span className="text-2xl font-black text-slate-700">
                {loading ? "..." : String(stats.unpaidPayments).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-4 font-bold text-slate-800">Unpaid Records</h3>
          <p className="text-xs text-gray-500 mt-1">Pending payment settlement</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Recent Rental Updates</h3>
          <button 
            onClick={() => setActiveTab('rental-record')}
            className="text-emerald-600 text-xs font-bold hover:underline"
          >
            View History
          </button>
        </div>
        
        <div className="space-y-4">
          {recentRequests.length > 0 ? (
            recentRequests.map((req) => (
              <div key={req.rental_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Icon path={mdiTractor} size={0.7} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{req.machine_type_name}</p>
                    <p className="text-[10px] text-gray-400">Scheduled: {new Date(req.rental_start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                  req.rental_status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {req.rental_status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm italic">No recent activity.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;