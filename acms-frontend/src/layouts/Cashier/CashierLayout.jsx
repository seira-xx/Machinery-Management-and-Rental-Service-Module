// src/layouts/Cashier/CashierLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import CashierSideBar from '../../components/Cashier/CashierSideBar';
import GeneralTopBar from '../../components/GeneralTopBar';

const CashierLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    name: "Cashier User",
    role: "Cashier",
    image: "/tyler.png" // Default image
  });

  // Sync state with URL path
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'cashier') {
      setActiveTab(path);
    }
  }, [location]);

  // Load User Info
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        name: savedUser.username || "Cashier",
        role: "Cashier",
        image: "/tyler.png"
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/cashier/${tabId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CashierSideBar 
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        
        <GeneralTopBar 
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />

        <main className="flex-1 p-8 overflow-x-hidden overflow-y-auto">
          {/* Outlet context allows CashierDashboard to trigger redirects if needed */}
          <Outlet context={{ setActiveTab: handleTabChange }} />
        </main>
      </div>
    </div>
  );
};

export default CashierLayout;