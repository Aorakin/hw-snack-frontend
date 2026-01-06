import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/snacks', label: 'Snacks', icon: '🍿' },
    { path: '/sales', label: 'Sales', icon: '💰' },
    { path: '/stock', label: 'Stock', icon: '📦' },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md text-white shadow-2xl border-b border-white/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="text-3xl transform group-hover:scale-110 transition-transform">🍿</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Snack POS</h1>
              <p className="text-xs text-white/80">Point of Sale System</p>
            </div>
          </Link>
          <div className="flex space-x-2 gap-4 ">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                    : 'hover:bg-white/20 text-white'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
