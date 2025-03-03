'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Clock, ArrowRight, Check } from 'lucide-react';
import {
  filterByLast7Days,
  filterByThisMonth,
  filterByThisYear,
  filterByToday,
  filterByYesterday,
} from '@/lib/dateFilters';

// Define types for improved type safety
interface DateFilterOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface DateFiltersProps {
  data: any[];
  onFilter: (filteredData: any[]) => void;
  setIsSearch: (isSearching: boolean) => void;
}

export default function DateFilters({
  data,
  onFilter,
  setIsSearch,
}: DateFiltersProps) {
  // Define options with icons
  const options: DateFilterOption[] = [
    {
      value: 'life',
      label: 'Life Time',
      icon: Calendar,
    },
    {
      value: 'today',
      label: 'Today',
      icon: Clock,
    },
    {
      value: 'last-7-days',
      label: 'Last 7 Days',
      icon: ArrowRight,
    },
    {
      value: 'month',
      label: 'This Month',
      icon: Calendar,
    },
    {
      value: 'year',
      label: 'This Year',
      icon: Calendar,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (option: DateFilterOption) => {
    setSelectedFilter(option);
    setIsOpen(false);
    setIsSearch(false);

    // Filter logic
    let filteredData = data;
    switch (option.value) {
      case 'today':
        filteredData = filterByToday(data);
        break;
      case 'yesterday':
        filteredData = filterByYesterday(data);
        break;
      case 'last-7-days':
        filteredData = filterByLast7Days(data);
        break;
      case 'month':
        filteredData = filterByThisMonth(data);
        break;
      case 'year':
        filteredData = filterByThisYear(data);
        break;
    }

    onFilter(filteredData);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-lg">
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between 
          w-full 
          px-4 py-2.5 
          bg-white 
          border 
          ${
            isOpen
              ? 'border-brandColor ring-2 ring-brandColor/10'
              : 'border-gray-300 hover:border-gray-400'
          }
          rounded-lg 
          transition-all 
          duration-300 
          ease-in-out
        `}
      >
        <div className="flex items-center gap-2">
          <selectedFilter.icon
            className={`
              w-5 h-5 
              ${isOpen ? 'text-brandColor' : 'text-gray-500'}
              transition-colors 
              duration-300
            `}
          />
          <span className="text-sm text-gray-800">{selectedFilter.label}</span>
        </div>
        <ChevronDown
          className={`
            w-4 h-4 ml-4 
            text-gray-400 
            transform 
            transition-transform 
            duration-300 
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute 
            z-10 
            mt-2 
            w-full 
            bg-white 
            border 
            border-gray-200 
            rounded-lg 
            shadow-lg 
            overflow-hidden
            animate-dropdown-open
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFilterChange(option)}
              className={`
                flex 
                items-center 
                justify-between 
                w-full 
                px-4 
                py-2.5 
                text-sm 
                text-left 
                hover:bg-gray-100 
                transition-colors 
                duration-300
                ${
                  selectedFilter.value === option.value
                    ? 'bg-indigo-50 text-brandColor'
                    : 'text-gray-800'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <option.icon
                  className={`
                    w-5 h-5 
                    ${
                      selectedFilter.value === option.value
                        ? 'text-brandColor'
                        : 'text-gray-500'
                    }
                    transition-colors 
                    duration-300
                  `}
                />
                {option.label}
              </div>
              {selectedFilter.value === option.value && (
                <Check
                  className="
                    w-4 h-4 
                    text-brandColor
                    animate-scale-in
                  "
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
