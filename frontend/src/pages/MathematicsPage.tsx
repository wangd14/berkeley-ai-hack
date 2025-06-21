import React from 'react';

export function MathematicsPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              {/* You can use the BookOpenIcon here if you import it */}
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Mathematics</span>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Mathematics Courses</h2>
        <ul className="space-y-4">
          <li className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-lg font-semibold text-blue-700">Algebra Basics</div>
            <div className="text-gray-600">Learn the foundations of algebra, equations, and variables.</div>
          </li>
          <li className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-lg font-semibold text-blue-700">Geometry Essentials</div>
            <div className="text-gray-600">Explore shapes, angles, and geometric reasoning.</div>
          </li>
          <li className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-lg font-semibold text-blue-700">Problem Solving</div>
            <div className="text-gray-600">Sharpen your skills with fun math challenges and puzzles.</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
