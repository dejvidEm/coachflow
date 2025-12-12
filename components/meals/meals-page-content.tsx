'use client';

import { useState, useEffect, useMemo } from 'react';
import { MealsSlider } from '@/components/meals/meals-slider';
import { AddMealModal } from '@/components/meals/add-meal-modal';
import { UtensilsCrossed, Plus, LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mutate } from 'swr';
import { FilterSortBar, SortOption, FilterOption } from '@/components/shared/filter-sort-bar';
import { Meal } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewType = 'grid' | 'table';

export function MealsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const { data } = useSWR<{ meals: Meal[] }>('/api/meals', fetcher);
  const allMeals = data?.meals || [];

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('meals-view') as ViewType;
    if (savedView === 'grid' || savedView === 'table') {
      setView(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem('meals-view', newView);
  };

  // Clear and revalidate cache when component mounts
  useEffect(() => {
    mutate('/api/meals');
  }, []);

  // Filter and sort meals
  const filteredAndSortedMeals = useMemo(() => {
    let filtered = [...allMeals];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (meal) =>
          meal.name.toLowerCase().includes(query) ||
          meal.note?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter((meal) => meal.category === filterCategory);
    }

    // Filter by dietary tag
    if (filterTag) {
      filtered = filtered.filter((meal) => {
        switch (filterTag) {
          case 'vegan':
            return meal.vegan;
          case 'glutenfree':
            return meal.glutenfree;
          case 'lactofree':
            return meal.lactofree;
          case 'nutfree':
            return meal.nutfree;
          default:
            return true;
        }
      });
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
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'calories':
          aValue = a.calories;
          bValue = b.calories;
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
  }, [allMeals, searchQuery, sortBy, filterCategory, filterTag]);

  const sortOptions: SortOption[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'category-asc', label: 'Category (A-Z)' },
    { value: 'calories-asc', label: 'Calories (Low to High)' },
    { value: 'calories-desc', label: 'Calories (High to Low)' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
  ];

  const filterOptions: FilterOption[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ];

  return (
    <section className="flex-1 p-4 lg:p-8" data-onboarding="meals-section">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6" style={{ color: '#44B080' }} />
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
            Meals ({filteredAndSortedMeals.length})
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
            Add Meal
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
          filterValue={filterCategory}
          onFilterChange={setFilterCategory}
          filterOptions={filterOptions}
          filterLabel="Category"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Dietary Tags:</span>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#44B080] focus:border-transparent"
          >
            <option value="">All Tags</option>
            <option value="vegan">Vegan</option>
            <option value="glutenfree">Gluten Free</option>
            <option value="lactofree">Lactose Free</option>
            <option value="nutfree">Nut Free</option>
          </select>
        </div>
      </div>

      <MealsSlider view={view} meals={filteredAndSortedMeals} />
      <AddMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

