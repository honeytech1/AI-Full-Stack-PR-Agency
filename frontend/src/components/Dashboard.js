import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Zap,
  ChevronRight,
  Activity,
  Brain,
  Target,
  Sparkles,
  LogOut
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout, BACKEND_URL } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/overview`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const agentCards = [
    {
      title: 'Reputation Scanner',
      description: 'Analyze media sentiment and brand reputation across platforms',
      icon: BarChart3,
      color: 'bg-blue-500',
      route: '/agents/reputation',
      stats: dashboardData?.stats?.total_analyses || 0
    },
    {
      title: 'Brief Generator',
      description: 'Create compelling PR briefs and story angles with AI',
      icon: FileText,
      color: 'bg-green-500',
      route: '/agents/brief',
      stats: dashboardData?.stats?.total_briefs || 0
    },
    {
      title: 'Message Stress Test',
      description: 'Test your messages with simulated journalist interviews',
      icon: Target,
      color: 'bg-orange-500',
      route: '/agents/stress-test',
      stats: dashboardData?.stats?.total_stress_tests || 0
    },
    {
      title: 'Content Repurposer',
      description: 'Transform PR content into social media formats',
      icon: Sparkles,
      color: 'bg-purple-500',
      route: '/agents/content',
      stats: dashboardData?.stats?.total_content_pieces || 0
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-secondary-900">AI PR Agency</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-secondary-600">
                Welcome, {user?.full_name}
                {user?.company && <span className="ml-1">from {user.company}</span>}
              </div>
              <button
                onClick={logout}
                className="text-secondary-400 hover:text-secondary-600 p-2 rounded-lg hover:bg-secondary-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Your AI PR Command Center
                </h2>
                <p className="text-primary-100 text-lg">
                  Automate your PR workflows with intelligent agents powered by Google Gemini
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 rounded-lg p-4">
                  <Activity className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Reputation Scans</p>
                  <p className="text-2xl font-semibold text-secondary-900">
                    {dashboardData?.stats?.total_analyses || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">PR Briefs</p>
                  <p className="text-2xl font-semibold text-secondary-900">
                    {dashboardData?.stats?.total_briefs || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-lg p-3">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Stress Tests</p>
                  <p className="text-2xl font-semibold text-secondary-900">
                    {dashboardData?.stats?.total_stress_tests || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Content Pieces</p>
                  <p className="text-2xl font-semibold text-secondary-900">
                    {dashboardData?.stats?.total_content_pieces || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {agentCards.map((agent, index) => (
              <div
                key={index}
                className="card cursor-pointer hover:shadow-lg transition-all duration-200 result-card"
                onClick={() => navigate(agent.route)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`${agent.color} rounded-lg p-3`}>
                      <agent.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                        {agent.title}
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-secondary-400" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-secondary-500">
                    {agent.stats} completed
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
              <button
                onClick={() => navigate('/agents')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all agents
              </button>
            </div>
            
            {dashboardData?.recent_activities?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="bg-primary-100 rounded-full p-2">
                      <Zap className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">
                        {activity.type}
                      </p>
                      <p className="text-xs text-secondary-600">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs text-secondary-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No recent activity</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  Start using AI agents to see your activity here.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/agents')}
                    className="btn-primary"
                  >
                    Explore AI Agents
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
