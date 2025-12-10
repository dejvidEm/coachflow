'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Exercise } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { EditExerciseModal } from './edit-exercise-modal';
import { Button } from '@/components/ui/button';
import { ExercisesTable } from './exercises-table';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ExerciseCard({ exercise }: { exercise: Exercise }) {
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

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        {exercise.photo && (
          <div className="mb-4 rounded-lg overflow-hidden relative w-full h-48">
            <Image
              src={exercise.photo}
              alt={exercise.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{exercise.name}</h3>
            <span
              className="inline-block px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: muscleGroupColors[exercise.muscleGroup] || '#E5E5E5',
                color: '#333',
              }}
            >
              {muscleGroupLabels[exercise.muscleGroup]}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sets:</span>
            <span className="font-semibold text-gray-900" style={{ color: '#44B080' }}>
              {exercise.sets}
            </span>
          </div>
        </div>

        {exercise.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">{exercise.description}</p>
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
      <EditExerciseModal
        exercise={exercise}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Card>
  );
}

interface ExercisesSliderProps {
  view: 'grid' | 'table';
  exercises?: Exercise[]; // Optional: if provided, use these instead of fetching
}

export function ExercisesSlider({ view, exercises: providedExercises }: ExercisesSliderProps) {
  const { data, error, isLoading } = useSWR<{ exercises: Exercise[] }>(
    providedExercises ? null : '/api/exercises', // Don't fetch if exercises are provided
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      focusThrottleInterval: 5000,
    }
  );
  const exercises = providedExercises || data?.exercises || [];

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-gray-500 text-center">Loading exercises...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-red-500 text-center">Error loading exercises</p>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-2">
          {providedExercises ? 'No exercises match your filters' : 'No exercises yet'}
        </p>
        <p className="text-sm text-gray-400">
          {providedExercises 
            ? 'Try adjusting your search or filter criteria'
            : 'Create your first exercise using the form above!'}
        </p>
      </div>
    );
  }

  if (view === 'table') {
    return (
      <div className="relative">
        <ExercisesTable exercises={exercises} />
      </div>
    );
  }

  return (
    <div className="relative">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}


