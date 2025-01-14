import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import { clearTasks } from '../features/todoSlice';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      dispatch(clearTasks());
      dispatch(login({ username: credentials.username }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#4C3575] to-[#371B58]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#4C3575] animate-fadeIn">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600 animate-slideUp">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 animate-slideUp">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C3575] transition-all duration-300"
                required
              />
            </div>
            
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C3575] transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#4C3575] text-white rounded-lg hover:bg-[#371B58] focus:outline-none focus:ring-2 focus:ring-[#4C3575] focus:ring-offset-2 transform transition-all duration-300 hover:scale-105"
          >
            Sign in
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;