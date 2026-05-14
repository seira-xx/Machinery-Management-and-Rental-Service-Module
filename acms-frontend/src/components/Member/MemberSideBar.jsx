// src/components/Member/MemberSideBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import { 
  mdiViewDashboard, 
  mdiClockOutline, 
  mdiCreditCardOutline,
  mdiTractor
} from '@mdi/js';

const MemberSideBar = ({ user, isCollapsed, activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Dashboard', path: '/Member/MemberMachineDashboard', icon: mdiViewDashboard },
    { name: 'Rental Record', path: '/Member/MemberMachineRental', icon: mdiClockOutline },
    { name: 'Payment History', path: '/Member/MemberRentalPayment', icon: mdiCreditCardOutline },
    
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
            <p className="text-[10px] opacity-80 uppercase">AgriCoop Member</p>
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
            <p className="font-bold text-sm truncate">{user?.name || "Member Name"}</p>
            <p className="text-xs opacity-70 truncate">Registered Member</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
            <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.name : ""}
            className={({ isActive }) => `
                w-full flex items-center rounded-xl transition-all
                ${isCollapsed ? 'justify-center py-4' : 'gap-4 px-4 py-3'}
                ${isActive 
                ? 'bg-white text-[#1DA04D] font-bold shadow-md' 
                : 'hover:bg-white/10 text-white'}
            `}
            >
            <Icon path={item.icon} size={0.9} />
            {!isCollapsed && <span className="text-sm animate-fadeIn">{item.name}</span>}
            </NavLink>
        ))}
        </nav>
    </div>
  );
};

export default MemberSideBar;