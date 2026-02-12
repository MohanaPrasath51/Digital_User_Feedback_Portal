
import React, { useState } from 'react';
import { FeedbackItem, FeedbackStatus, FeedbackCategory } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  feedbackList: FeedbackItem[];
  onUpdateFeedback: (updatedItem: FeedbackItem) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ feedbackList, onUpdateFeedback, onExit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const stats = {
    total: feedbackList.length,
    pending: feedbackList.filter(f => f.status === FeedbackStatus.SUBMITTED).length,
    inReview: feedbackList.filter(f => f.status === FeedbackStatus.IN_REVIEW).length,
    resolved: feedbackList.filter(f => f.status === FeedbackStatus.RESOLVED).length,
  };

  const handleStatusChange = (item: FeedbackItem, newStatus: FeedbackStatus) => {
    onUpdateFeedback({ ...item, status: newStatus });
  };

  const handleSaveResponse = (item: FeedbackItem) => {
    onUpdateFeedback({ ...item, officialResponse: responseText });
    setEditingId(null);
    setResponseText('');
  };

  // AI-powered response drafting using Gemini
  const generateAIResponse = async (item: FeedbackItem) => {
    if (isGeneratingAI) return;
    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Draft a professional, empathetic, and concise official response to this customer feedback. 
        Feedback Category: ${item.category}
        Feedback Title: ${item.title}
        Feedback Description: ${item.description}
        
        The response should acknowledge their input and state that we value their perspective. Keep it under 200 characters if possible.`,
        config: {
          systemInstruction: "You are an expert customer success manager at FeedbackPoint, a tech platform. You write helpful, professional responses to user feedback.",
          temperature: 0.7
        }
      });
      setResponseText(response.text || '');
    } catch (err) {
      console.error("Gemini AI failed to draft response:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const startEditing = (item: FeedbackItem) => {
    setEditingId(item.id);
    setResponseText(item.officialResponse || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Management Portal
            </h1>
            <p className="text-gray-400 text-sm mt-1">Review and respond to community feedback</p>
          </div>
          <button 
            onClick={onExit}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Exit Admin Mode
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-900' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'In Review', value: stats.inReview, color: 'text-blue-600' },
            { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Feedback Management List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-800">Recent Submissions</h2>
            <div className="flex space-x-2">
               <input 
                 type="text" 
                 placeholder="Search ID or Title..." 
                 className="text-sm px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-900" 
               />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {feedbackList.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-mono font-bold text-gray-400">{item.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                        item.category === FeedbackCategory.COMPLAINT ? 'bg-red-100 text-red-700' :
                        item.category === FeedbackCategory.APPRECIATION ? 'bg-pink-100 text-pink-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-2xl">{item.description}</p>
                    
                    {item.officialResponse && editingId !== item.id && (
                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-sm border border-emerald-100 inline-block mt-2">
                        <span className="font-bold mr-2 text-[10px] uppercase">Current Response:</span>
                        {item.officialResponse}
                      </div>
                    )}

                    {editingId === item.id && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Draft Official Response</label>
                          <button 
                            onClick={() => generateAIResponse(item)}
                            disabled={isGeneratingAI}
                            className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                          >
                            <svg className={`h-3 w-3 mr-1 ${isGeneratingAI ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {isGeneratingAI ? 'Generating...' : 'Magic AI Draft'}
                          </button>
                        </div>
                        <textarea 
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[100px] text-gray-900 font-medium"
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your response to the user..."
                        />
                        <div className="flex justify-end space-x-2 mt-3">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveResponse(item)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all"
                          >
                            Save Response
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 min-w-[180px]">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Status</label>
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value as FeedbackStatus)}
                      className={`text-sm font-bold p-2 rounded-xl border outline-none transition-all ${
                        item.status === FeedbackStatus.RESOLVED ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                        item.status === FeedbackStatus.IN_REVIEW ? 'border-blue-200 text-blue-700 bg-blue-50' :
                        'border-amber-200 text-amber-700 bg-amber-50'
                      }`}
                    >
                      <option value={FeedbackStatus.SUBMITTED}>Submitted (Active)</option>
                      <option value={FeedbackStatus.IN_REVIEW}>In Review</option>
                      <option value={FeedbackStatus.RESOLVED}>Resolved</option>
                    </select>

                    <button 
                      onClick={() => startEditing(item)}
                      className="text-xs font-bold text-blue-600 border border-blue-100 hover:bg-blue-50 p-2 rounded-xl transition-all flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      {item.officialResponse ? 'Edit Response' : 'Add Response'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;