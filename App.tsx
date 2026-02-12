
import React, { useState } from 'react';
import { Page, FeedbackItem, UserProfile } from './types';
import { MOCK_FEEDBACK } from './constants';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import SubmitPage from './pages/SubmitPage';
import TrackPage from './pages/TrackPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(MOCK_FEEDBACK);

  const handleLogin = (name: string, email: string, isAdmin: boolean) => {
    setIsAuthenticated(true);
    const profile = { name, email, isAdmin };
    setUser(profile);
    
    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthView('login');
    setCurrentPage('login');
  };

  const handleAddFeedback = (newItem: FeedbackItem) => {
    setFeedbackList([newItem, ...feedbackList]);
  };

  const handleUpdateFeedback = (updatedItem: FeedbackItem) => {
    setFeedbackList(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const renderPage = () => {
    if (currentPage === 'admin') {
      return (
        <AdminDashboard 
          feedbackList={feedbackList} 
          onUpdateFeedback={handleUpdateFeedback}
          onExit={() => setCurrentPage('home')} 
        />
      );
    }

    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} user={user} />;
      case 'submit': return <SubmitPage onAddFeedback={handleAddFeedback} />;
      case 'track': return <TrackPage feedbackList={feedbackList} />;
      default: return <HomePage onNavigate={setCurrentPage} user={user} />;
    }
  };

  if (!isAuthenticated) {
    return authView === 'login' 
      ? <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
      : <SignupPage onLogin={handleLogin} onSwitchToLogin={() => setAuthView('login')} />;
  }

  // Layout for admin is handled inside AdminDashboard component to allow for a unique look
  if (currentPage === 'admin') {
    return renderPage();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
      />
      
      <main className="flex-grow pb-24">
        {renderPage()}
      </main>

      {/* Admin Floating Button - Only visible if user logged in with admin credentials */}
      {user?.isAdmin && (
        <button 
          onClick={() => setCurrentPage('admin')}
          title="Admin Access"
          className="fixed bottom-8 right-8 bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all transform hover:scale-105 active:scale-95 group z-50 border border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-bold text-sm tracking-wide">Admin Portal</span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
            FeedbackPoint &copy; 2024
          </p>
          <p className="text-slate-300 text-[10px] mt-2 font-bold uppercase tracking-[0.3em]">
            Enterprise Feedback Management Solutions
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
