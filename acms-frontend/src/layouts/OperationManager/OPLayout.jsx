// src/layouts/OperationManager/OPLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import OPSidebar from '../../components/OperationManager/OPSideBar'; 
import GeneralTopBar from '../../components/GeneralTopBar';

const OPLayout = () => {
  // 1. Add state for the collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const user = { 
    name: "Tyler Nash", 
    role: "Operation Manager",
    image: "/tyler.png" 
  };

  const handleLogout = () => {
    // Clear session/local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 2. Pass isCollapsed to the sidebar */}
      <OPSidebar 
        user={user} 
        isCollapsed={isCollapsed} 
      />
      
      {/* 3. Adjust margin-left dynamically based on sidebar width ( */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        
        {/* 4. Pass toggle function and logout to TopBar */}
        <GeneralTopBar 
          user={user} 
          onLogout={handleLogout} 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
        
        <main className="flex-1 p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default OPLayout;