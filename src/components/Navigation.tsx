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
    <nav className="bg-white text-slate-900 border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16">
        <div className="flex items-center justify-between h-18 sm:h-20 lg:h-24">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition">
            <div className="text-3xl sm:text-4xl">🍿</div>

            <div className="leading-tight">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">
                Snack POS
              </h1>
              <p className="text-sm sm:text-base text-slate-500">
                Point of Sale System
              </p>
            </div>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {links.map((link) => {
              const active = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={[
                    "flex items-center gap-2",
                    "px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3",
                    "rounded-xl font-medium transition",
                    "text-base sm:text-lg lg:text-xl",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span className="text-lg sm:text-xl lg:text-2xl">{link.icon}</span>

                  {/* ✅ ไม่ใช้ xs แล้ว */}
                  <span>{link.label}</span>
                  {/* หรือถ้าจะซ่อนบนจอเล็ก: <span className="hidden sm:inline">{link.label}</span> */}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
