import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  BarChart3, 
  Brain,
  LogOut,
  Plus,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

const ReputationScanner = () => {
  const navigate = useNavigate();
  const { user, logout, BACKEND_URL } = useAuth();
  const [formData, setFormData] = useState({
    company_name: '',
    urls: [''],
    keywords: ['']
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

  const addURL = () => {
    setFormData({
      ...formData,
      urls: [...formData.urls, '']
    });
  };

  const removeURL = (index) => {
    const newURLs = formData.urls.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      urls: newURLs.length > 0 ? newURLs : ['']
    });
  };

  const updateURL = (index, value) => {
    const newURLs = [...formData.urls];
    newURLs[index] = value;
    setFormData({
      ...formData,
      urls: newURLs
    });
  };

  const addKeyword = () => {
    setFormData({
      ...formData,
      keywords: [...formData.keywords, '']
    });
  };

  const removeKeyword = (index) => {
    const newKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      keywords: newKeywords.length > 0 ? newKeywords : ['']
    });
  };

  const updateKeyword = (index, value) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({
      ...formData,
      keywords: newKeywords
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanData = {
        company_name: formData.company_name,
        urls: formData.urls.filter(url => url.trim() !== ''),
        keywords: formData.keywords.filter(keyword => keyword.trim() !== '')
      };

      const response = await axios.post(`${BACKEND_URL}/api/agents/reputation-scan`, cleanData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze reputation');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (score) => {
    if (score >= 7) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (score >= 5) return <Minus className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  const getSentimentColor = (score) => {
    if (score >= 7) return 'text-green-600 bg-green-50';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-secondary-900">Reputation Scanner Agent</h1>
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
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Analyze Media Reputation
              </h2>
              <p className="text-secondary-600">
                Scan media mentions and analyze sentiment across digital platforms
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
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Media URLs to Analyze *
              </label>
              {formData.urls.map((url, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="url"
                    className="input-field flex-1"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(e) => updateURL(index, e.target.value)}
                  />
                  {formData.urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeURL(index)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addURL}
                className="mt-2 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add URL
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Keywords to Focus On (Optional)
              </label>
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Enter keyword or phrase"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                  />
                  {formData.keywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addKeyword}
                className="mt-2 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Keyword
              </button>
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
                  Analyzing Reputation...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analyze Reputation
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Sentiment Overview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Sentiment Analysis Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${getSentimentColor(results.sentiment_score)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Overall Score</p>
                      <p className="text-2xl font-bold">{results.sentiment_score}/10</p>
                    </div>
                    {getSentimentIcon(results.sentiment_score)}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Positive</p>
                      <p className="text-2xl font-bold text-green-900">{results.positive_mentions}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">Negative</p>
                      <p className="text-2xl font-bold text-red-900">{results.negative_mentions}</p>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Neutral</p>
                      <p className="text-2xl font-bold text-gray-900">{results.neutral_mentions}</p>
                    </div>
                    <Minus className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary-900 mb-2">Key Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {results.key_themes.map((theme, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Detailed Analysis
              </h3>
              <div className="prose max-w-none">
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-secondary-700">
                    {results.detailed_analysis}
                  </pre>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-secondary-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReputationScanner;
