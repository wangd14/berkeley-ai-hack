import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Sage</h1>
        <p className="text-gray-700 text-lg mb-6 text-center">
          Sage is your AI-powered learning hub for students and teachers. Access interactive lessons, track progress, and get instant help from our AI tutor. Empower your learning journey today!
        </p>
        <div className="flex space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Login</Link>
          <Link to="/signup" className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition-colors">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
