'use client';

import React, { useRef } from 'react';
import { Client } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { ClientsTable } from './clients-table';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ClientCard({ client }: { client: Client }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/clients/${client.id}`);
  };
  const fitnessGoalColors: Record<string, string> = {
    mass_gain: '#B4E5FF',
    weight_loss: '#FFB4E5',
    maintain: '#E5FFB4',
  };

  const fitnessGoalLabels: Record<string, string> = {
    mass_gain: 'Mass Gain',
    weight_loss: 'Weight Loss',
    maintain: 'Maintain',
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateAge = (dateOfBirth: Date | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(client.dateOfBirth);

  return (
    <Card 
      className="min-w-[300px] max-w-[300px] h-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{client.name}</h3>
            <span
              className="inline-block px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: fitnessGoalColors[client.fitnessGoal] || '#E5E5E5',
                color: '#333',
              }}
            >
              {fitnessGoalLabels[client.fitnessGoal]}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {client.email && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{client.email}</span>
            </div>
          )}
          {client.dateOfBirth && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium text-gray-900">
                {formatDate(client.dateOfBirth)}
                {age !== null && ` (${age})`}
              </span>
            </div>
          )}
          {client.gender && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium text-gray-900 capitalize">{client.gender}</span>
            </div>
          )}
        </div>

        {(client.actualWeight !== null || client.actualHeight !== null) && (
          <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-lg bg-gray-50">
            {client.actualWeight !== null && (
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Weight</div>
                <div className="font-semibold text-sm" style={{ color: '#44B080' }}>
                  {client.actualWeight} kg
                </div>
              </div>
            )}
            {client.actualHeight !== null && (
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Height</div>
                <div className="font-semibold text-sm" style={{ color: '#44B080' }}>
                  {client.actualHeight} cm
                </div>
              </div>
            )}
          </div>
        )}

        {client.note && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 italic line-clamp-2">{client.note}</p>
          </div>
        )}

        <div className="mt-4 pt-2 text-xs text-gray-500 text-center">
          Click to view details →
        </div>
      </CardContent>
    </Card>
  );
}

interface ClientsSliderProps {
  view: 'card' | 'table';
  clients?: Client[]; // Optional: if provided, use these instead of fetching
}

export function ClientsSlider({ view, clients: providedClients }: ClientsSliderProps) {
  const { data, error, isLoading } = useSWR<{ clients: Client[] }>(
    providedClients ? null : '/api/clients', // Don't fetch if clients are provided
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      focusThrottleInterval: 5000,
    }
  );
  const clients = providedClients || data?.clients || [];
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer.current) return;
    
    const container = scrollContainer.current;
    const scrollAmount = 320; // card width + gap
    const currentScroll = container.scrollLeft;
    const newPosition = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-gray-500 text-center">Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-red-500 text-center">Error loading clients</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-2">
          {providedClients ? 'No clients match your filters' : 'No clients yet'}
        </p>
        <p className="text-sm text-gray-400">
          {providedClients 
            ? 'Try adjusting your search or filter criteria'
            : 'Create your first client using the form above!'}
        </p>
      </div>
    );
  }

  if (view === 'table') {
    return (
      <div className="relative">
        <ClientsTable clients={clients} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
            style={{ borderColor: '#44B080', color: '#44B080' }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
            style={{ borderColor: '#44B080', color: '#44B080' }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainer}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

