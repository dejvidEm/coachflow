'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Exercise } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Check, Plus } from 'lucide-react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NewTrainingPlanContentProps {
  clientId: number;
}

export function NewTrainingPlanContent({ clientId }: NewTrainingPlanContentProps) {
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: exercisesData, isLoading: exercisesLoading } = useSWR<{ exercises: Exercise[] }>(
    '/api/exercises',
    fetcher
  );

  const { data: clientData, isLoading: clientLoading } = useSWR<{ client: { name: string } }>(
    `/api/clients/${clientId}`,
    fetcher
  );

  const exercises = exercisesData?.exercises || [];
  const client = clientData?.client;

  const toggleExerciseSelection = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleGenerate = async () => {
    if (selectedExercises.length === 0) {
      setError('Please select at least one exercise');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/clients/${clientId}/training-plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseIds: selectedExercises }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Refresh client data
      await mutate(`/api/clients/${clientId}`);
      // Also refresh the clients list to update plan status icons
      await mutate('/api/clients');

      // Navigate back to client detail page
      router.push(`/dashboard/clients/${clientId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  if (exercisesLoading || clientLoading) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#44B080' }} />
        </div>
      </section>
    );
  }

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
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-6">
        <Button
          onClick={() => router.push(`/dashboard/clients/${clientId}`)}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Client
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              New Training Plan{client ? ` for ${client.name}` : ''}
            </h1>
            <p className="text-gray-600">
              Select exercises to include in the training plan PDF
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || selectedExercises.length === 0}
              style={{ backgroundColor: '#44B080' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No exercises found. Please add exercises first.</p>
            <Button
              onClick={() => router.push('/dashboard/exercises')}
              variant="outline"
            >
              Go to Exercises
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => {
            const isSelected = selectedExercises.includes(exercise.id);
            return (
              <Card
                key={exercise.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-[#44B080]' : ''
                }`}
                onClick={() => toggleExerciseSelection(exercise.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {exercise.name}
                      </h3>
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2"
                        style={{
                          backgroundColor: muscleGroupColors[exercise.muscleGroup] || '#E5E5E5',
                          color: '#333',
                        }}
                      >
                        {muscleGroupLabels[exercise.muscleGroup]}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-[#44B080] flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Sets:</span>
                      <span className="font-medium">{exercise.sets}</span>
                    </div>
                  </div>

                  {exercise.description && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 line-clamp-2">{exercise.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}






