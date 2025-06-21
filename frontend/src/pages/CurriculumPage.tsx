import React, { useState } from 'react';
import { BookOpenIcon, BrainIcon, MessageCircleIcon, StarIcon, PlayIcon, CheckCircleIcon } from 'lucide-react';
export function CurriculumPage() {
  const [activeChat, setActiveChat] = useState(false);
  const subjects = [{
    name: 'Mathematics',
    description: 'Algebra, Geometry, and Problem Solving',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    lessons: 45,
    aiTip: "I'll help you master equations step by step!"
  }, {
    name: 'Science',
    description: 'Biology, Chemistry, and Physics Fundamentals',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
    lessons: 38,
    aiTip: "Let's explore the wonders of science together!"
  }, {
    name: 'English Language Arts',
    description: 'Reading, Writing, and Literature Analysis',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    lessons: 52,
    aiTip: "I'll help you become a confident writer and reader!"
  }, {
    name: 'Social Studies',
    description: 'World History and Geography',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    lessons: 35,
    aiTip: 'Discover fascinating stories from around the world!'
  }, {
    name: 'Art & Creativity',
    description: 'Visual Arts and Creative Expression',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    lessons: 28,
    aiTip: 'Let your creativity shine with guided projects!'
  }, {
    name: 'Technology',
    description: 'Digital Literacy and Coding Basics',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    lessons: 25,
    aiTip: 'Code your way to the future with fun projects!'
  }];
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  7th Grade Curriculum
                </h1>
                <p className="text-gray-600 mt-1">
                  Your journey to academic excellence starts here!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-4 py-2 rounded-full flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-semibold">Level 7</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* AI Tutor Introduction */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <BrainIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Meet Your AI Tutor!</h2>
                <p className="text-blue-100 mt-1">
                  I'm here to help you succeed in every subject. Ask me
                  anything!
                </p>
              </div>
            </div>
            <button onClick={() => setActiveChat(!activeChat)} className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <MessageCircleIcon className="w-5 h-5" />
              <span>Chat Now</span>
            </button>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">6</div>
            <div className="text-gray-600 mt-1">Core Subjects</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">223</div>
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
          {subjects.map((subject, index) => <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <img src={subject.image} alt={subject.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-700">
                    {subject.lessons} lessons
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
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2">
                    <PlayIcon className="w-4 h-4" />
                    <span>Start Learning</span>
                  </button>
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Ready</span>
                  </div>
                </div>
              </div>
            </div>)}
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