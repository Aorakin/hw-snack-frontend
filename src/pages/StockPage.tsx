import React, { useEffect, useState } from 'react';
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

  // Calculate stock percentage
  const getStockPercentage = (stock: typeof stocks[0]) => {
    return stock.quantity > 0 ? (stock.quantity_now / stock.quantity) * 100 : 0;
  };

  // Get stock status
  const getStockStatus = (percentage: number) => {
    if (percentage < 30) return { label: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage < 70) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'High', color: 'text-green-600', bg: 'bg-green-100' };
  };

  // Filter stocks
  const filteredStocks = stocks
    .filter(stock => {
      const percentage = getStockPercentage(stock);
      const matchesSearch = stock.snack?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stock.snack_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (stockFilter) {
        case 'low':
          return percentage < 30;
        case 'medium':
          return percentage >= 30 && percentage < 70;
        case 'high':
          return percentage >= 70;
        default:
          return true;
      }
    })
    .sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());

  const lowStockCount = stocks.filter(s => getStockPercentage(s) < 30).length;
  const totalItems = stocks.reduce((sum, s) => sum + s.quantity_now, 0);

  return (
    <div className="container mx-auto px-6 py-12 animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Stock Management</h1>
          <p className="text-white/90 text-lg">Monitor inventory levels</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg" variant="gradient">
          <span className="text-xl">+</span> Add Stock Entry
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm font-medium mb-1">Total Stock Entries</p>
          <p className="text-3xl font-bold">{stocks.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm font-medium mb-1">Total Items in Stock</p>
          <p className="text-3xl font-bold">{totalItems}</p>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-red-100 text-sm font-medium mb-1">Low Stock Alerts</p>
          <p className="text-3xl font-bold">{lowStockCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Stock
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
              Stock Level Filter
            </label>
            <div className="flex gap-3">
              {[
                { value: 'all', label: 'All' },
                { value: 'low', label: 'Low (<30%)' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High (>70%)' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStockFilter(filter.value as typeof stockFilter)}
                  className={`px-3 py-3 rounded-lg font-semibold text-sm transition-all ${
                    stockFilter === filter.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredStocks.length} of {stocks.length} stock entries
        </div>
      </Card>

      <Card className="animate-slideUp" style={{animationDelay: '0.1s'}}>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">Loading...</p>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            <p className="text-gray-500 text-xl font-semibold">
              {searchTerm || stockFilter !== 'all'
                ? 'No stock entries found matching your filters'
                : 'No stock entries found. Add your first stock!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <th className="text-left py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Created At</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Snack</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Initial Qty</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Current Qty</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Stock %</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStocks.map((stock, index) => {
                  const percentage = getStockPercentage(stock);
                  const status = getStockStatus(percentage);
                  
                  return (
                    <tr key={stock.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all animate-slideUp" style={{animationDelay: `${index * 0.05}s`}}>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {format(new Date(stock.create_at), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {stock.snack?.name || stock.snack_id}
                      </td>
                      <td className="text-right py-4 px-6 text-gray-600 font-medium">{stock.quantity}</td>
                      <td className="text-right py-4 px-6">
                        <span className="font-bold text-lg text-gray-900">{stock.quantity_now}</span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${status.bg} ${status.color} uppercase tracking-wide`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6">
                        <span className={`font-bold text-lg ${status.color}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(stock.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Stock Entry"
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
                quantity_now: Math.min(formData.quantity_now, qty)
              });
            }}
            required
            placeholder="Enter initial quantity"
          />
          <Input
            label="Current Quantity"
            type="number"
            min="0"
            max={formData.quantity}
            value={formData.quantity_now}
            onChange={(e) => setFormData({ ...formData, quantity_now: parseInt(e.target.value) })}
            required
            placeholder="Enter current quantity"
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
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
