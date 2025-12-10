'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Meal, Supplement } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Check, Plus, UtensilsCrossed, Pill } from 'lucide-react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NewMealPlanContentProps {
  clientId: number;
}

export function NewMealPlanContent({ clientId }: NewMealPlanContentProps) {
  const router = useRouter();
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const [selectedSupplements, setSelectedSupplements] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'meals' | 'supplements'>('meals');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: mealsData, isLoading: mealsLoading } = useSWR<{ meals: Meal[] }>(
    '/api/meals',
    fetcher
  );

  const { data: supplementsData, isLoading: supplementsLoading } = useSWR<{ supplements: Supplement[] }>(
    '/api/supplements',
    fetcher
  );

  const { data: clientData, isLoading: clientLoading } = useSWR<{ client: { name: string } }>(
    `/api/clients/${clientId}`,
    fetcher
  );

  const meals = mealsData?.meals || [];
  const supplements = supplementsData?.supplements || [];
  const client = clientData?.client;

  const toggleMealSelection = (mealId: number) => {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
  };

  const toggleSupplementSelection = (supplementId: number) => {
    setSelectedSupplements((prev) =>
      prev.includes(supplementId)
        ? prev.filter((id) => id !== supplementId)
        : [...prev, supplementId]
    );
  };

  const handleGenerate = async () => {
    if (selectedMeals.length === 0 && selectedSupplements.length === 0) {
      setError('Please select at least one meal or supplement');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const selectedMealData = meals.filter((meal) => selectedMeals.includes(meal.id));

      const response = await fetch(`/api/clients/${clientId}/meal-plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mealIds: selectedMeals,
          supplementIds: selectedSupplements,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Refresh client data
      await mutate(`/api/clients/${clientId}`);

      // Navigate back to client detail page
      router.push(`/dashboard/clients/${clientId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  if (mealsLoading || supplementsLoading || clientLoading) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#44B080' }} />
        </div>
      </section>
    );
  }

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
              New Meal Plan{client ? ` for ${client.name}` : ''}
            </h1>
            <p className="text-gray-600">
              Select meals to include in the meal plan PDF
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedMeals.length} meal{selectedMeals.length !== 1 ? 's' : ''}, {selectedSupplements.length} supplement{selectedSupplements.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (selectedMeals.length === 0 && selectedSupplements.length === 0)}
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

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'meals' | 'supplements')} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="meals" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Meals ({selectedMeals.length})
          </TabsTrigger>
          <TabsTrigger value="supplements" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Supplements ({selectedSupplements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meals">
          {meals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No meals found. Please add meals first.</p>
                <Button
                  onClick={() => router.push('/dashboard/meals')}
                  variant="outline"
                >
                  Go to Meals
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map((meal) => {
            const isSelected = selectedMeals.includes(meal.id);
            return (
              <Card
                key={meal.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-[#44B080]' : ''
                }`}
                onClick={() => toggleMealSelection(meal.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {meal.name}
                      </h3>
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2"
                        style={{
                          backgroundColor: categoryColors[meal.category] || '#E5E5E5',
                          color: '#333',
                        }}
                      >
                        {categoryLabels[meal.category]}
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
                      <span>Calories:</span>
                      <span className="font-medium">{meal.calories} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-medium">{meal.proteinG}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs:</span>
                      <span className="font-medium">{meal.carbsG}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fats:</span>
                      <span className="font-medium">{meal.fatsG}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Portion:</span>
                      <span className="font-medium">{meal.portionSize}</span>
                    </div>
                  </div>

                  {meal.note && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 line-clamp-2">{meal.note}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="supplements">
          {supplements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No supplements found. Please add supplements first.</p>
                <Button
                  onClick={() => router.push('/dashboard/supplements')}
                  variant="outline"
                >
                  Go to Supplements
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supplements.map((supplement) => {
                const isSelected = selectedSupplements.includes(supplement.id);
                return (
                  <Card
                    key={supplement.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-[#44B080]' : ''
                    }`}
                    onClick={() => toggleSupplementSelection(supplement.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="p-2 rounded-lg bg-blue-50" style={{ color: '#44B080' }}>
                            <Pill className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-gray-900 truncate">
                              {supplement.name}
                            </h3>
                          </div>
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
                          <span>Dose:</span>
                          <span className="font-medium">{supplement.pillsPerDose} pill{supplement.pillsPerDose !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>When:</span>
                          <span className="font-medium">{whenToTakeLabels[supplement.whenToTake] || supplement.whenToTake}</span>
                        </div>
                        {supplement.dosage && (
                          <div className="flex justify-between">
                            <span>Dosage:</span>
                            <span className="font-medium text-xs">{supplement.dosage}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 p-2 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-600 mb-1">Benefits</div>
                        <div className="text-xs text-gray-900 line-clamp-2">{supplement.benefits}</div>
                      </div>

                      {supplement.note && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 line-clamp-2">{supplement.note}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

const whenToTakeLabels: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  before_meal: 'Before Meal',
  after_meal: 'After Meal',
  with_meal: 'With Meal',
  before_bed: 'Before Bed',
  as_needed: 'As Needed',
};

