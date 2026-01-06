import React, { useEffect, useState } from 'react';
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
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= monthAgo;
      default:
        return true;
    }
  };

  // Filter and search sales
  const filteredSales = sales
    .filter(filterByDate)
    .filter(sale => 
      sale.snack?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.snack_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const calculateTotal = (salesList: typeof sales = filteredSales) => {
    return salesList.reduce((total, sale) => {
      const price = sale.snack?.price || 0;
      return total + (price * sale.quantity);
    }, 0);
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Sales Records</h1>
          <p className="text-white/90 text-lg">Track your sales transactions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg" variant="gradient">
          <span className="text-xl">+</span> Record Sale
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">฿{calculateTotal(sales).toFixed(2)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm font-medium mb-1">Filtered Revenue</p>
          <p className="text-3xl font-bold">฿{calculateTotal().toFixed(2)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-purple-100 text-sm font-medium mb-1">Transactions</p>
          <p className="text-3xl font-bold">{filteredSales.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Sales
            </label>
            <input
              type="text"
              placeholder="🔍 Search by snack name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Filter
            </label>
            <div className="flex gap-3">
              {['all', 'today', 'week', 'month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter as typeof dateFilter)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    dateFilter === filter
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredSales.length} of {sales.length} sales
        </div>
      </Card>

      <Card className="animate-slideUp" style={{animationDelay: '0.1s'}}>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">Loading...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 animate-bounce">📊</div>
            <p className="text-gray-500 text-xl font-semibold">
              {searchTerm || dateFilter !== 'all' 
                ? 'No sales found matching your filters' 
                : 'No sales recorded yet. Make your first sale!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <th className="text-left py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Date/Time</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Snack</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Quantity</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Price</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Total</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((sale, index) => (
                  <tr key={sale.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all animate-slideUp" style={{animationDelay: `${index * 0.05}s`}}>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {format(new Date(sale.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      {sale.snack?.name || sale.snack_id}
                    </td>
                    <td className="text-right py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-sm">
                        {sale.quantity}
                      </span>
                    </td>
                    <td className="text-right py-4 px-6 text-gray-600 font-medium">
                      ฿{(sale.snack?.price || 0).toFixed(2)}
                    </td>
                    <td className="text-right py-4 px-6">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-md">
                        ฿{((sale.snack?.price || 0) * sale.quantity).toFixed(2)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Sale"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Snack
            </label>
            <select
              value={formData.snack_id}
              onChange={(e) => setFormData({ ...formData, snack_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
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
  );
};
