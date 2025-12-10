'use client';

import React, { useState } from 'react';
import { Supplement } from '@/lib/db/schema';
import { Edit, Trash2 } from 'lucide-react';
import { EditSupplementModal } from './edit-supplement-modal';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';

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

interface SupplementsTableProps {
  supplements: Supplement[];
}

function SupplementTableRow({ supplement }: { supplement: Supplement }) {
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
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{supplement.name}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{supplement.pillsPerDose} pill{supplement.pillsPerDose !== 1 ? 's' : ''}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {whenToTakeLabels[supplement.whenToTake] || supplement.whenToTake}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="text-sm text-gray-600 max-w-md">{supplement.benefits}</div>
        </td>
        <td className="px-4 py-4">
          <div className="text-sm text-gray-600 max-w-xs">{supplement.dosage || 'N/A'}</div>
        </td>
        <td className="px-4 py-4">
          <div className="text-sm text-gray-600 max-w-xs truncate" title={supplement.note || ''}>
            {supplement.note || 'N/A'}
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
      <EditSupplementModal
        supplement={supplement}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export function SupplementsTable({ supplements }: SupplementsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Pills per Dose
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              When to Take
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Benefits
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Dosage
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
          {supplements.map((supplement) => (
            <SupplementTableRow key={supplement.id} supplement={supplement} />
          ))}
        </tbody>
      </table>
    </div>
  );
}


