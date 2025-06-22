import { useState } from 'react';
import { BrainIcon, MessageCircleIcon, PlayIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import coursesData from '../../data/courses.json'
import { Header } from '../components/Header';

export function CurriculumPage() {
  const [activeChat, setActiveChat] = useState(false);
  const subjects = coursesData.courses;
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <Header />
      {/* AI Tutor Introduction */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white mb-8 text-3xl">
          Welcome to your Learning Hub
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">{coursesData.courses.length}</div>
            <div className="text-gray-600 mt-1">Core Subjects</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">{
              coursesData.courses.reduce((total: number, course: any) => {
                if (Array.isArray(course.subcourses)) {
                  return total + course.subcourses.length;
                }
                return total;
              }, 0)
            }</div>
            <div className="text-gray-600 mt-1">Total Lessons</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-purple-600">24/7</div>
            <div className="text-gray-600 mt-1">AI Support</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-orange-600">Fun</div>
            <div className="text-gray-600 mt-1">Learning Style</div>
          </div>
        </div>
        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <img src={subject.image} alt={subject.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-700">
                    {Array.isArray(subject.subcourses) ? subject.subcourses.length : 0} lessons
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {subject.name}
                </h3>
                <p className="text-gray-600 mb-4">{subject.description}</p>
                {/* AI Tutor Tip */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r-lg">
                  <div className="flex items-start space-x-2">
                    <BrainIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800 text-sm italic">
                      {subject.aiTip}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {subject.name === 'Mathematics' ? (
                    <Link to="/mathematics" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Learning</span>
                    </Link>
                  ) : subject.name === 'Science' ? (
                    <Link to="/science" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Learning</span>
                    </Link>
                  ) : subject.name === 'English Language Arts' ? (
                    <Link to="/english-arts" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Learning</span>
                    </Link>
                  ) : subject.name === 'Technology' ? (
                    <Link to="/technology" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Learning</span>
                    </Link>
                  ) : (
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Learning</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* AI Chat Popup */}
        {activeChat && <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrainIcon className="w-6 h-6" />
                  <span className="font-semibold">AI Tutor</span>
                </div>
                <button onClick={() => setActiveChat(false)} className="text-white hover:text-gray-200">
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-gray-100 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700">
                  Hi! I'm your AI tutor. What subject would you like help with
                  today?
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input type="text" placeholder="Ask me anything..." className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <MessageCircleIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}