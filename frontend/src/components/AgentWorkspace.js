import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  BarChart3, 
  FileText, 
  Target, 
  Sparkles,
  Brain,
  LogOut,
  Zap
} from 'lucide-react';

const AgentWorkspace = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const agents = [
    {
      title: 'Reputation Scanner Agent',
      description: 'Analyze media sentiment, track brand mentions, and monitor your reputation across digital platforms with AI-powered insights.',
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      route: '/agents/reputation',
      capabilities: ['Sentiment Analysis', 'Brand Monitoring', 'Competitive Intelligence', 'Crisis Detection']
    },
    {
      title: 'Brief Generator Agent',
      description: 'Create compelling PR briefs, story angles, and media strategies tailored to your audience and campaign goals.',
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      route: '/agents/brief',
      capabilities: ['PR Strategy', 'Story Angles', 'Media Targeting', 'Campaign Planning']
    },
    {
      title: 'Message Stress Test Agent',
      description: 'Test your key messages against tough journalist questions and prepare for challenging interview scenarios.',
      icon: Target,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      route: '/agents/stress-test',
      capabilities: ['Message Testing', 'Q&A Preparation', 'Crisis Simulation', 'Media Training']
    },
    {
      title: 'Content Repurpose Agent',
      description: 'Transform your PR content into engaging social media posts, reels, carousels, and platform-specific formats.',
      icon: Sparkles,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      route: '/agents/content',
      capabilities: ['Content Adaptation', 'Social Media Optimization', 'Multi-format Creation', 'Brand Voice Consistency']
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 hover:text-secondary-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-secondary-900">AI Agent Workspace</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-secondary-600">
                {user?.full_name}
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
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 mb-8 text-white">
            <div className="text-center">
              <Zap className="mx-auto h-16 w-16 text-white mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Choose Your AI Agent
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                Select from our specialized AI agents to automate different aspects of your PR workflow. 
                Each agent is powered by Google Gemini and designed for specific PR tasks.
              </p>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="card cursor-pointer hover:shadow-xl transition-all duration-300 result-card"
                onClick={() => navigate(agent.route)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`${agent.bgColor} rounded-xl p-4`}>
                    <agent.icon className={`h-8 w-8 ${agent.textColor}`} />
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    Ready
                  </span>
                </div>

                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {agent.title}
                </h3>
                
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {agent.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-secondary-900 uppercase tracking-wide">
                    Key Capabilities
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {agent.capabilities.map((capability, capIndex) => (
                      <div
                        key={capIndex}
                        className="bg-secondary-50 rounded-lg px-3 py-2 text-xs font-medium text-secondary-700"
                      >
                        {capability}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    Launch Agent
                    <Zap className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 card text-center">
            <div className="py-8">
              <Brain className="mx-auto h-12 w-12 text-secondary-400 mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                More Agents Coming Soon
              </h3>
              <p className="text-secondary-600 mb-6">
                We're developing additional specialized agents for crisis management, 
                interview coaching, attribution analysis, and more.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                  Crisis Detector
                </span>
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                  Interview Coach
                </span>
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                  Attribution Engine
                </span>
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                  Smart FAQ
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentWorkspace;
