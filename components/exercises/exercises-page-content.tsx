'use client';

import { useState, useEffect, useMemo } from 'react';
import { ExercisesSlider } from '@/components/exercises/exercises-slider';
import { AddExerciseModal } from '@/components/exercises/add-exercise-modal';
import { Dumbbell, Plus, LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';
import { FilterSortBar, SortOption, FilterOption } from '@/components/shared/filter-sort-bar';
import { Exercise } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewType = 'grid' | 'table';

export function ExercisesPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState('');

  const { data } = useSWR<{ exercises: Exercise[] }>('/api/exercises', fetcher);
  const allExercises = data?.exercises || [];

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('exercises-view') as ViewType;
    if (savedView === 'grid' || savedView === 'table') {
      setView(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem('exercises-view', newView);
  };

  // Clear and revalidate cache when component mounts
  useEffect(() => {
    mutate('/api/exercises');
  }, []);

  // Filter and sort exercises
  const filteredAndSortedExercises = useMemo(() => {
    let filtered = [...allExercises];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query) ||
          exercise.description?.toLowerCase().includes(query)
      );
    }

    // Filter by muscle group
    if (filterMuscleGroup) {
      filtered = filtered.filter((exercise) => exercise.muscleGroup === filterMuscleGroup);
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
        case 'muscle':
          aValue = a.muscleGroup;
          bValue = b.muscleGroup;
          break;
        case 'sets':
          aValue = a.sets;
          bValue = b.sets;
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
  }, [allExercises, searchQuery, sortBy, filterMuscleGroup]);

  const sortOptions: SortOption[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'muscle-asc', label: 'Muscle Group (A-Z)' },
    { value: 'sets-asc', label: 'Sets (Low to High)' },
    { value: 'sets-desc', label: 'Sets (High to Low)' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
  ];

  const filterOptions: FilterOption[] = [
    { value: 'back', label: 'Back' },
    { value: 'chest', label: 'Chest' },
    { value: 'arms', label: 'Arms' },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6" style={{ color: '#44B080' }} />
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
            Exercises ({filteredAndSortedExercises.length})
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
            Add Exercise
          </Button>
        </div>
      </div>

      <FilterSortBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        filterValue={filterMuscleGroup}
        onFilterChange={setFilterMuscleGroup}
        filterOptions={filterOptions}
        filterLabel="Muscle Group"
      />

      <ExercisesSlider view={view} exercises={filteredAndSortedExercises} />
      <AddExerciseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

