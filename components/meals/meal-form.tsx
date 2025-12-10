'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { Meal } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type MealFormData = {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  portionSize: string;
  category: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  note: string;
};

export function MealForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatsG: 0,
    portionSize: '',
    category: 'breakfast',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meal');
      }

      setSuccess(true);
      setFormData({
        name: '',
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatsG: 0,
        portionSize: '',
        category: 'breakfast',
        note: '',
      });

      // Refresh meals list
      mutate('/api/meals');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" style={{ color: '#44B080' }} />
          Create New Meal
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                style={{ 
                  '--tw-ring-color': '#44B080',
                } as React.CSSProperties}
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
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
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
                value={formData.proteinG || ''}
                onChange={(e) => setFormData({ ...formData, proteinG: parseFloat(e.target.value) || 0 })}
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
                value={formData.carbsG || ''}
                onChange={(e) => setFormData({ ...formData, carbsG: parseFloat(e.target.value) || 0 })}
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
                value={formData.fatsG || ''}
                onChange={(e) => setFormData({ ...formData, fatsG: parseFloat(e.target.value) || 0 })}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[80px]"
              style={{ 
                '--tw-ring-color': '#44B080',
              } as React.CSSProperties}
              placeholder="Additional notes about this meal..."
              maxLength={1000}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm">Meal created successfully!</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white"
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
        </form>
      </CardContent>
    </Card>
  );
}

