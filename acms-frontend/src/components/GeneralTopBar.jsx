// src/components/GeneralTopBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Crucial for redirection
import Icon from '@mdi/react';
import { 
  mdiMenu, 
  mdiBellOutline, 
  mdiEmailOutline, 
  mdiChevronDown, 
  mdiLogoutVariant 
} from '@mdi/js';

const GeneralTopBar = ({ user, onLogout, onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Call the onLogout function passed from the parent (to clear state/tokens)
    if (onLogout) {
      onLogout();
    }
    
    // 2. Clear any lingering local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 3. Redirect the user immediately to the login page
    navigate('/login');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Hamburger Menu Toggle */}
      <div 
        onClick={onToggleSidebar}
        className="text-gray-500 hover:text-emerald-600 cursor-pointer transition-colors p-2 hover:bg-gray-50 rounded-lg"
      >
        <Icon path={mdiMenu} size={1.1} />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4 text-gray-400">
          <Icon path={mdiBellOutline} size={1} className="cursor-pointer hover:text-emerald-500 transition-colors" />
          <Icon path={mdiEmailOutline} size={1} className="cursor-pointer hover:text-emerald-500 transition-colors" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          {/* Background overlay to close dropdown when clicking outside */}
          {isDropdownOpen && (
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => setIsDropdownOpen(false)}
            />
          )}

          <div 
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors relative z-10"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img src={user?.image || "/tyler.png"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <Icon 
              path={mdiChevronDown} 
              size={0.8} 
              className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn z-20">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                <p className="text-xs font-bold text-slate-700 truncate">{user?.name || 'Member'}</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold"
              >
                <Icon path={mdiLogoutVariant} size={0.8} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralTopBar;