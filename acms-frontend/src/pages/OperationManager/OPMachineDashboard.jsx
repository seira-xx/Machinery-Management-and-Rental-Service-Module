// src/pages/OperationManager/OPMachineDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Icon from '@mdi/react';
import { 
  mdiTractor, 
  mdiDotsHorizontal, 
  mdiCircle, 
  mdiChevronRight 
} from '@mdi/js';

const OPMachineDashboard = () => {
  const [data, setData] = useState({ stats: {}, registry: [], maintenance: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/machine-registry/summary');
        // Assuming your backend also returns the next maintenance record
        setData(response.data);
      } catch (err) {
        console.error("Connection Error:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStats();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Connecting to PPAC Database...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Overview</h1>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Machines under maintenance" 
          value={data.stats.maintenance_count || 0} 
          color="bg-red-50 text-red-500" 
          icon={mdiTractor} 
        />
        <StatCard 
          label="Active Machines" 
          value={data.stats.available_count || 0} // Using available for "Active" per Figma
          color="bg-green-50 text-green-500" 
          icon={mdiTractor} 
        />
        <StatCard 
          label="Reserved Machine" 
          value={data.stats.reserved_count || 0} 
          color="bg-cyan-50 text-cyan-500" 
          icon={mdiTractor} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Equipment Registry */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Equipment Registry</h2>
            <button 
              onClick={() => navigate('/OperationManager/OPMachineRegistry')}
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {data.registry.map((machine) => (
              <div key={machine.machine_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Icon path={mdiTractor} size={1} />
                  </div>
                  <span className="font-medium text-slate-700">{machine.machine_type_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    machine.machine_status === 'Available' ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {machine.machine_status}
                  </span>
                  {/* The 3 dots redirecting to registry */}
                  <button 
                    onClick={() => navigate('/OperationManager/OPMachineRegistry')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon path={mdiDotsHorizontal} size={1} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Upcoming Maintenance Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Upcoming Maintenance</h2>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">
                Scheduled
                </span>
            </div>

            <div className="space-y-4">
                {data.maintenance && data.maintenance.length > 0 ? (
                data.maintenance.map((record) => (
                    <div key={record.maintenance_id} className="p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                        <Icon path={mdiCircle} size={0.3} className="text-blue-600" />
                        <span className="font-bold text-slate-800 text-sm">
                            {record.machine_type_name}
                        </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        {record.maintenance_type}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-4">
                        Scheduled for: {record.maintenance_date ? new Date(record.maintenance_date).toLocaleDateString() : 'Date TBD'}
                    </p>
                    </div>
                ))
                ) : (
                <div className="text-center py-10">
                    <p className="text-sm text-gray-400 italic">No scheduled maintenance tasks.</p>
                </div>
                )}
            </div>
            </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
    <div>
      <p className="text-xs font-medium text-gray-400 mb-2">{label}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`${color} p-2 rounded-lg`}>
      <Icon path={icon} size={1.2} />
    </div>
  </div>
);

export default OPMachineDashboard;