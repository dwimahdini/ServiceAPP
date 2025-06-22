import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-12 px-8 md:px-16">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d5c7d]"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="block w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d5c7d] pr-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.325A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.938-1.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.642 1.67-1.09 2.425" /></svg>
                )}
              </button>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">{error}</div>
            )}
            <div className="flex items-center justify-between mt-4">
              <Link to="/register" className="text-[#0d5c7d] hover:underline text-sm font-medium">Create an account</Link>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-8 bg-[#0d5c7d] hover:bg-[#09425a] text-white font-semibold rounded transition disabled:opacity-50 text-base"
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Right: Background */}
      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-20"></div>
        <div className="flex items-center justify-center w-full h-full p-8">
          <div className="text-center text-white">
            <div className="text-6xl mb-6">🔧</div>
            <h2 className="text-3xl font-bold mb-4">Future X</h2>
            <p className="text-lg opacity-90">Platform Layanan Terpadu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
