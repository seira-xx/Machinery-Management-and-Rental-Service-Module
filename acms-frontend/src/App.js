// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from './pages/Login';

// Layouts
import OPLayout from './layouts/OperationManager/OPLayout';
import MemberLayout from './layouts/Member/MemberLayout';
import CashierLayout from './layouts/Cashier/CashierLayout';
import MHLayout from './layouts/MechanicHead/MHLayout';

// Role-Specific Pages 
import MechanicHeadDashboard from './pages/MechanicHead/MechanicHeadDashboard';
import MechanicHeadRegistry from './pages/MechanicHead/MechanicHeadRegistry';
import MechanicHeadMaintenance from './pages/MechanicHead/MechanicHeadMaintenance';
import MHMaintenanceType from './pages/MechanicHead/MHMaintenanceType';

import MemberMachineDashboard from './pages/Member/MemberMachineDashboard';
import MemberRentalPayment from './pages/Member/MemberRentalPayment';
import MemberMachineRental from './pages/Member/MemberMachineRental';

import CashierDashboard from './pages/Cashier/CashierDashboard';
import CashierRentalPayment from './pages/Cashier/CashierRentalPayment';
import CashierMachineRate from './pages/Cashier/CashierMachineRate';

import OPMachineDashboard from './pages/OperationManager/OPMachineDashboard';
import OPMachineType from './pages/OperationManager/OPMachineType';
import OPMachineRate from './pages/OperationManager/OPMachineRate';
import OPMaintenanceType from './pages/OperationManager/OPMaintenanceType';
import OPMachineRegistry from './pages/OperationManager/OPMachineRegistry';
import OPMachineMaintenance from './pages/OperationManager/OPMachineMaintenance';
import OPRentalRecord from './pages/OperationManager/OPRentalRecord';
import OPMachinePayment from './pages/OperationManager/OPMachinePayment';

// Placeholder imports for other roles not included in this module
const GMDashboard = () => <div className="p-10">General Manager Dashboard (Work in Progress)</div>;
const TreasurerDashboard = () => <div className="p-10">Treasurer Dashboard (Work in Progress)</div>;
const ClerkDashboard = () => <div className="p-10">Clerk Inventory (Work in Progress)</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Role-Based Routes */}
        <Route path="/GeneralManager" element={<GMDashboard />} />
        <Route path="/Treasurer" element={<TreasurerDashboard />} />
        <Route path="/Clerk" element={<ClerkDashboard />} />


        <Route path="/OperationManager" element={<OPLayout />}>
          {/* Redirect /OperationManager to the Dashboard */}
          <Route index element={<Navigate to="OPMachineDashboard" />} />
          
          <Route path="OPMachineDashboard" element={<OPMachineDashboard />} />

          <Route path="OPMachineType" element={<OPMachineType />} />
          <Route path="OPMachineRate" element={<OPMachineRate />} />
          <Route path="OPMaintenanceType" element={<OPMaintenanceType />} />

          <Route path="OPMachineRegistry" element={<OPMachineRegistry />} />
          <Route path="OPMachineMaintenance" element={<OPMachineMaintenance />} />
          <Route path="OPRentalRecord" element={<OPRentalRecord />} />
          <Route path="OPMachinePayment" element={<OPMachinePayment />} />


        </Route>

        <Route path="/Cashier" element={<CashierLayout />}>
          <Route index element={<Navigate to="CashierDashboard" />} />
          <Route path="CashierDashboard" element={<CashierDashboard />} />
          <Route path="CashierRentalPayment" element={<CashierRentalPayment />} />
          <Route path="CashierMachineRate" element={<CashierMachineRate />} />
        </Route>

        <Route path="/Member" element={<MemberLayout />} >
          <Route index element={<Navigate to="MemberMachineDashboard" />} />
          <Route path="MemberMachineDashboard" element={<MemberMachineDashboard />} />
          <Route path="MemberMachineRental" element={<MemberMachineRental />} />
          <Route path="MemberRentalPayment" element={<MemberRentalPayment />} />
        </Route>

        <Route path="/MechanicHead" element={<MHLayout />}>
          <Route index element={<Navigate to="MechanicHeadDashboard" />} />
          <Route path="MechanicHeadDashboard" element={<MechanicHeadDashboard />} />
          <Route path="MechanicHeadRegistry" element={<MechanicHeadRegistry />} />
          <Route path="MechanicHeadMaintenance" element={<MechanicHeadMaintenance />} />
          <Route path="MHMaintenanceType" element={<MHMaintenanceType />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;