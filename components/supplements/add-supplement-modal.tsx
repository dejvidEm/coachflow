'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { mutate } from 'swr';

interface AddSupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSupplementModal({ isOpen, onClose }: AddSupplementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pillsPerDose: '',
    whenToTake: 'morning' as 'morning' | 'afternoon' | 'evening' | 'before_meal' | 'after_meal' | 'with_meal' | 'before_bed' | 'as_needed',
    benefits: '',
    dosage: '',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/supplements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          pillsPerDose: parseInt(formData.pillsPerDose),
          whenToTake: formData.whenToTake,
          benefits: formData.benefits,
          dosage: formData.dosage || null,
          note: formData.note || null,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create supplement';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      mutate('/api/supplements');
      setFormData({
        name: '',
        pillsPerDose: '',
        whenToTake: 'morning',
        benefits: '',
        dosage: '',
        note: '',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Supplement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Supplement Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Vitamin D3"
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
              placeholder="e.g., 2"
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
              placeholder="Describe the benefits of this supplement..."
              required
              maxLength={2000}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="dosage">Dosage (optional)</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 5000 IU daily"
              maxLength={500}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="note">Note (optional)</Label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[80px]"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              placeholder="Additional notes about this supplement..."
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
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Supplement
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


