'use client';

import React, { useState } from 'react';
import { Meal } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { EditMealModal } from './edit-meal-modal';
import { Button } from '@/components/ui/button';
import { MealsTable } from './meals-table';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function MealCard({ meal }: { meal: Meal }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/meals?id=${meal.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete meal');
      }

      mutate('/api/meals');
    } catch (error: any) {
      alert(error.message || 'Failed to delete meal');
    } finally {
      setIsDeleting(false);
    }
  };
  const categoryColors: Record<string, string> = {
    breakfast: '#FFE5B4',
    lunch: '#B4E5FF',
    dinner: '#FFB4E5',
    snack: '#E5FFB4',
  };

  const categoryLabels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{meal.name}</h3>
            <span
              className="inline-block px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: categoryColors[meal.category] || '#E5E5E5',
                color: '#333',
              }}
            >
              {categoryLabels[meal.category]}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Portion:</span>
            <span className="font-medium text-gray-900">{meal.portionSize}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Calories:</span>
            <span className="font-medium text-gray-900">{meal.calories} kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-gray-50">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Protein</div>
            <div className="font-semibold text-sm" style={{ color: '#44B080' }}>
              {meal.proteinG}g
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Carbs</div>
            <div className="font-semibold text-sm" style={{ color: '#44B080' }}>
              {meal.carbsG}g
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Fats</div>
            <div className="font-semibold text-sm" style={{ color: '#44B080' }}>
              {meal.fatsG}g
            </div>
          </div>
        </div>

        {/* Dietary Tags */}
        {(meal.lactofree || meal.glutenfree || meal.nutfree || meal.vegan) && (
          <div className="mb-4 flex flex-wrap gap-1">
            {meal.vegan && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Vegan
              </span>
            )}
            {meal.glutenfree && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Gluten Free
              </span>
            )}
            {meal.lactofree && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Lactose Free
              </span>
            )}
            {meal.nutfree && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Nut Free
              </span>
            )}
          </div>
        )}

        {meal.note && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 italic">{meal.note}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
      <EditMealModal
        meal={meal}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Card>
  );
}

interface MealsSliderProps {
  view: 'grid' | 'table';
  meals?: Meal[]; // Optional: if provided, use these instead of fetching
}

export function MealsSlider({ view, meals: providedMeals }: MealsSliderProps) {
  const { data, error, isLoading } = useSWR<{ meals: Meal[] }>(
    providedMeals ? null : '/api/meals', // Don't fetch if meals are provided
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      focusThrottleInterval: 5000,
    }
  );
  const meals = providedMeals || data?.meals || [];

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-gray-500 text-center">Loading meals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-red-500 text-center">Error loading meals</p>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-2">
          {providedMeals ? 'No meals match your filters' : 'No meals yet'}
        </p>
        <p className="text-sm text-gray-400">
          {providedMeals 
            ? 'Try adjusting your search or filter criteria'
            : 'Create your first meal using the form above!'}
        </p>
      </div>
    );
  }

  if (view === 'table') {
    return (
      <div className="relative">
        <MealsTable meals={meals} />
      </div>
    );
  }

  return (
    <div className="relative">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}

