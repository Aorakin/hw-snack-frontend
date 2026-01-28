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

  const totalRevenue = sales.reduce((total, sale) => {
    const saleTotal = sale.total_price ?? (sale.sale_snacks?.reduce((s, item) => {
      const itemPrice = item.price ?? 0;
      const itemQty = item.quantity ?? 0;
      return s + itemPrice * itemQty;
    }, 0) ?? 0);
    return total + saleTotal;
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <div className="mx-auto w-full max-w-screen-xl space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fadeIn">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Overview of inventory, sales, and stock alerts.
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 animate-slideDown">
          {/* Stat Card 1 */}
          <div className="border border-slate-200 rounded-2xl bg-white p-5 sm:p-6 transition hover:bg-slate-50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Snacks</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">{snacks.length}</h3>
              </div>
              <div className="text-2xl opacity-80">🍿</div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="border border-slate-200 rounded-2xl bg-white p-5 sm:p-6 transition hover:bg-slate-50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Revenue</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                  ฿{totalRevenue.toFixed(2)}
                </h3>
              </div>
              <div className="text-2xl opacity-80">💰</div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="border border-slate-200 rounded-2xl bg-white p-5 sm:p-6 transition hover:bg-slate-50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Today’s Sales</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">{todaySales}</h3>
              </div>
              <div className="text-2xl opacity-80">🧾</div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="border border-slate-200 rounded-2xl bg-white p-5 sm:p-6 transition hover:bg-slate-50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Alerts</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className={`text-3xl font-semibold ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {lowStockCount}
                  </h3>
                  <span className="text-sm text-slate-500">Low stock</span>
                </div>

                {lowStockCount > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg animate-slideUp">
                    <span className="opacity-90">⚠️</span>
                    Restock recommended
                  </div>
                )}
              </div>

              <div className={`text-2xl ${lowStockCount > 0 ? 'opacity-100' : 'opacity-70'}`}>
                {lowStockCount > 0 ? '⚠️' : '✅'}
              </div>
            </div>
          </div>
        </div>

        {/* Management */}
        <div className="space-y-4 lg:space-y-6 animate-slideUp">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
              Management
            </h2>
            <div className="text-sm text-slate-500">
              Quick actions
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Inventory */}
            <Link to="/snacks" className="group block h-full">
              <Card className="h-full border border-slate-200 bg-white rounded-2xl p-6 sm:p-7 transition hover:bg-slate-50 hover:shadow-sm hover:-translate-y-[2px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl opacity-80">🍿</div>
                    <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">Inventory</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      Add snacks, update prices, manage products.
                    </p>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-700 transition text-lg">
                    →
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-700 font-medium">
                  <span className="inline-flex items-center gap-2">
                    Manage snacks
                    <span className="transition group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Card>
            </Link>

            {/* Sales */}
            <Link to="/sales" className="group block h-full">
              <Card className="h-full border border-slate-200 bg-white rounded-2xl p-6 sm:p-7 transition hover:bg-slate-50 hover:shadow-sm hover:-translate-y-[2px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl opacity-80">💰</div>
                    <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">Sales Records</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      Track revenue and view transaction history.
                    </p>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-700 transition text-lg">
                    →
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-700 font-medium">
                  <span className="inline-flex items-center gap-2">
                    View sales
                    <span className="transition group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Card>
            </Link>

            {/* Stock */}
            <Link to="/stock" className="group block h-full">
              <Card className="h-full border border-slate-200 bg-white rounded-2xl p-6 sm:p-7 transition hover:bg-slate-50 hover:shadow-sm hover:-translate-y-[2px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl opacity-80">📦</div>
                    <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">Stock Control</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      Monitor quantities and handle low stock.
                    </p>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-700 transition text-lg">
                    →
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-700 font-medium">
                  <span className="inline-flex items-center gap-2">
                    Update stock
                    <span className="transition group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
