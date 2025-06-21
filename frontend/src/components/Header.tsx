import { BookOpenIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header({ title = 'Sage' }: { title?: string }) {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-700 ml-2">{title}</span>
        </div>
        <nav className="flex space-x-6 ml-auto">
          <Link to="/teacher-dashboard" className="text-gray-700 hover:text-blue-700">Teacher Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
