'use client';

import { Search, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface SearchBarProps {
  data: any[];
  onSearch: (filteredData: any[]) => void;
  setIsSearch: (isSearching: boolean) => void;
  placeholder?: string;
  searchKeys?: string[];
}

const deepSearch = (obj: any, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase().trim();

  // Base cases
  if (!obj) return false;
  if (typeof obj === 'string') return obj.toLowerCase().includes(term);
  if (typeof obj === 'number')
    return obj.toString().toLowerCase().includes(term);
  if (typeof obj === 'boolean')
    return obj.toString().toLowerCase().includes(term);

  // Recursive case for objects and arrays
  if (typeof obj === 'object') {
    return Object.values(obj).some((value) => deepSearch(value, term));
  }

  return false;
};

export default function SearchBar({
  data,
  onSearch,
  setIsSearch,
  placeholder,
  searchKeys,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setIsSearch(false);
      onSearch(data);
      return;
    }

    const filteredData = data.filter((item: any) => {
      // If searchKeys are provided, only search in specified keys
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const fieldValue = item[key];
          // Pass the search term, not the field value as the search term
          return fieldValue && deepSearch(fieldValue, value);
        });
      }
      // Otherwise, search in all fields
      return deepSearch(item, value);
    });

    setIsSearch(true);
    onSearch(filteredData);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearch(false);
    onSearch(data);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md">
      <div
        className={`
          relative flex items-center 
          bg-white 
          border 
          rounded-lg 
          transition-all 
          duration-300 
          ease-in-out
        `}
      >
        <div className="absolute left-3 pointer-events-none">
          <Search
            className={`
              w-5 h-5 
              ${isFocused ? 'text-brandColor' : 'text-gray-400'}
              transition-colors 
              duration-300
            `}
          />
        </div>

        <input
          ref={inputRef}
          id="search"
          name="search"
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-primary focus:border-primary focus:shadow-outline
          "
        />

        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="
              absolute 
              right-3 
              text-gray-400 
              hover:text-gray-600 
              focus:outline-none
              transition-colors
              duration-300
            "
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
