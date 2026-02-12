
import React from 'react';
import { Page, UserProfile } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  user: UserProfile | null;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, user }) => {
  const stats = [
    { label: 'Total Submitted', value: '12', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'In Review', value: '3', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Resolved', value: '9', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Verified Identity Session</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Hello, {user?.name.split(' ')[0] || 'Member'}.
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
          Welcome back to the FeedbackPoint portal. Your insights are instrumental in shaping our service evolution.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full">+2 Trend</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          onClick={() => onNavigate('submit')}
          className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 cursor-pointer transform hover:scale-[1.01] transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="mb-8 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-3xl font-black mb-3">Initiate Feedback</h3>
            <p className="text-blue-100 text-lg mb-8 font-medium">Capture suggestions or report inconsistencies directly to the management team.</p>
            <span className="inline-flex items-center font-black text-sm uppercase tracking-widest bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Access Form
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('track')}
          className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-slate-200/40 cursor-pointer transform hover:scale-[1.01] transition-all group relative overflow-hidden"
        >
          <div className="mb-8 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3">Audit Logs</h3>
          <p className="text-gray-500 text-lg mb-8 font-medium">Review established statuses, official responses, and historical engagement data.</p>
          <span className="inline-flex items-center font-black text-sm uppercase tracking-widest text-blue-600 bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors">
            View Analytics
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
