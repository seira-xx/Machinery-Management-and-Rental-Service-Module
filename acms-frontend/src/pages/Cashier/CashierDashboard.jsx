// src/pages/Cashier/CashierDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiCashMultiple, 
  mdiClockOutline, 
  mdiCheckCircleOutline, 
  mdiTrendingUp,
  mdiArrowRight,
  mdiCalendarRange
} from '@mdi/js';

const CashierDashboard = () => {
  const { setActiveTab } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedToday: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const fetchCashierData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rental-payments');
        const allPayments = response.data;

        // Calculate Stats
        const total = allPayments
          .filter(p => p.payment_status === 'Completed')
          .reduce((sum, curr) => sum + parseFloat(curr.amount_paid || 0), 0);

        const pending = allPayments.filter(p => p.payment_status === 'Pending').length;

        // Mocking "Completed Today" based on last 5 entries for demo
        const completed = allPayments.filter(p => p.payment_status === 'Completed').length;

        setStats({
          totalRevenue: total,
          pendingPayments: pending,
          completedToday: completed
        });

        // Get last 5 transactions
        const latest = allPayments
          .sort((a, b) => b.payment_id - a.payment_id)
          .slice(0, 5);
        
        setRecentPayments(latest);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cashier stats:", err);
        setLoading(false);
      }
    };

    fetchCashierData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Finance Overview</h1>
          <p className="text-slate-500 text-sm">Monitor payments and daily revenue collection.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-slate-600 text-sm font-medium">
          <Icon path={mdiCalendarRange} size={0.7} />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4">
              <Icon path={mdiTrendingUp} size={1.2} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Revenue Collected</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">
              ₱{loading ? "..." : stats.totalRevenue.toLocaleString()}
            </h2>
          </div>
          <Icon path={mdiCashMultiple} size={5} className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:scale-110 transition-transform" />
        </div>

        {/* Pending Payments */}
        <div 
          onClick={() => setActiveTab('rental-payment')}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4">
            <Icon path={mdiClockOutline} size={1.2} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Pending Approvals</p>
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-3xl font-black text-slate-800">
              {loading ? "..." : stats.pendingPayments}
            </h2>
            <Icon path={mdiArrowRight} size={0.8} className="text-slate-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Completed Transactions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
            <Icon path={mdiCheckCircleOutline} size={1.2} />
          </div>
          <p className="text-slate-500 text-sm font-medium">Successful Transactions</p>
          <h2 className="text-3xl font-black text-slate-800 mt-1">
            {loading ? "..." : stats.completedToday}
          </h2>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <button 
            onClick={() => setActiveTab('rental-payment')}
            className="text-emerald-600 text-xs font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Manage All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member ID</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <tr key={payment.payment_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-700 text-sm">{payment.member_id}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-600 text-sm">
                      ₱{parseFloat(payment.amount_paid || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        payment.payment_status === 'Completed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 text-sm italic">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;