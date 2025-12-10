'use client';

import { useState, useEffect, useMemo } from 'react';
import { ClientsSlider } from '@/components/clients/clients-slider';
import { AddClientModal } from '@/components/clients/add-client-modal';
import { Users, Plus, LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';
import { FilterSortBar, SortOption, FilterOption } from '@/components/shared/filter-sort-bar';
import { Client } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewType = 'card' | 'table';

export function ClientsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterGoal, setFilterGoal] = useState('');

  const { data } = useSWR<{ clients: Client[] }>('/api/clients', fetcher);
  const allClients = data?.clients || [];

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('clients-view') as ViewType;
    if (savedView === 'card' || savedView === 'table') {
      setView(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem('clients-view', newView);
  };

  // Clear and revalidate cache when component mounts
  useEffect(() => {
    mutate('/api/clients');
  }, []);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...allClients];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.gender?.toLowerCase().includes(query)
      );
    }

    // Filter by fitness goal
    if (filterGoal) {
      filtered = filtered.filter((client) => client.fitnessGoal === filterGoal);
    }

    // Sort
    const [sortField, sortDirection] = sortBy.split('-');
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'goal':
          aValue = a.fitnessGoal;
          bValue = b.fitnessGoal;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allClients, searchQuery, sortBy, filterGoal]);

  const sortOptions: SortOption[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
    { value: 'updated-desc', label: 'Recently Updated' },
    { value: 'goal-asc', label: 'Goal (A-Z)' },
  ];

  const filterOptions: FilterOption[] = [
    { value: 'mass_gain', label: 'Mass Gain' },
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'maintain', label: 'Maintain' },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" style={{ color: '#44B080' }} />
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
            Clients ({filteredAndSortedClients.length})
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => handleViewChange('card')}
              className={`p-2 rounded transition-colors ${
                view === 'card'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              style={view === 'card' ? { color: '#44B080' } : { color: '#666' }}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewChange('table')}
              className={`p-2 rounded transition-colors ${
                view === 'table'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              style={view === 'table' ? { color: '#44B080' } : { color: '#666' }}
              title="Table view"
            >
              <Table className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#44B080' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
            className="text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <FilterSortBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        filterValue={filterGoal}
        onFilterChange={setFilterGoal}
        filterOptions={filterOptions}
        filterLabel="Goal"
      />

      <ClientsSlider view={view} clients={filteredAndSortedClients} />
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

