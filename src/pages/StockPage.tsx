import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Modal, Input } from '..';
import { format } from 'date-fns';
import type { CreateStockRequest } from '../types';

export const StockPage: React.FC = () => {
  const { stocks, snacks, fetchStocks, fetchSnacks, createStock, deleteStock, loading, error } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [formData, setFormData] = useState<CreateStockRequest>({
    snack_id: '',
    quantity: 0,
    quantity_now: 0,
  });

  useEffect(() => {
    fetchStocks();
    fetchSnacks();
  }, [fetchStocks, fetchSnacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStock(formData);
      setIsModalOpen(false);
      setFormData({ snack_id: '', quantity: 0, quantity_now: 0 });
    } catch (err) {
      console.error('Failed to create stock:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this stock entry?')) {
      try {
        await deleteStock(id);
      } catch (err) {
        console.error('Failed to delete stock:', err);
      }
    }
  };

  const getStockPercentage = (stock: typeof stocks[0]) =>
    stock.quantity > 0 ? (stock.quantity_now / stock.quantity) * 100 : 0;

  const getStockStatus = (percentage: number) => {
    if (percentage < 30) return { label: 'Low', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (percentage < 70) return { label: 'Medium', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'High', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const filteredStocks = useMemo(() => {
    return stocks
      .filter((stock) => {
        const percentage = getStockPercentage(stock);
        const matchesSearch =
          stock.snack?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.snack_id.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (stockFilter === 'low') return percentage < 30;
        if (stockFilter === 'medium') return percentage >= 30 && percentage < 70;
        if (stockFilter === 'high') return percentage >= 70;
        return true;
      })
      .sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
  }, [stocks, searchTerm, stockFilter]);

  const lowStockCount = stocks.filter(s => getStockPercentage(s) < 30).length;
  const totalItems = stocks.reduce((sum, s) => sum + s.quantity_now, 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans px-4 sm:px-6 lg:px-10 2xl:px-16 py-6 lg:py-10 animate-fadeIn">
      <div className="mx-auto w-full max-w-screen-xl space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Stock
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Monitor inventory levels.
            </p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <span className="text-lg mr-2">＋</span> Add Stock
          </Button>
        </div>

        {error && (
          <div className="border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 rounded-xl animate-slideDown">
            ⚠️ {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border border-slate-200 bg-white rounded-2xl p-6">
            <p className="text-sm text-slate-500">Stock Entries</p>
            <p className="mt-2 text-3xl font-semibold">{stocks.length}</p>
          </Card>

          <Card className="border border-slate-200 bg-white rounded-2xl p-6">
            <p className="text-sm text-slate-500">Total Items</p>
            <p className="mt-2 text-3xl font-semibold">{totalItems}</p>
          </Card>

          <Card className="border border-slate-200 bg-white rounded-2xl p-6">
            <p className="text-sm text-slate-500">Low Stock</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">{lowStockCount}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-slate-200 bg-white rounded-2xl p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by snack name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stock level
              </label>
              <div className="inline-flex w-full rounded-xl border border-slate-200 overflow-hidden">
                {(['all', 'low', 'medium', 'high'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStockFilter(f)}
                    className={`flex-1 px-3 py-3 text-sm font-medium transition
                      ${stockFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{filteredStocks.length}</span> of{' '}
            <span className="font-medium text-slate-700">{stocks.length}</span> entries
          </div>
        </Card>

        {/* Table */}
        <Card className="border border-slate-200 bg-white rounded-2xl p-0 overflow-hidden animate-slideUp">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-900"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading...</p>
            </div>
          ) : filteredStocks.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                No stock entries found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Created</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Snack</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Initial</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Current</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Status</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-700 uppercase">%</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStocks.map((stock) => {
                    const percentage = getStockPercentage(stock);
                    const status = getStockStatus(percentage);

                    return (
                      <tr key={stock.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {format(new Date(stock.create_at), 'MMM dd, yyyy HH:mm')}
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-900">
                          {stock.snack?.name || stock.snack_id}
                        </td>

                        <td className="text-right py-4 px-6 text-slate-600">
                          {stock.quantity}
                        </td>

                        <td className="text-right py-4 px-6 font-semibold">
                          {stock.quantity_now}
                        </td>

                        <td className="text-center py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${status.cls}`}>
                            {status.label}
                          </span>
                        </td>

                        <td className="text-right py-4 px-6 font-semibold">
                          {percentage.toFixed(1)}%
                        </td>

                        <td className="text-center py-4 px-6">
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(stock.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Stock Entry">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Snack
              </label>
              <select
                value={formData.snack_id}
                onChange={(e) => setFormData({ ...formData, snack_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                required
              >
                <option value="">Select a snack</option>
                {snacks.map((snack) => (
                  <option key={snack.barcode} value={snack.barcode}>
                    {snack.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Initial Quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => {
                const qty = parseInt(e.target.value);
                setFormData({
                  ...formData,
                  quantity: qty,
                  quantity_now: Math.min(formData.quantity_now, qty),
                });
              }}
              required
            />

            <Input
              label="Current Quantity"
              type="number"
              min="0"
              max={formData.quantity}
              value={formData.quantity_now}
              onChange={(e) => setFormData({ ...formData, quantity_now: parseInt(e.target.value) })}
              required
            />

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
