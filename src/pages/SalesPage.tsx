import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Modal, Input } from '..';
import { format } from 'date-fns';
import type { CreateSaleRequest } from '../types';

export const SalesPage: React.FC = () => {
  const { sales, snacks, fetchSales, fetchSnacks, createSale, deleteSale, loading, error } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [formData, setFormData] = useState<CreateSaleRequest>({
    snack_id: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchSales();
    fetchSnacks();
  }, [fetchSales, fetchSnacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSale(formData);
      setIsModalOpen(false);
      setFormData({ snack_id: '', quantity: 1 });
    } catch (err) {
      console.error('Failed to create sale:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(id);
      } catch (err) {
        console.error('Failed to delete sale:', err);
      }
    }
  };

  // Filter sales by date
  const filterByDate = (sale: typeof sales[0]) => {
    const saleDate = new Date(sale.timestamp);
    const today = new Date();

    switch (dateFilter) {
      case 'today':
        return saleDate.toDateString() === today.toDateString();
      case 'week': {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= monthAgo;
      }
      default:
        return true;
    }
  };

  const filteredSales = useMemo(() => {
    return sales
      .filter(filterByDate)
      .filter((sale) =>
        sale.snack?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.snack_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [sales, searchTerm, dateFilter]);

  const calculateTotal = (salesList: typeof sales = filteredSales) => {
    return salesList.reduce((total, sale) => {
      const price = sale.snack?.price || 0;
      return total + price * sale.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans px-4 sm:px-6 lg:px-10 2xl:px-16 py-6 lg:py-10 animate-fadeIn">
      <div className="mx-auto w-full max-w-screen-xl space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Sales Records
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Track transactions and revenue.
            </p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <span className="text-lg mr-2">＋</span> Record Sale
          </Button>
        </div>

        {error && (
          <div className="border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border border-slate-200 bg-white rounded-2xl p-6 hover:bg-slate-50 transition">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="mt-2 text-3xl font-semibold">฿{calculateTotal(sales).toFixed(2)}</p>
          </Card>

          <Card className="border border-slate-200 bg-white rounded-2xl p-6 hover:bg-slate-50 transition">
            <p className="text-sm text-slate-500">Filtered Revenue</p>
            <p className="mt-2 text-3xl font-semibold">฿{calculateTotal().toFixed(2)}</p>
          </Card>

          <Card className="border border-slate-200 bg-white rounded-2xl p-6 hover:bg-slate-50 transition">
            <p className="text-sm text-slate-500">Transactions</p>
            <p className="mt-2 text-3xl font-semibold">{filteredSales.length}</p>
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date
              </label>

              <div className="inline-flex w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
                {(['all', 'today', 'week', 'month'] as const).map((filter) => {
                  const active = dateFilter === filter;

                  return (
                    <button
                      type="button"
                      key={filter}
                      onClick={() => setDateFilter(filter)}
                      className={[
                        "flex-1 px-3 py-3 text-sm font-medium transition",
                        "hover:bg-slate-50",
                        active ? "bg-slate-900 text-white hover:bg-slate-900" : "text-slate-700",
                      ].join(" ")}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{filteredSales.length}</span> of{' '}
            <span className="font-medium text-slate-700">{sales.length}</span> sales
          </div>
        </Card>

        {/* Table */}
        <Card className="border border-slate-200 bg-white rounded-2xl p-0 overflow-hidden animate-slideUp">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-900"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading...</p>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4 animate-slideUp">📊</div>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                {searchTerm || dateFilter !== 'all'
                  ? 'No sales found matching your filters.'
                  : 'No sales recorded yet. Make your first sale!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Snack
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSales.map((sale, index) => {
                    const price = sale.snack?.price || 0;
                    const rowTotal = price * sale.quantity;

                    return (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-50 transition animate-slideUp"
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                          {format(new Date(sale.timestamp), 'MMM dd, yyyy HH:mm')}
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-medium text-slate-900">
                            {sale.snack?.name || sale.snack_id}
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {sale.snack_id}
                          </div>
                        </td>

                        <td className="text-right py-4 px-6">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                            {sale.quantity}
                          </span>
                        </td>

                        <td className="text-right py-4 px-6 text-sm text-slate-600 font-medium whitespace-nowrap">
                          ฿{price.toFixed(2)}
                        </td>

                        <td className="text-right py-4 px-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ฿{rowTotal.toFixed(2)}
                          </span>
                        </td>

                        <td className="text-center py-4 px-6">
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(sale.id)}
                            size="sm"
                          >
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="New Sale"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Snack
              </label>
              <select
                value={formData.snack_id}
                onChange={(e) => setFormData({ ...formData, snack_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
                required
              >
                <option value="">Select a snack</option>
                {snacks.map((snack) => (
                  <option key={snack.barcode} value={snack.barcode}>
                    {snack.name} - ฿{snack.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              required
            />

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit Sale
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
