'use client';

import React, { useState } from 'react';
import { Meal } from '@/lib/db/schema';
import { Edit, Trash2 } from 'lucide-react';
import { EditMealModal } from './edit-meal-modal';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';

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

interface MealsTableProps {
  meals: Meal[];
}

function MealTableRow({ meal }: { meal: Meal }) {
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

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{meal.name}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span
            className="inline-block px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: categoryColors[meal.category] || '#E5E5E5',
              color: '#333',
            }}
          >
            {categoryLabels[meal.category]}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{meal.portionSize}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{meal.calories} kcal</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900" style={{ color: '#44B080' }}>
            {meal.proteinG}g
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900" style={{ color: '#44B080' }}>
            {meal.carbsG}g
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900" style={{ color: '#44B080' }}>
            {meal.fatsG}g
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-wrap gap-1">
            {meal.vegan && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Vegan
              </span>
            )}
            {meal.glutenfree && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                GF
              </span>
            )}
            {meal.lactofree && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                LF
              </span>
            )}
            {meal.nutfree && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                NF
              </span>
            )}
            {!meal.vegan && !meal.glutenfree && !meal.lactofree && !meal.nutfree && (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="text-sm text-gray-600 max-w-xs truncate" title={meal.note || ''}>
            {meal.note || 'N/A'}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </td>
      </tr>
      <EditMealModal
        meal={meal}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export function MealsTable({ meals }: MealsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Portion Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Calories
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Protein
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Carbs
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Fats
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Note
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {meals.map((meal) => (
            <MealTableRow key={meal.id} meal={meal} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

