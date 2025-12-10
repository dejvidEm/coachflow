'use client';

import React, { useState } from 'react';
import { Supplement } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Pill } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { EditSupplementModal } from './edit-supplement-modal';
import { Button } from '@/components/ui/button';
import { SupplementsTable } from './supplements-table';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

function SupplementCard({ supplement }: { supplement: Supplement }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this supplement?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/supplements?id=${supplement.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete supplement');
      }

      mutate('/api/supplements');
    } catch (error: any) {
      alert(error.message || 'Failed to delete supplement');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="p-2 rounded-lg bg-blue-50" style={{ color: '#44B080' }}>
              <Pill className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 truncate">{supplement.name}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Dose:</span>
            <span className="font-medium text-gray-900">{supplement.pillsPerDose} pill{supplement.pillsPerDose !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">When:</span>
            <span className="font-medium text-gray-900">{whenToTakeLabels[supplement.whenToTake] || supplement.whenToTake}</span>
          </div>
        </div>

        <div className="mb-3 p-2 rounded-lg bg-gray-50">
          <div className="text-xs text-gray-600 mb-1">Benefits</div>
          <div className="text-xs text-gray-900 line-clamp-2">{supplement.benefits}</div>
        </div>

        {supplement.dosage && (
          <div className="mb-3 text-xs text-gray-600">
            <span className="font-medium">Dosage: </span>
            {supplement.dosage}
          </div>
        )}

        {supplement.note && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 italic line-clamp-2">{supplement.note}</p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
      <EditSupplementModal
        supplement={supplement}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Card>
  );
}

interface SupplementsSliderProps {
  view: 'grid' | 'table';
  supplements?: Supplement[]; // Optional: if provided, use these instead of fetching
}

export function SupplementsSlider({ view, supplements: providedSupplements }: SupplementsSliderProps) {
  const { data, error, isLoading } = useSWR<{ supplements: Supplement[] }>(
    providedSupplements ? null : '/api/supplements', // Don't fetch if supplements are provided
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      focusThrottleInterval: 5000,
    }
  );
  const supplements = providedSupplements || data?.supplements || [];

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-gray-500 text-center">Loading supplements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-red-500 text-center">Error loading supplements</p>
      </div>
    );
  }

  if (supplements.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-2">
          {providedSupplements ? 'No supplements match your filters' : 'No supplements yet'}
        </p>
        <p className="text-sm text-gray-400">
          {providedSupplements 
            ? 'Try adjusting your search or filter criteria'
            : 'Create your first supplement using the form above!'}
        </p>
      </div>
    );
  }

  if (view === 'table') {
    return (
      <div className="relative">
        <SupplementsTable supplements={supplements} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {supplements.map((supplement) => (
          <SupplementCard key={supplement.id} supplement={supplement} />
        ))}
      </div>
    </div>
  );
}


