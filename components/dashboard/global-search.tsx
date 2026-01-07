'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, UtensilsCrossed, Dumbbell, Pill, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Client, Meal, Exercise, Supplement } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type SearchCategory = 'all' | 'meals' | 'exercises' | 'supplements' | 'clients';

interface SearchResult {
  type: 'meal' | 'exercise' | 'supplement' | 'client';
  id: number;
  name: string;
  href: string;
}

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch data for all categories
  const { data: mealsData } = useSWR<{ meals: Meal[] }>('/api/meals', fetcher);
  const { data: exercisesData } = useSWR<{ exercises: Exercise[] }>('/api/exercises', fetcher);
  const { data: supplementsData } = useSWR<{ supplements: Supplement[] }>('/api/supplements', fetcher);
  const { data: clientsData } = useSWR<{ clients: Client[] }>('/api/clients', fetcher);

  // Perform search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    const meals = mealsData?.meals || [];
    const exercises = exercisesData?.exercises || [];
    const supplements = supplementsData?.supplements || [];
    const clients = clientsData?.clients || [];

    // Search meals
    if (selectedCategory === 'all' || selectedCategory === 'meals') {
      meals
        .filter((meal) => meal.name.toLowerCase().includes(query))
        .forEach((meal) => {
          searchResults.push({
            type: 'meal',
            id: meal.id,
            name: meal.name,
            href: '/dashboard/meals',
          });
        });
    }

    // Search exercises
    if (selectedCategory === 'all' || selectedCategory === 'exercises') {
      exercises
        .filter((exercise) => exercise.name.toLowerCase().includes(query))
        .forEach((exercise) => {
          searchResults.push({
            type: 'exercise',
            id: exercise.id,
            name: exercise.name,
            href: '/dashboard/exercises',
          });
        });
    }

    // Search supplements
    if (selectedCategory === 'all' || selectedCategory === 'supplements') {
      supplements
        .filter((supplement) => supplement.name.toLowerCase().includes(query))
        .forEach((supplement) => {
          searchResults.push({
            type: 'supplement',
            id: supplement.id,
            name: supplement.name,
            href: '/dashboard/supplements',
          });
        });
    }

    // Search clients
    if (selectedCategory === 'all' || selectedCategory === 'clients') {
      clients
        .filter(
          (client) =>
            client.name.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query)
        )
        .forEach((client) => {
          searchResults.push({
            type: 'client',
            id: client.id,
            name: client.name,
            href: `/dashboard/clients/${client.id}`,
          });
        });
    }

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, selectedCategory, mealsData, exercisesData, supplementsData, clientsData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (href: string) => {
    router.push(href);
    setSearchQuery('');
    setIsOpen(false);
  };

  const getCategoryIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'meal':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'exercise':
        return <Dumbbell className="w-4 h-4" />;
      case 'supplement':
        return <Pill className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: SearchCategory) => {
    switch (category) {
      case 'all':
        return 'All';
      case 'meals':
        return 'Meals';
      case 'exercises':
        return 'Exercises';
      case 'supplements':
        return 'Supplements';
      case 'clients':
        return 'Clients';
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Vyhľadať..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchQuery && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result.href)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-shrink-0 text-gray-400">
                {getCategoryIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {result.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {result.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 text-center text-sm text-gray-500">
          No results found in {getCategoryLabel(selectedCategory).toLowerCase()}
        </div>
      )}
    </div>
  );
}



