'use client';

import React from 'react';
import { Client } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';

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

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();

  const handleRowClick = (clientId: number) => {
    router.push(`/dashboard/clients/${clientId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Goal
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Date of Birth
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Weight
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Height
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Note
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => {
            const age = calculateAge(client.dateOfBirth);
            return (
              <tr
                key={client.id}
                onClick={() => handleRowClick(client.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: fitnessGoalColors[client.fitnessGoal] || '#E5E5E5',
                      color: '#333',
                    }}
                  >
                    {fitnessGoalLabels[client.fitnessGoal]}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.email || 'N/A'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(client.dateOfBirth)}
                    {age !== null && ` (${age})`}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{client.gender || 'N/A'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {client.actualWeight !== null ? `${client.actualWeight} kg` : 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {client.actualHeight !== null ? `${client.actualHeight} cm` : 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate" title={client.note || ''}>
                    {client.note || 'N/A'}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


