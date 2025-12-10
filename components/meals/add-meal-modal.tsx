'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { mutate } from 'swr';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMealModal({ isOpen, onClose }: AddMealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    proteinG: '',
    carbsG: '',
    fatsG: '',
    portionSize: '',
    category: 'breakfast' as 'breakfast' | 'snack' | 'lunch' | 'dinner',
    note: '',
    lactofree: false,
    glutenfree: false,
    nutfree: false,
    vegan: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          calories: parseInt(formData.calories),
          proteinG: parseFloat(formData.proteinG),
          carbsG: parseFloat(formData.carbsG),
          fatsG: parseFloat(formData.fatsG),
          portionSize: formData.portionSize,
          category: formData.category,
          note: formData.note || null,
          lactofree: formData.lactofree,
          glutenfree: formData.glutenfree,
          nutfree: formData.nutfree,
          vegan: formData.vegan,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create meal';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      mutate('/api/meals');
      setFormData({
        name: '',
        calories: '',
        proteinG: '',
        carbsG: '',
        fatsG: '',
        portionSize: '',
        category: 'breakfast',
        note: '',
        lactofree: false,
        glutenfree: false,
        nutfree: false,
        vegan: false,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Meal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Meal Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Grilled Chicken Breast"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <Label htmlFor="calories">Calories *</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              required
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="portionSize">Portion Size *</Label>
            <Input
              id="portionSize"
              value={formData.portionSize}
              onChange={(e) => setFormData({ ...formData, portionSize: e.target.value })}
              required
              placeholder="e.g., 200g, 1 cup, 2 pieces"
            />
          </div>

          <div>
            <Label htmlFor="proteinG">Protein (g) *</Label>
            <Input
              id="proteinG"
              type="number"
              step="0.01"
              min="0"
              value={formData.proteinG}
              onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
              required
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="carbsG">Carbs (g) *</Label>
            <Input
              id="carbsG"
              type="number"
              step="0.01"
              min="0"
              value={formData.carbsG}
              onChange={(e) => setFormData({ ...formData, carbsG: e.target.value })}
              required
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="fatsG">Fats (g) *</Label>
            <Input
              id="fatsG"
              type="number"
              step="0.01"
              min="0"
              value={formData.fatsG}
              onChange={(e) => setFormData({ ...formData, fatsG: e.target.value })}
              required
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="note">Note (optional)</Label>
          <textarea
            id="note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[100px]"
            style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
            placeholder="Additional notes about this meal..."
            maxLength={1000}
          />
        </div>

        {/* Dietary Tags */}
        <div className="pt-2 border-t border-gray-200">
          <Label className="text-base font-medium">Dietary Tags (optional)</Label>
          <p className="text-xs text-gray-500 mb-3">Select any dietary restrictions or preferences</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.lactofree}
                onChange={(e) => setFormData({ ...formData, lactofree: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#44B080] focus:ring-[#44B080] focus:ring-2"
              />
              <span className="text-sm text-gray-700 font-medium">Lactose Free</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.glutenfree}
                onChange={(e) => setFormData({ ...formData, glutenfree: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#44B080] focus:ring-[#44B080] focus:ring-2"
              />
              <span className="text-sm text-gray-700 font-medium">Gluten Free</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.nutfree}
                onChange={(e) => setFormData({ ...formData, nutfree: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#44B080] focus:ring-[#44B080] focus:ring-2"
              />
              <span className="text-sm text-gray-700 font-medium">Nut Free</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.vegan}
                onChange={(e) => setFormData({ ...formData, vegan: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#44B080] focus:ring-[#44B080] focus:ring-2"
              />
              <span className="text-sm text-gray-700 font-medium">Vegan</span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: '#44B080' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Meal
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

