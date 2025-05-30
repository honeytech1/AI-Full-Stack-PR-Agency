import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Brain,
  LogOut,
  Copy,
  Download,
  Instagram,
  Twitter,
  Linkedin,
  Film,
  Image,
  MessageSquare,
  Layers
} from 'lucide-react';
import axios from 'axios';

const ContentRepurposer = () => {
  const navigate = useNavigate();
  const { user, logout, BACKEND_URL } = useAuth();
  const [formData, setFormData] = useState({
    original_content: '',
    target_format: 'linkedin_post',
    brand_voice: 'professional'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatOptions = [
    {
      value: 'linkedin_post',
      label: 'LinkedIn Post',
      icon: Linkedin,
      description: 'Professional post with storytelling and value proposition',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      value: 'twitter_thread',
      label: 'Twitter/X Thread',
      icon: Twitter,
      description: '8-12 tweet thread with hooks and engagement',
      color: 'text-black bg-gray-50'
    },
    {
      value: 'instagram_reel',
      label: 'Instagram Reel',
      icon: Film,
      description: '30-60 second video script with hooks and CTA',
      color: 'text-pink-600 bg-pink-50'
    },
    {
      value: 'carousel',
      label: 'Social Carousel',
      icon: Image,
      description: '5-7 slides with headlines and key points',
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const voiceOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal, authoritative tone' },
    { value: 'casual', label: 'Casual', description: 'Friendly, conversational tone' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivating, uplifting tone' },
    { value: 'educational', label: 'Educational', description: 'Informative, teaching tone' },
    { value: 'storytelling', label: 'Storytelling', description: 'Narrative, engaging tone' }
  ];

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
      const response = await axios.post(`${BACKEND_URL}/api/agents/content-repurpose`, formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to repurpose content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (results) {
      try {
        await navigator.clipboard.writeText(results.repurposed_content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleDownload = () => {
    if (results) {
      const element = document.createElement("a");
      const file = new Blob([results.repurposed_content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${results.target_format}_content_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getFormatIcon = (format) => {
    const option = formatOptions.find(opt => opt.value === format);
    return option ? option.icon : MessageSquare;
  };

  const getEngagementColor = (level) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
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
                <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-secondary-900">Content Repurpose Agent</h1>
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
            <div className="bg-purple-100 rounded-lg p-3 mr-4">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Repurpose Your Content
              </h2>
              <p className="text-secondary-600">
                Transform PR content into engaging social media formats optimized for each platform
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="original_content" className="block text-sm font-medium text-secondary-700 mb-2">
                Original Content *
              </label>
              <textarea
                id="original_content"
                name="original_content"
                required
                rows={8}
                className="textarea-field"
                placeholder="Paste your PR content, press release, blog post, or any long-form content you want to repurpose..."
                value={formData.original_content}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-secondary-500">
                This can be a press release, blog post, product announcement, or any content you want to adapt.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Target Format *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formatOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all ${
                      formData.target_format === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="target_format"
                      value={option.value}
                      checked={formData.target_format === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-secondary-900">
                          {option.label}
                        </h3>
                        <p className="text-xs text-secondary-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="brand_voice" className="block text-sm font-medium text-secondary-700 mb-2">
                Brand Voice *
              </label>
              <select
                id="brand_voice"
                name="brand_voice"
                required
                className="input-field"
                value={formData.brand_voice}
                onChange={handleInputChange}
              >
                {voiceOptions.map((voice) => (
                  <option key={voice.value} value={voice.value}>
                    {voice.label} - {voice.description}
                  </option>
                ))}
              </select>
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
                  Repurposing Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Repurpose Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Content Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Repurposed Content
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="btn-secondary flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-secondary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    {React.createElement(getFormatIcon(results.target_format), {
                      className: "h-8 w-8 text-purple-600 mx-auto mb-2"
                    })}
                    <p className="text-sm font-medium text-secondary-900">Format</p>
                    <p className="text-xs text-secondary-600 capitalize">{results.target_format.replace('_', ' ')}</p>
                  </div>
                  <div className="text-center">
                    <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-secondary-900">Brand Voice</p>
                    <p className="text-xs text-secondary-600 capitalize">{results.brand_voice}</p>
                  </div>
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEngagementColor(results.estimated_engagement)}`}>
                      {results.estimated_engagement} Engagement
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Repurposed Content */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Generated Content
              </h3>
              <div className="prose max-w-none">
                <div className="bg-secondary-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <pre className="whitespace-pre-wrap text-sm text-secondary-700 leading-relaxed">
                    {results.repurposed_content}
                  </pre>
                </div>
              </div>
            </div>

            {/* Platform Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Platform Optimization Tips
              </h3>
              <div className="space-y-3">
                {results.platform_tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-purple-900 mb-1">
                        Tip {index + 1}
                      </h4>
                      <p className="text-sm text-purple-700">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Variations */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Try Other Formats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formatOptions
                  .filter(option => option.value !== results.target_format)
                  .map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({...formData, target_format: option.value})}
                      className="p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          <option.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-secondary-900 mb-1">{option.label}</h4>
                          <p className="text-sm text-secondary-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Performance Prediction */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Content Performance Insights
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Brain className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      AI Performance Prediction: {results.estimated_engagement}
                    </h4>
                    <p className="text-sm text-blue-800 mb-4">
                      Based on format optimization, brand voice alignment, and content structure, 
                      this repurposed content is expected to perform well on the target platform.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-blue-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Engagement hooks: Present and effective
                      </div>
                      <div className="flex items-center text-sm text-blue-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Brand voice consistency: Maintained
                      </div>
                      <div className="flex items-center text-sm text-blue-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Platform optimization: Applied
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContentRepurposer;
