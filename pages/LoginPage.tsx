
import React, { useState } from 'react';

// Simulated Auth Service for UI/UX Demo
const simulateLogin = async (email: string, pass: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In simulation mode, we accept any credentials
      // For testing admin specifically:
      const isAdmin = email.toLowerCase() === 'admin@gmail.com';
      resolve({ 
        user: { 
          email, 
          displayName: email.split('@')[0], 
          uid: 'sim-' + Math.random().toString(36).substr(2, 9),
          isAdmin
        } 
      });
    }, 1500);
  });
};

const simulateGoogleLogin = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        user: { 
          email: 'demo.user@gmail.com', 
          displayName: 'Demo User', 
          uid: 'sim-google-' + Math.random().toString(36).substr(2, 9),
          isAdmin: false
        } 
      });
    }, 1200);
  });
};

interface LoginPageProps {
  onLogin: (name: string, email: string, isAdmin: boolean) => void;
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setStatusMsg('Verifying credentials via Secure Gateway...');

    try {
      const result: any = await simulateLogin(email, password);
      const user = result.user;
      
      setStatusMsg('Access Granted. Redirecting...');
      setTimeout(() => onLogin(user.displayName, user.email, user.isAdmin), 800);
    } catch (err: any) {
      setError('Invalid identity credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    setStatusMsg('Connecting to Google Identity Services...');
    
    try {
      const result: any = await simulateGoogleLogin();
      const user = result.user;
      
      setStatusMsg(`Welcome, ${user.displayName}! Syncing profile...`);
      setTimeout(() => onLogin(user.displayName, user.email, user.isAdmin), 800);
    } catch (err: any) {
      setError('Google authentication was interrupted.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden relative">
      {/* Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-700 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[2rem] shadow-2xl mb-6 transform transition-transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">FeedbackPoint</h1>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-ping"></span>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Secure Demo Environment</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-10 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 transition-all duration-500">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-400 rounded-full animate-spin"></div>
              </div>
              <p className="text-white font-black text-xl mb-3">Authorizing</p>
              <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <p className="text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">{statusMsg}</p>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="flex items-center space-x-4 mb-10">
              <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">System Access</h2>
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-[11px] font-bold border border-red-500/20 flex flex-col items-center text-center animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Identity</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold placeholder:text-slate-600" 
                  />
                  <p className="text-[9px] text-slate-500 ml-2 italic">Tip: use admin@gmail.com for admin tools</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Encrypted Key</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold placeholder:text-slate-600" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] mt-2 group"
              >
                Authorize Portal
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                <span className="px-4 bg-transparent text-slate-500">Fast Pass</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-3 transition-all active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm font-medium">
                New User? <button onClick={onSwitchToSignup} className="text-blue-400 font-black hover:underline">Create Account</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
