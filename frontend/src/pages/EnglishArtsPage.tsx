import { useState } from 'react';
import { Header } from '../components/Header';
import coursesData from '../../data/courses.json';
import {
  PlayIcon,
  BrainIcon,
  BarChartIcon,
  FunctionSquareIcon,
  GitBranchIcon,
  CircleEqualIcon,
} from 'lucide-react';

const iconMap: any = {
  FunctionSquareIcon,
  GitBranchIcon,
  CircleEqualIcon,
  BarChartIcon,
};

function getCourseSections(courseName: string) {
  const course = coursesData.courses
    ? coursesData.courses.find((c: any) => c.name === courseName)
    : null;
  if (!course || !course.subcourses) return [];
  return course.subcourses.map((section: any, idx: number) => ({
    id: idx,
    title: section.title || section.name,
    topics: section.topics || [],
    duration: section.duration || '',
    completed: section.completed || false,
    locked: section.locked || false,
    description: section.description || '',
    icon: iconMap[section.icon] || FunctionSquareIcon,
  }));
}

export function EnglishArtsPage() {
  const courseSections = getCourseSections('English Language Arts');
  const [selectedSection, setSelectedSection] = useState(0);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const currentSection = courseSections[selectedSection] || {};
  if (isLearningMode) {
    // Placeholder for learning mode
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center">
        <button onClick={() => setIsLearningMode(false)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Back</button>
        <div className="bg-white p-8 rounded shadow max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-2">{currentSection.title}</h2>
          <p className="mb-4">{currentSection.description}</p>
          <div className="space-y-2">
            {currentSection.topics && currentSection.topics.map((topic: string, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <BrainIcon className="w-5 h-5 text-blue-500" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">English Language Arts Course</h1>
          <p className="text-gray-600 mt-1">Master reading, writing, and literature analysis</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Sections Navigation */}
          <div className="space-y-4">
            {courseSections.map((section: any, idx: number) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(idx)}
                className={`w-full text-left p-4 rounded-xl transition-all ${selectedSection === idx ? 'bg-white shadow-lg border-2 border-blue-200' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'} cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${selectedSection === idx ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {section.duration}
                      </p>
                    </div>
                  </div>
                  {/* Removed completed and locked icons */}
                </div>
              </button>
            ))}
          </div>
          {/* Selected Section Content */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentSection.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {currentSection.description}
                </p>
              </div>
              {!currentSection.locked && (
                <button
                  onClick={() => setIsLearningMode(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
              )}
            </div>
            {/* Topics List */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Topics Covered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSection.topics && currentSection.topics.map((topic: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <BrainIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Learning Resources */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-900">
                    Interactive Examples
                  </h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Practice with step-by-step guidance
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium text-purple-900">
                    Video Tutorials
                  </h4>
                  <p className="text-purple-700 text-sm mt-1">
                    Visual explanations of concepts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
