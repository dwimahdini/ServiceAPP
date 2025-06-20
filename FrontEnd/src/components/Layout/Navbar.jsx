import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContactClick = () => {
    const footer = document.getElementById('main-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLayananClick = () => {
    if (isAdmin()) {
      // Admin: navigate to admin services page
      navigate('/admin/services');
    } else {
      // User: scroll to layanan section or navigate to user dashboard
      if (location.pathname !== '/user/dashboard') {
        navigate('/user/dashboard');
        setTimeout(() => {
          const layanan = document.getElementById('layanan-kami');
          if (layanan) layanan.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        const layanan = document.getElementById('layanan-kami');
        if (layanan) layanan.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = () => {
    if (isAdmin()) {
      // Admin: navigate to admin dashboard
      navigate('/admin/dashboard');
    } else {
      // User: navigate to user dashboard
      navigate('/user/dashboard');
    }
  };

  // Different navigation items based on user role
  const navigationItems = isAdmin()
    ? [
        { name: 'Home', onClick: handleHomeClick },
        { name: 'Layanan', onClick: handleLayananClick },
        // Contact removed for admin
      ]
    : [
        { name: 'Home', onClick: handleHomeClick },
        { name: 'Layanan', onClick: handleLayananClick },
        { name: 'Contact', onClick: handleContactClick },
      ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-gray-900 text-2xl font-bold">
                Future X
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out"
                >
                  {item.name}
                </button>
              ) : (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out"
                >
                  {item.name}
                </button>
              )
            ))}

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">
                <span className="text-sm">Welcome, </span>
                <span className="font-medium">{user?.name}</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {isAdmin() ? 'Admin' : 'User'}
                </span>
              </div>

              {/* Dashboard Button */}
              {isAdmin() ? (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Admin Panel
                </button>
              ) : (
                <button
                  onClick={() => navigate('/user/dashboard')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigationItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left"
                  >
                    {item.name}
                  </button>
                )
              ))}
              <div className="border-t pt-4">
                <div className="px-3 py-2">
                  <span className="text-sm text-gray-600">Welcome, </span>
                  <span className="font-medium text-gray-900">{user?.name}</span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {isAdmin() ? 'Admin' : 'User'}
                  </span>
                </div>
                {/* Dashboard Button Mobile */}
                {isAdmin() ? (
                  <button
                    onClick={() => {
                      navigate('/admin/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800"
                  >
                    Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/user/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-green-600 hover:text-green-800"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
