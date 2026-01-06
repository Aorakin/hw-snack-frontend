import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '..';

export const Home: React.FC = () => {
  const { snacks, sales, stocks, fetchSnacks, fetchSales, fetchStocks } = useApp();

  useEffect(() => {
    fetchSnacks();
    fetchSales();
    fetchStocks();
  }, [fetchSnacks, fetchSales, fetchStocks]);

  // Logic remains unchanged
  const totalRevenue = sales.reduce((total, sale) => {
    const price = sale.snack?.price || 0;
    return total + (price * sale.quantity);
  }, 0);

  const lowStockCount = stocks.filter(stock => {
    const percentage = stock.quantity > 0 ? (stock.quantity_now / stock.quantity) * 100 : 0;
    return percentage < 30;
  }).length;

  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    // Main Wrapper with deep gradient background
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12 font-sans text-slate-50">

      <div className="flex flex-col p-6 md:p-12 gap-8 mt-6 md:mt-8" >
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slideDown">
          {/* Stat Card 1 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Snacks</p>
                <h3 className="text-3xl font-bold text-white mt-1">{snacks.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-blue-400">
                🍿
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Revenue</p>
                <h3 className="text-3xl font-bold text-emerald-400 mt-1">฿{totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-emerald-400">
                💰
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Today's Sales</p>
                <h3 className="text-3xl font-bold text-purple-400 mt-1">{todaySales}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-purple-400">
                📊
              </div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Alerts</p>
                <h3 className={`text-3xl font-bold mt-1 ${lowStockCount > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                  {lowStockCount} <span className="text-sm font-normal text-slate-400">Low Stock</span>
                </h3>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${lowStockCount > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-700/50 text-slate-400'}`}>
                ⚠️
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Title */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-1 h-8 bg-purple-500 rounded-full block"></span>
            Management Console
          </h2>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Snacks Action */}
            <Link to="/snacks" className="group relative block h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
              <Card className="relative h-full bg-slate-800 border-slate-700 p-8 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-4xl mb-6 text-blue-400 group-hover:text-white group-hover:bg-blue-500 transition-colors">
                      🍿
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Inventory</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Add new snacks, update prices, and manage product details.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                    Manage Snacks <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Sales Action */}
            <Link to="/sales" className="group relative block h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
              <Card className="relative h-full bg-slate-800 border-slate-700 p-8 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-4xl mb-6 text-purple-400 group-hover:text-white group-hover:bg-purple-500 transition-colors">
                      💰
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sales Records</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Track revenue, view transaction history, and analyze daily performance.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                    View Sales <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Stock Action */}
            <Link to="/stock" className="group relative block h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
              <Card className="relative h-full bg-slate-800 border-slate-700 p-8 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-4xl mb-6 text-emerald-400 group-hover:text-white group-hover:bg-emerald-500 transition-colors">
                      📦
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Stock Control</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Monitor quantities, restock items, and handle low stock alerts.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300">
                    Update Stock <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};