// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser({ username, password });
      
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const roleRoutes = {
        'General Manager': '/GeneralManager',
        'Operation Manager': '/OperationManager/OPMachineDashboard',
        'Cashier': '/Cashier/CashierDashboard',
        'Treasurer': '/Treasurer',
        'Clerk': '/Clerk',
        'Member': '/Member/MemberMachineDashboard',
        'Mechanic Head': '/MechanicHead/MechanicHeadDashboard',
      };

      const destination = roleRoutes[data.user.role] || '/login';
      navigate(destination);

    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. Background: 
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 md:p-0"
        style={{ backgroundImage: "url('/acms5.png')" }} >
      
    <div className="absolute top-6 left-6 md:top-8 md:left-12 flex items-baseline gap-2">
        <h1 className="text-white text-2xl md:text-3xl tracking-[0.5em] font-light uppercase">
            PPAC
        </h1>
        <span className="text-white text-2xl md:text-3xl font-black tracking-tight">
            ACMS
        </span>
        </div>



      {/* 2. The Card: Full width on mobile, max-width on desktop */}
      <div className="bg-white rounded-[1rem] shadow-2xl p-8 w-full max-w-[450px] transition-all duration-300">
        
        {/* Logo/Header */}
        <div className = "flex items-center justify-center mb-5 gap-4">
            <img 
            src="/acms-logo.png" 
            alt="ACMS Logo" 
            className="h-16 w-auto" />

        <h2 className="text-xl font-semibold text-center text-gray-700" >
            ACMS Portal
        </h2>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4 font-medium">{error}</p>}

          {/* Username Input Group */}
          <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Username</label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition-all">
              <input 
                type="text" 
                placeholder="Your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 outline-none text-gray-700 placeholder:text-gray-300"
              />
              <span className="bg-gray-50 px-4 py-3 text-gray-500 font-medium border-l border-gray-100 text-sm">ACMS</span>
            </div>
          </div>

          {/* Password Input Group */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Password</label>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Show Password Toggle */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                type="checkbox" 
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)} // Toggles the boolean
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400" 
                />
                <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
                Show Password
                </span>
            </label>
            </div>

          {/* Login Button: Mobile-optimized */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#238B45] text-white font-bold py-4 rounded-[1rem] shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:bg-green-700 active:scale-[0.98] transition-all uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;