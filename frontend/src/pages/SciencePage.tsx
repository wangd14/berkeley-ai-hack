import { Header } from '../components/Header';
import coursesData from '../../data/courses.json';

export function SciencePage() {
  // Find the Science courses
  const scienceCourse = coursesData.courses
    ? coursesData.courses.find((course: any) => course.name === 'Science')
    : null;
  const subCourses = scienceCourse && scienceCourse.subcourses ? scienceCourse.subcourses : [];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Science Courses</h2>
        <ul className="space-y-4">
          {subCourses.map((course: any, index: number) => (
            <li key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-lg font-semibold text-blue-700">{course.name}</div>
              <div className="text-gray-600">{course.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
