// src/layouts/MemberLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MemberSideBar from '../../components/Member/MemberSideBar';
import GeneralTopBar from '../../components/GeneralTopBar';

const MemberLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const navigate = useNavigate();
  const location = useLocation();

  // Get real user data from localStorage
  const [user, setUser] = useState({ 
    name: "Member", 
    role: "Registered Member",
    image: "/tyler.png" 
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        name: savedUser.username || "Member",
        role: savedUser.role || "Member",
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
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MemberSideBar 
        user={user} 
        isCollapsed={isCollapsed} 
        activeTab={activeTab} // Pass current tab to highlight sidebar
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
        
        <main className="flex-1 p-8 bg-gray-50 overflow-x-hidden overflow-y-auto">
          {/* 
            Using context to allow child components to update the active tab in the sidebar when they mount.
          */}
          <Outlet context={{ setActiveTab: handleTabChange }} /> 
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;