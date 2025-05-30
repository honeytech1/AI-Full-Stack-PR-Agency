import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Target, 
  Brain,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';

const StressTester = () => {
  const navigate = useNavigate();
  const { user, logout, BACKEND_URL } = useAuth();
  const [formData, setFormData] = useState({
    brief_content: '',
    company_name: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/agents/stress-test`, formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to perform stress test');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (level) => {
    switch (level) {
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      case 'Medium': return <HelpCircle className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/agents')}
                className="mr-4 p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 hover:text-secondary-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-secondary-900">Message Stress Test Agent</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-secondary-600">{user?.full_name}</div>
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
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Form Section */}
        <div className="card mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 rounded-lg p-3 mr-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Stress Test Your Messages
              </h2>
              <p className="text-secondary-600">
                Test your PR messages against challenging journalist questions and scenarios
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-secondary-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                required
                className="input-field"
                placeholder="Enter your company name"
                value={formData.company_name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-secondary-700 mb-2">
                Industry *
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                required
                className="input-field"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={formData.industry}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="brief_content" className="block text-sm font-medium text-secondary-700 mb-2">
                PR Brief or Key Messages *
              </label>
              <textarea
                id="brief_content"
                name="brief_content"
                required
                rows={8}
                className="textarea-field"
                placeholder="Paste your PR brief, key messages, or announcement content that you want to stress test..."
                value={formData.brief_content}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-secondary-500">
                Include your main talking points, product announcements, or any content you plan to discuss with media.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Running Stress Test...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-5 w-5" />
                  Run Stress Test
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Test Overview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Stress Test Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Test ID</p>
                      <p className="text-xs text-orange-600 font-mono">{results.test_id.slice(0, 8)}...</p>
                    </div>
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Industry</p>
                      <p className="text-xs text-blue-600">{results.industry}</p>
                    </div>
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Difficulty</p>
                      <p className="text-xs text-yellow-600">{results.overall_difficulty}</p>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions & Challenges */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Journalist Questions & Challenges
              </h3>
              <div className="prose max-w-none">
                <div className="bg-secondary-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-secondary-700 leading-relaxed">
                    {results.questions}
                  </pre>
                </div>
              </div>
            </div>

            {/* Preparation Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                AI Preparation Tips
              </h3>
              <div className="space-y-3">
                {results.preparation_tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        Tip {index + 1}
                      </h4>
                      <p className="text-sm text-blue-700">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Simulation */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Practice Scenarios
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      Recommended Practice Session
                    </h4>
                    <p className="text-sm text-yellow-800 mb-4">
                      Based on the stress test results, we recommend practicing these scenarios with your team:
                    </p>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li>• Mock journalist interview with the generated questions</li>
                      <li>• Crisis response simulation for negative scenarios</li>
                      <li>• Competitive positioning practice</li>
                      <li>• Financial sustainability Q&A session</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Recommended Next Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/agents/brief')}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
                >
                  <FileText className="h-5 w-5 text-green-600 mb-2" />
                  <h4 className="font-medium text-green-900 mb-1">Refine Your Brief</h4>
                  <p className="text-sm text-green-700">Update your PR brief based on stress test insights</p>
                </button>
                
                <button
                  onClick={() => navigate('/agents/content')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
                >
                  <MessageCircle className="h-5 w-5 text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900 mb-1">Create Supporting Content</h4>
                  <p className="text-sm text-purple-700">Generate social media content to support your messages</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StressTester;
