// src/layouts/MechanicHead/MHLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MHSideBar from '../../components/MechanicHead/MHSideBar';
import GeneralTopBar from '../../components/GeneralTopBar';

const MHLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar with collapse state */}
      <MHSideBar isCollapsed={isCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* 
            Replacing the hardcoded header with your GeneralTopBar.
            Pass the toggle function so the menu button still works.
        */}
        <GeneralTopBar 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          moduleName="Maintenance Module"
        />

        {/* Main Content Area */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MHLayout;