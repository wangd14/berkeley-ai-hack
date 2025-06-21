import React from 'react';
import { BookOpenIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header({ title = 'Sage' }: { title?: string }) {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight hover:underline focus:outline-none">
            {title}
          </Link>
        </div>
      </div>
    </header>
  );
}
