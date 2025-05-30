import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  FileText, 
  Brain,
  LogOut,
  Plus,
  X,
  Lightbulb,
  Target,
  Users,
  Download,
  Copy
} from 'lucide-react';
import axios from 'axios';

const BriefGenerator = () => {
  const navigate = useNavigate();
  const { user, logout, BACKEND_URL } = useAuth();
  const [formData, setFormData] = useState({
    company_name: '',
    product_description: '',
    target_audience: '',
    key_messages: [''],
    campaign_goals: ['']
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addMessage = () => {
    setFormData({
      ...formData,
      key_messages: [...formData.key_messages, '']
    });
  };

  const removeMessage = (index) => {
    const newMessages = formData.key_messages.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      key_messages: newMessages.length > 0 ? newMessages : ['']
    });
  };

  const updateMessage = (index, value) => {
    const newMessages = [...formData.key_messages];
    newMessages[index] = value;
    setFormData({
      ...formData,
      key_messages: newMessages
    });
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      campaign_goals: [...formData.campaign_goals, '']
    });
  };

  const removeGoal = (index) => {
    const newGoals = formData.campaign_goals.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      campaign_goals: newGoals.length > 0 ? newGoals : ['']
    });
  };

  const updateGoal = (index, value) => {
    const newGoals = [...formData.campaign_goals];
    newGoals[index] = value;
    setFormData({
      ...formData,
      campaign_goals: newGoals
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanData = {
        company_name: formData.company_name,
        product_description: formData.product_description,
        target_audience: formData.target_audience,
        key_messages: formData.key_messages.filter(msg => msg.trim() !== ''),
        campaign_goals: formData.campaign_goals.filter(goal => goal.trim() !== '')
      };

      const response = await axios.post(`${BACKEND_URL}/api/agents/brief-generation`, cleanData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate PR brief');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (results) {
      try {
        await navigator.clipboard.writeText(results.brief_content);
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
      const file = new Blob([results.brief_content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `PR_Brief_${results.company_name}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
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
                <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-secondary-900">Brief Generator Agent</h1>
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
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Generate PR Brief
              </h2>
              <p className="text-secondary-600">
                Create comprehensive PR briefs with AI-generated story angles and strategies
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
              <label htmlFor="product_description" className="block text-sm font-medium text-secondary-700 mb-2">
                Product/Service Description *
              </label>
              <textarea
                id="product_description"
                name="product_description"
                required
                rows={4}
                className="textarea-field"
                placeholder="Describe your product, service, or announcement in detail..."
                value={formData.product_description}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="target_audience" className="block text-sm font-medium text-secondary-700 mb-2">
                Target Audience *
              </label>
              <textarea
                id="target_audience"
                name="target_audience"
                required
                rows={3}
                className="textarea-field"
                placeholder="Describe your target audience (demographics, interests, pain points)..."
                value={formData.target_audience}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Key Messages *
              </label>
              {formData.key_messages.map((message, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Enter a key message you want to communicate"
                    value={message}
                    onChange={(e) => updateMessage(index, e.target.value)}
                  />
                  {formData.key_messages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMessage(index)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMessage}
                className="mt-2 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Key Message
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Campaign Goals *
              </label>
              {formData.campaign_goals.map((goal, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Enter a campaign goal (e.g., increase brand awareness)"
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                  />
                  {formData.campaign_goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addGoal}
                className="mt-2 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Campaign Goal
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
                  Generating Brief...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate PR Brief
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Brief Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  PR Brief for {results.company_name}
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
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-secondary-900">Brief ID</p>
                    <p className="text-xs text-secondary-600">{results.brief_id}</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-secondary-900">Story Angles</p>
                    <p className="text-xs text-secondary-600">{results.story_angles.length} generated</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-secondary-900">Media Targets</p>
                    <p className="text-xs text-secondary-600">{results.recommended_media.length} identified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Content */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Complete PR Brief
              </h3>
              <div className="prose max-w-none">
                <div className="bg-secondary-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-secondary-700 leading-relaxed">
                    {results.brief_content}
                  </pre>
                </div>
              </div>
            </div>

            {/* Story Angles */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                AI-Generated Story Angles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.story_angles.map((angle, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">
                          Angle {index + 1}
                        </h4>
                        <p className="text-sm text-green-700">{angle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Media */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Recommended Media Outlets
              </h3>
              <div className="flex flex-wrap gap-3">
                {results.recommended_media.map((outlet, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {outlet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BriefGenerator;
