import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Modal, Input } from '..';
import type { Snack } from '../types';

export const SnacksPage: React.FC = () => {
  const { snacks, fetchSnacks, createSnack, deleteSnack, loading, error } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [formData, setFormData] = useState<Snack>({
    barcode: '',
    name: '',
    price: 0,
  });

  useEffect(() => {
    fetchSnacks();
  }, [fetchSnacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSnack(formData);
      setIsModalOpen(false);
      setFormData({ barcode: '', name: '', price: 0 });
    } catch (err) {
      console.error('Failed to create snack:', err);
    }
  };

  const handleDelete = async (barcode: string) => {
    if (window.confirm('Are you sure you want to delete this snack?')) {
      try {
        await deleteSnack(barcode);
      } catch (err) {
        console.error('Failed to delete snack:', err);
      }
    }
  };

  // Filter and sort snacks
  const filteredSnacks = snacks
    .filter(snack => 
      snack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snack.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') {
        return multiplier * a.name.localeCompare(b.name);
      }
      return multiplier * (a.price - b.price);
    });

  return (
    <div className="container mx-auto px-6 py-12 animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Snacks Management</h1>
          <p className="text-white/90 text-lg">Manage your snack inventory</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg" variant="gradient">
          <span className="text-xl">+</span> Add New Snack
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg animate-slideDown">
          <span className="font-semibold">⚠️ {error}</span>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-10 animate-slideUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              🔍 Search Snacks
            </label>
            <input
              type="text"
              placeholder="🔍 Search by name or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredSnacks.length} of {snacks.length} snacks
        </div>
      </Card>

      <Card className="animate-slideUp" style={{animationDelay: '0.1s'}}>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">Loading...</p>
          </div>
        ) : filteredSnacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 animate-bounce">🔍</div>
            <p className="text-gray-500 text-xl font-semibold">
              {searchTerm ? 'No snacks found matching your search' : 'No snacks found. Add your first snack!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <th className="text-left py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Barcode</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Name</th>
                  <th className="text-right py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Price</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSnacks.map((snack, index) => (
                  <tr key={snack.barcode} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all animate-slideUp" style={{animationDelay: `${index * 0.05}s`}}>
                    <td className="py-4 px-6 font-mono text-sm bg-gray-50 rounded-lg my-2 mx-2">{snack.barcode}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">{snack.name}</td>
                    <td className="text-right py-4 px-6">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-md">
                        ฿{snack.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(snack.barcode)}
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
        title="Add New Snack"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Barcode"
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            required
            placeholder="Enter barcode"
          />
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter snack name"
          />
          <Input
            label="Price (฿)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
            placeholder="0.00"
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
              Create Snack
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
