
import React, { useState } from 'react';
import { FeedbackStatus, FeedbackCategory, FeedbackItem } from '../types';

interface TrackPageProps {
  feedbackList: FeedbackItem[];
}

const TrackPage: React.FC<TrackPageProps> = ({ feedbackList }) => {
  const [filter, setFilter] = useState<'All' | FeedbackStatus>('All');

  const filteredItems = filter === 'All' 
    ? feedbackList 
    : feedbackList.filter(item => item.status === filter);

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.SUBMITTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      case FeedbackStatus.IN_REVIEW: return 'bg-blue-100 text-blue-700 border-blue-200';
      case FeedbackStatus.RESOLVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (cat: FeedbackCategory) => {
    switch (cat) {
      case FeedbackCategory.SUGGESTION: return 'bg-purple-100 text-purple-700';
      case FeedbackCategory.COMPLAINT: return 'bg-red-100 text-red-700';
      case FeedbackCategory.APPRECIATION: return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Your Feedback History</h1>
          <p className="text-lg text-gray-600">Track the progress of your submitted suggestions and reports.</p>
        </div>
        
        {/* Filters */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {['All', FeedbackStatus.SUBMITTED, FeedbackStatus.IN_REVIEW, FeedbackStatus.RESOLVED].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f === FeedbackStatus.SUBMITTED ? 'Active' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-400 space-x-4">
                    <span>{item.id}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {item.officialResponse && (
                  <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-extrabold text-blue-700 uppercase tracking-wider mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Official Response
                    </h4>
                    <p className="text-gray-700 italic">
                      "{item.officialResponse}"
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-all border border-gray-100 flex items-center group/btn">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No feedback found</h3>
            <p className="text-gray-500">Try changing your filters or submit a new feedback.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
