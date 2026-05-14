// src/components/OperationManager/OPSideBar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import { 
  mdiViewDashboard, mdiClockOutline, mdiTractor, 
  mdiWrench, mdiCashRegister, mdiChevronDown, 
  mdiChevronUp, mdiCogOutline, mdiFactory, mdiCashMarker
} from '@mdi/js';

const OPSideBar = ({ user, isCollapsed }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/OperationManager/OPMachineDashboard', icon: mdiViewDashboard },
    { name: 'Rental Record', path: '/OperationManager/OPRentalRecord', icon: mdiClockOutline },
    { name: 'Machinery', path: '/OperationManager/OPMachineRegistry', icon: mdiTractor },
    { name: 'Maintenance', path: '/OperationManager/OPMachineMaintenance', icon: mdiWrench },
    { name: 'Payment Record', path: '/OperationManager/OPMachinePayment', icon: mdiCashRegister },
  ];

  return (
    <div className={`bg-[#1DA04D] min-h-screen flex flex-col text-white shadow-xl transition-all duration-300 fixed left-0 top-0 z-[60] ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className={`p-6 flex items-center border-b border-white/10 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-12 h-12 bg-white rounded-full flex-shrink-0 flex items-center justify-center p-1">
           <img src="/acms-logo.png" alt="ACMS Logo" className="object-contain" />
        </div>
        {!isCollapsed && (
          <div className="leading-tight animate-fadeIn">
            <h1 className="font-bold text-sm">ACMS:</h1>
            <p className="text-[10px] opacity-80 uppercase">AgriCoop Management</p>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className={`p-6 flex items-center border-b border-white/10 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white/20 flex-shrink-0">
          <img src={user?.image || "/tyler.png"} alt="User" className="w-full h-full object-cover" />
        </div>
        {!isCollapsed && (
          <div className="animate-fadeIn overflow-hidden">
            <p className="font-bold text-sm truncate">{user?.name || "Tyler Nash"}</p>
            <p className="text-xs opacity-70 truncate">{user?.role || "Operation Manager"}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : ""}
            className={({ isActive }) => 
              `flex items-center rounded-xl transition-all ${
                isCollapsed ? 'justify-center py-4' : 'gap-4 px-4 py-3'
              } ${
                isActive ? 'bg-white text-[#1DA04D] font-bold shadow-md' : 'hover:bg-white/10'
              }`
            }
          >
            <Icon path={item.icon} size={0.9} />
            {!isCollapsed && <span className="text-sm animate-fadeIn">{item.name}</span>}
          </NavLink>
        ))}

        {/* Configurations - Hidden when collapsed to keep UI clean */}
        <div className="pt-2">
          <button 
            onClick={() => !isCollapsed && setIsConfigOpen(!isConfigOpen)}
            className={`w-full flex items-center rounded-xl hover:bg-white/10 transition-all ${
              isCollapsed ? 'justify-center py-4' : 'justify-between gap-4 px-4 py-3'
            }`}
          >
            <div className="flex items-center gap-4">
              <Icon path={mdiCogOutline} size={0.9} />
              {!isCollapsed && <span className="text-sm">Configurations</span>}
            </div>
            {!isCollapsed && <Icon path={isConfigOpen ? mdiChevronUp : mdiChevronDown} size={0.8} />}
          </button>
          
          {isConfigOpen && !isCollapsed && (
            <div className="ml-8 mt-2 space-y-1 animate-fadeIn">
              <ConfigSubItem to="/OperationManager/OPMachineType" icon={mdiFactory} label="Machine Types" />
              <ConfigSubItem to="/OperationManager/OPMachineRate" icon={mdiCashMarker} label="Machine Rates" />
              <ConfigSubItem to="/OperationManager/OPMaintenanceType" icon={mdiWrench} label="Maintenance Types" />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

const ConfigSubItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all ${
        isActive ? 'bg-white/20 font-bold' : 'opacity-80 hover:opacity-100 hover:bg-white/5'
      }`
    }
  >
    <Icon path={icon} size={0.6} />
    {label}
  </NavLink>
);

export default OPSideBar;