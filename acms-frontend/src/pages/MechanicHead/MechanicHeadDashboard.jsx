// src/pages/MechanicHead/MechanicHeadDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiCheckCircle, 
  mdiAlertOctagon, 
  mdiTractor, 
  mdiWrench, 
  mdiCalendarClock,
  mdiLoading,
  mdiRefresh
} from '@mdi/js';

const MechanicHeadDashboard = () => {
  const [data, setData] = useState({
    goodCount: 0,
    badCount: 0,
    availableCount: 0,
    maintenanceCount: 0,
    badConditionList: [],
    upcomingMaintenance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetching from your API endpoints
      const [mRes, lRes] = await Promise.all([
        axios.get('http://localhost:5000/api/machine-registry'),
        axios.get('http://localhost:5000/api/maintenance-records')
      ]);

      const machines = mRes.data;
      const records = lRes.data;

      // 1. Tally based on 'machine_condition' ENUM ('Good', 'Bad')
      const good = machines.filter(m => m.machine_condition === 'Good').length;
      const bad = machines.filter(m => m.machine_condition === 'Bad').length;

      // 2. Tally based on 'machine_status' ENUM
      const available = machines.filter(m => m.machine_status === 'Available').length;
      const underMaint = machines.filter(m => m.machine_status === 'Under Maintenance').length;

      // 3. Upcoming Scheduled Maintenance
      // Filter for 'Scheduled' status and sort by date
      const upcoming = records
        .filter(r => r.maintenance_status === 'Scheduled')
        .sort((a, b) => new Date(a.maintenance_date) - new Date(b.maintenance_date))
        .slice(0, 4);

      setData({
        goodCount: good,
        badCount: bad,
        availableCount: available,
        maintenanceCount: underMaint,
        badConditionList: machines.filter(m => m.machine_condition === 'Bad').slice(0, 4),
        upcomingMaintenance: upcoming
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const tallyCards = [
    { label: 'Good Condition', value: data.goodCount, icon: mdiCheckCircle, color: 'bg-emerald-500' },
    { label: 'Bad Condition', value: data.badCount, icon: mdiAlertOctagon, color: 'bg-red-500' },
    { label: 'Available Units', value: data.availableCount, icon: mdiTractor, color: 'bg-blue-600' },
    { label: 'Under Maintenance', value: data.maintenanceCount, icon: mdiWrench, color: 'bg-orange-500' },
  ];

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Icon path={mdiLoading} size={1.5} spin className="text-emerald-500" />
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Workshop Monitor</h1>
          <p className="text-gray-500 text-sm">Fleet health and maintenance scheduling overview</p>
        </div>
        <button onClick={fetchDashboardData} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
          <Icon path={mdiRefresh} size={0.8} />
        </button>
      </div>

      {/* Tally Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tallyCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`${card.color} p-4 rounded-xl text-white shadow-lg shadow-opacity-10`}>
              <Icon path={card.icon} size={1} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority List: Bad Condition Machines */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xs font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
            <Icon path={mdiAlertOctagon} size={0.7} className="text-red-600" />
            Machines Needing Repair
          </h2>
          <div className="space-y-3">
            {data.badConditionList.length > 0 ? data.badConditionList.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100 transition-all hover:bg-red-50">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-red-700 bg-white px-2 py-1 rounded shadow-sm border border-red-100">ID: {m.machine_id}</span>
                  <span className="font-bold text-slate-700 text-sm">{m.machine_type_name}</span>
                </div>
                <span className="text-[10px] font-black uppercase text-red-600 italic">Condition: Bad</span>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-6 text-sm italic">No machines currently in bad condition.</p>
            )}
          </div>
        </div>

        {/* Upcoming Maintenance: Scheduled Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xs font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
            <Icon path={mdiCalendarClock} size={0.7} className="text-blue-600" />
            Upcoming Scheduled Maintenance
          </h2>
          <div className="space-y-3">
            {data.upcomingMaintenance.length > 0 ? data.upcomingMaintenance.map((record, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 text-sm">Machine #{record.machine_id}</span>
                  <span className="text-[11px] text-slate-400 font-bold uppercase">{record.maintenance_type}</span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-blue-600 uppercase">
                    {record.maintenance_date ? new Date(record.maintenance_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Status: Scheduled</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-6 text-sm italic">No scheduled maintenance records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicHeadDashboard;