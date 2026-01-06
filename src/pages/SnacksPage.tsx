import React, { useEffect, useMemo, useState } from 'react';
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

  const filteredSnacks = useMemo(() => {
    return snacks
      .filter((snack) =>
        snack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snack.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'name') return multiplier * a.name.localeCompare(b.name);
        return multiplier * (a.price - b.price);
      });
  }, [snacks, searchTerm, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans px-4 sm:px-6 lg:px-10 2xl:px-16 py-6 lg:py-10 animate-fadeIn">
      <div className="mx-auto w-full max-w-screen-xl space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Snacks
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Manage your snack inventory.
            </p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <span className="text-lg mr-2">＋</span> Add Snack
          </Button>
        </div>

        {error && (
          <div className="border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 rounded-xl animate-slideDown">
            <span className="font-medium">⚠️ {error}</span>
          </div>
        )}

        {/* Filters */}
        <Card className="border border-slate-200 bg-white rounded-2xl p-5 sm:p-6 animate-slideUp">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sort
              </label>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition bg-white"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-semibold"
                  aria-label="Toggle sort order"
                  title="Toggle sort order"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{filteredSnacks.length}</span> of{' '}
            <span className="font-medium text-slate-700">{snacks.length}</span> snacks
          </div>
        </Card>

        {/* Table */}
        <Card className="border border-slate-200 bg-white rounded-2xl p-0 overflow-hidden animate-slideUp">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-900"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading...</p>
            </div>
          ) : filteredSnacks.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4 animate-slideUp">🔍</div>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                {searchTerm ? 'No snacks found matching your search.' : 'No snacks yet. Add your first snack!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Barcode
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSnacks.map((snack, index) => (
                    <tr
                      key={snack.barcode}
                      className="hover:bg-slate-50 transition animate-slideUp"
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <td className="py-4 px-6">
                        <span className="inline-flex font-mono text-sm text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1">
                          {snack.barcode}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{snack.name}</div>
                      </td>

                      <td className="text-right py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
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

        {/* Modal */}
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
    </div>
  );
};
