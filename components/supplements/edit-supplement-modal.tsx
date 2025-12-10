'use client';

import { useState } from 'react';
import { Supplement } from '@/lib/db/schema';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { mutate } from 'swr';

interface EditSupplementModalProps {
  supplement: Supplement;
  isOpen: boolean;
  onClose: () => void;
}

export function EditSupplementModal({ supplement, isOpen, onClose }: EditSupplementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: supplement.name,
    pillsPerDose: supplement.pillsPerDose.toString(),
    whenToTake: supplement.whenToTake,
    benefits: supplement.benefits,
    dosage: supplement.dosage || '',
    note: supplement.note || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/supplements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: supplement.id,
          name: formData.name,
          pillsPerDose: parseInt(formData.pillsPerDose),
          whenToTake: formData.whenToTake,
          benefits: formData.benefits,
          dosage: formData.dosage || null,
          note: formData.note || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update supplement');
      }

      mutate('/api/supplements');
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Supplement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="pillsPerDose">Pills per Dose *</Label>
            <Input
              id="pillsPerDose"
              type="number"
              min="1"
              value={formData.pillsPerDose}
              onChange={(e) => setFormData({ ...formData, pillsPerDose: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="whenToTake">When to Take *</Label>
            <select
              id="whenToTake"
              value={formData.whenToTake}
              onChange={(e) => setFormData({ ...formData, whenToTake: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              required
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="before_meal">Before Meal</option>
              <option value="after_meal">After Meal</option>
              <option value="with_meal">With Meal</option>
              <option value="before_bed">Before Bed</option>
              <option value="as_needed">As Needed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="benefits">Benefits *</Label>
            <textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[100px]"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              required
              maxLength={2000}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              maxLength={500}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="note">Note</Label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[80px]"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              maxLength={1000}
            />
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
                Updating...
              </>
            ) : (
              'Update Supplement'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


