'use client';

import React from 'react';
import { Client } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
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

  // Gender-based colors for profile icon
  const getGenderColors = (gender: string | null) => {
    if (!gender) return { bg: '#E5E5E520', icon: '#9CA3AF' }; // gray for no gender
    
    const genderLower = gender.toLowerCase();
    if (genderLower === 'male' || genderLower === 'm') {
      return { bg: '#3B82F620', icon: '#3B82F6' }; // blue
    } else if (genderLower === 'female' || genderLower === 'f') {
      return { bg: '#EC489920', icon: '#EC4899' }; // pink
    } else {
      return { bg: '#E5E5E520', icon: '#9CA3AF' }; // gray for other
    }
  };

  const genderColors = getGenderColors(client.gender);

  return (
    <Card 
      className="w-full h-[340px] cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
      onClick={handleCardClick}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3 flex-shrink-0">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: genderColors.bg }}>
              <UserCircle className="w-8 h-8" style={{ color: genderColors.icon }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{client.name}</h3>
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

        <div className="space-y-2 mb-3 flex-shrink-0">
          {client.email && (
            <div className="flex justify-between text-sm gap-2">
              <span className="text-gray-600 flex-shrink-0">Email:</span>
              <span className="font-medium text-gray-900 truncate text-right">{client.email}</span>
            </div>
          )}
          {client.dateOfBirth && (
            <div className="flex justify-between text-sm gap-2">
              <span className="text-gray-600 flex-shrink-0">Date of Birth:</span>
              <span className="font-medium text-gray-900 text-right">
                {formatDate(client.dateOfBirth)}
                {age !== null && ` (${age})`}
              </span>
            </div>
          )}
          {client.gender && (
            <div className="flex justify-between text-sm gap-2">
              <span className="text-gray-600 flex-shrink-0">Gender:</span>
              <span className="font-medium text-gray-900 capitalize text-right">{client.gender}</span>
            </div>
          )}
        </div>

        {(client.actualWeight !== null || client.actualHeight !== null) && (
          <div className="grid grid-cols-2 gap-2 mb-3 p-2 rounded-lg bg-gray-50 flex-shrink-0">
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
          <div className="mt-auto pt-2 border-t border-gray-200 flex-shrink-0">
            <p className="text-xs text-gray-600 italic line-clamp-2">{client.note}</p>
          </div>
        )}

        {!client.note && (
          <div className="mt-auto"></div>
        )}

        <div className="pt-1 text-xs text-center flex-shrink-0" style={{ color: '#44B080' }}>
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

  // Grid view instead of slider
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}

