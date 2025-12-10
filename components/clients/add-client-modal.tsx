'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { mutate } from 'swr';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    gender: '',
    note: '',
    actualWeight: '',
    actualHeight: '',
    fitnessGoal: 'maintain' as 'mass_gain' | 'weight_loss' | 'maintain',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        name: formData.name,
        fitnessGoal: formData.fitnessGoal,
      };

      if (formData.dateOfBirth && formData.dateOfBirth.trim() !== '') {
        payload.dateOfBirth = formData.dateOfBirth;
      } else {
        payload.dateOfBirth = null;
      }
      if (formData.email) {
        payload.email = formData.email;
      }
      if (formData.gender) {
        payload.gender = formData.gender;
      }
      if (formData.note) {
        payload.note = formData.note;
      }
      if (formData.actualWeight) {
        payload.actualWeight = parseFloat(formData.actualWeight);
      }
      if (formData.actualHeight) {
        payload.actualHeight = parseFloat(formData.actualHeight);
      }

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create client';
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
      mutate('/api/clients');
      setFormData({
        name: '',
        dateOfBirth: '',
        email: '',
        gender: '',
        note: '',
        actualWeight: '',
        actualHeight: '',
        fitnessGoal: 'maintain',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Client name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@example.com"
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="actualWeight">Weight (kg)</Label>
            <Input
              id="actualWeight"
              type="number"
              step="0.1"
              min="0"
              value={formData.actualWeight}
              onChange={(e) => setFormData({ ...formData, actualWeight: e.target.value })}
              placeholder="70.5"
            />
          </div>

          <div>
            <Label htmlFor="actualHeight">Height (cm)</Label>
            <Input
              id="actualHeight"
              type="number"
              step="0.1"
              min="0"
              value={formData.actualHeight}
              onChange={(e) => setFormData({ ...formData, actualHeight: e.target.value })}
              placeholder="175"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="fitnessGoal">Fitness Goal *</Label>
            <select
              id="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              required
            >
              <option value="mass_gain">Mass Gain</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="note">Note</Label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[100px]"
              style={{ '--tw-ring-color': '#44B080' } as React.CSSProperties}
              placeholder="Additional notes about the client..."
              maxLength={2000}
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
                Add Client
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

