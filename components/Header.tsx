'use client';

import { Search, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  businessName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFavouritesClick: () => void;
}

export function Header({ 
  businessName, 
  searchQuery, 
  onSearchChange,
  onFavouritesClick 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {businessName}
          </h1>
          <button
            onClick={onFavouritesClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="View favourites"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
}

