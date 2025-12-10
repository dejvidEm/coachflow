'use client';

import { useState, useEffect, useMemo } from 'react';
import { SupplementsSlider } from '@/components/supplements/supplements-slider';
import { AddSupplementModal } from '@/components/supplements/add-supplement-modal';
import { Pill, Plus, LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';
import { FilterSortBar, SortOption, FilterOption } from '@/components/shared/filter-sort-bar';
import { Supplement } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewType = 'grid' | 'table';

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

export function SupplementsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterWhenToTake, setFilterWhenToTake] = useState('');

  const { data } = useSWR<{ supplements: Supplement[] }>('/api/supplements', fetcher);
  const allSupplements = data?.supplements || [];

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('supplements-view') as ViewType;
    if (savedView === 'grid' || savedView === 'table') {
      setView(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem('supplements-view', newView);
  };

  // Clear and revalidate cache when component mounts
  useEffect(() => {
    mutate('/api/supplements');
  }, []);

  // Filter and sort supplements
  const filteredAndSortedSupplements = useMemo(() => {
    let filtered = [...allSupplements];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (supplement) =>
          supplement.name.toLowerCase().includes(query) ||
          supplement.benefits.toLowerCase().includes(query) ||
          supplement.note?.toLowerCase().includes(query) ||
          supplement.dosage?.toLowerCase().includes(query)
      );
    }

    // Filter by when to take
    if (filterWhenToTake) {
      filtered = filtered.filter((supplement) => supplement.whenToTake === filterWhenToTake);
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
        case 'whenToTake':
          aValue = a.whenToTake;
          bValue = b.whenToTake;
          break;
        case 'pillsPerDose':
          aValue = a.pillsPerDose;
          bValue = b.pillsPerDose;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allSupplements, searchQuery, sortBy, filterWhenToTake]);

  const sortOptions: SortOption[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'whenToTake-asc', label: 'When to Take (A-Z)' },
    { value: 'pillsPerDose-asc', label: 'Pills per Dose (Low to High)' },
    { value: 'pillsPerDose-desc', label: 'Pills per Dose (High to Low)' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
  ];

  const filterOptions: FilterOption[] = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'before_meal', label: 'Before Meal' },
    { value: 'after_meal', label: 'After Meal' },
    { value: 'with_meal', label: 'With Meal' },
    { value: 'before_bed', label: 'Before Bed' },
    { value: 'as_needed', label: 'As Needed' },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6" style={{ color: '#44B080' }} />
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
            Supplements ({filteredAndSortedSupplements.length})
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => handleViewChange('grid')}
              className={`p-2 rounded transition-colors ${
                view === 'grid'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              style={view === 'grid' ? { color: '#44B080' } : { color: '#666' }}
              title="Grid view"
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
            Add Supplement
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <FilterSortBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          filterValue={filterWhenToTake}
          onFilterChange={setFilterWhenToTake}
          filterOptions={filterOptions}
          filterLabel="When to Take"
        />
      </div>

      <SupplementsSlider view={view} supplements={filteredAndSortedSupplements} />
      <AddSupplementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}


