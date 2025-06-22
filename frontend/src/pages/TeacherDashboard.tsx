import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import {
  UsersIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  BrainIcon,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
      .then(data => { setDashboard(data); console.log(data); });
  }, []);
  if (!dashboard) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>
      </div>
    );
  }
  // Use only real data from the API, no mock data
  const topicDifficulty = dashboard.topic_difficulty;
  const engagementHeatmap = dashboard.engagement_heatmap;
  const activityTimeline = dashboard.activity_timeline;
  const studentRadar = dashboard.student_radar;
  const studentProfiles = dashboard.student_profiles;

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
              <BrainIcon className="w-8 h-8 text-purple-500 opacity-75" />
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
        {/* Topic Difficulty Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Topic Difficulty</h2>
          <div className="h-80">
            {topicDifficulty && topicDifficulty.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topicDifficulty}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="topic" type="category" />
                  <Tooltip />
                  <Bar dataKey="correctness" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center pt-20">No topic difficulty data available.</div>
            )}
          </div>
        </div>
        {/* Engagement Heatmap */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Engagement Heatmap</h2>
          <div className="h-80">
            {engagementHeatmap && engagementHeatmap.length > 0 ? (
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
            ) : (
              <div className="text-gray-400 text-center pt-20">No engagement data available.</div>
            )}
          </div>
        </div>
        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
          <div className="h-64">
            {activityTimeline && activityTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interactions" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center pt-20">No activity timeline data available.</div>
            )}
          </div>
        </div>
        {/* Per-Student Progress Radar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Per-Student Progress (Radar)</h2>
          <div className="h-96">
            {studentRadar && studentRadar.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={studentRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Student" dataKey="Student" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
                  <Radar name="ClassAvg" dataKey="ClassAvg" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center pt-20">No radar data available.</div>
            )}
          </div>
        </div>
        {/* Student Profile Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Student Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentProfiles && studentProfiles.length > 0 ? (
              studentProfiles.map((profile: any, idx: number) => (
                <div key={idx} className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${profile.atRisk ? 'border-red-400' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold text-blue-700">{profile.name}</div>
                    {profile.atRisk && (
                      <AlertCircleIcon className="w-5 h-5 text-red-500">
                        <title>At Risk</title>
                      </AlertCircleIcon>
                    )}
                  </div>
                  <div className="text-gray-600 mb-2">Mastery: <span className="font-bold text-green-600">{profile.mastery}%</span></div>
                  <div className="text-gray-500 text-sm mb-2">Recent: {profile.recent}</div>
                  {profile.atRisk && <div className="text-xs text-red-600 font-semibold">Needs Attention</div>}
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center pt-20 w-full">No student profiles available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
