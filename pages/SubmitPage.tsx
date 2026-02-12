
import React, { useState } from 'react';
import { FeedbackCategory, FeedbackItem, FeedbackStatus } from '../types';

interface SubmitPageProps {
  onAddFeedback: (item: FeedbackItem) => void;
}

const SubmitPage: React.FC<SubmitPageProps> = ({ onAddFeedback }) => {
  const [category, setCategory] = useState<FeedbackCategory>(FeedbackCategory.SUGGESTION);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: FeedbackItem = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      status: FeedbackStatus.SUBMITTED,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: title || 'No Title Provided',
      description,
    };

    onAddFeedback(newItem);
    setSubmitted(true);
    
    // Clear form
    setTitle('');
    setDescription('');
    setName('');
    setEmail('');

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Share Your Feedback</h1>
        <p className="text-lg text-gray-600">Select a category and let us know what’s on your mind.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-50 border border-white overflow-hidden">
        <div className="p-8 sm:p-12">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-6">Your feedback has been submitted successfully. You can track its status in the "Track Status" tab.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Toggles */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 text-center">What kind of feedback is this?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.values(FeedbackCategory).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                        category === cat 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                          : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Feedback Title</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your feedback in a few words..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Feedback Details</label>
                <textarea 
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible so we can better understand your feedback..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 font-medium"
                />
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name (Optional)</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-blue-100 transform active:scale-[0.98] transition-all"
                >
                  Submit Feedback
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                  By submitting, you agree to our community guidelines and privacy policy.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
