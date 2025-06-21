import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import {
  BookOpenIcon,
  UsersIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  BrainIcon,
  ClockIcon,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export function TeacherDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const COLORS = ['#10B981', '#6366F1', '#EF4444'];

  useEffect(() => {
    fetch('/api/teacher-dashboard')
      .then(res => res.json())
      .then(data => setDashboard(data));
  }, []);

  if (!dashboard) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Teacher Dashboard</h1>
        <p className="text-gray-600 mb-8">Class 7A Overview and Analytics</p>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{dashboard.total_students}</div>
                <div className="text-gray-600 mt-1">Total Students</div>
              </div>
              <UsersIcon className="w-8 h-8 text-blue-500 opacity-75" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{dashboard.average_score}%</div>
                <div className="text-gray-600 mt-1">Average Score</div>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-green-500 opacity-75" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">{dashboard.active_subjects}</div>
                <div className="text-gray-600 mt-1">Active Subjects</div>
              </div>
              <BookOpenIcon className="w-8 h-8 text-purple-500 opacity-75" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{dashboard.need_attention}</div>
                <div className="text-gray-600 mt-1">Need Attention</div>
              </div>
              <AlertCircleIcon className="w-8 h-8 text-red-500 opacity-75" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Subject Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Subject Performance
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.subject_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Assignment Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Assignment Status
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboard.assignment_status}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboard.assignment_status.map((_entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {dashboard.assignment_status.map((status: any, index: number) => (
                <div key={status.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {status.name} ({status.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Progress */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Weekly Progress
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboard.weekly_progress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#6366F1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {dashboard.recent_activity.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BrainIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.student}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {activity.time}
                      </span>
                      {activity.score !== '-' && (
                        <span
                          className={`text-xs font-medium ${activity.score === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}
                        >
                          {activity.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
