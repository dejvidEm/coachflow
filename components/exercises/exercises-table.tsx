'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Exercise } from '@/lib/db/schema';
import { Edit, Trash2 } from 'lucide-react';
import { EditExerciseModal } from './edit-exercise-modal';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';

const muscleGroupColors: Record<string, string> = {
  back: '#B4E5FF',
  chest: '#FFB4E5',
  arms: '#E5FFB4',
};

const muscleGroupLabels: Record<string, string> = {
  back: 'Back',
  chest: 'Chest',
  arms: 'Arms',
};

interface ExercisesTableProps {
  exercises: Exercise[];
}

function ExerciseTableRow({ exercise }: { exercise: Exercise }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this exercise?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/exercises?id=${exercise.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete exercise');
      }

      mutate('/api/exercises');
    } catch (error: any) {
      alert(error.message || 'Failed to delete exercise');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap">
          {exercise.photo && (
            <div className="relative w-16 h-16 rounded overflow-hidden">
              <Image
                src={exercise.photo}
                alt={exercise.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          {!exercise.photo && <div className="w-16 h-16 bg-gray-200 rounded"></div>}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span
            className="inline-block px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: muscleGroupColors[exercise.muscleGroup] || '#E5E5E5',
              color: '#333',
            }}
          >
            {muscleGroupLabels[exercise.muscleGroup]}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900" style={{ color: '#44B080' }}>
            {exercise.sets}
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="text-sm text-gray-600 max-w-xs truncate" title={exercise.description || ''}>
            {exercise.description || 'N/A'}
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
      <EditExerciseModal
        exercise={exercise}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export function ExercisesTable({ exercises }: ExercisesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Photo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Muscle Group
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Sets
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {exercises.map((exercise) => (
            <ExerciseTableRow key={exercise.id} exercise={exercise} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

