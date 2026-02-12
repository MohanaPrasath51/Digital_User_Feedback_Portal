
import React, { useState } from 'react';
// Simulated Registration Service
const simulateSignup = async (name: string, email: string, pass: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        user: { 
          email, 
          displayName: name, 
          uid: 'sim-' + Math.random().toString(36).substr(2, 9),
          isAdmin: email.toLowerCase() === 'admin@gmail.com'
        } 
      });
    }, 1500);
  });
};

interface SignupPageProps {
  onLogin: (name: string, email: string, isAdmin: boolean) => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onLogin, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setStatusMsg('Provisioning global profile...');

    try {
      const result: any = await simulateSignup(name, email, password);
      const user = result.user;
      
      setStatusMsg('Identity secured. Launching portal...');
      setTimeout(() => onLogin(user.displayName, user.email, user.isAdmin), 800);
    } catch (err: any) {
      setError('Registration failed due to network timeout. Please retry.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-indigo-600 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-700 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[2rem] shadow-2xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Join FeedbackPoint</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Create Your Secure Account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 p-10 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-400 rounded-full animate-spin"></div>
              </div>
              <p className="text-white font-bold mb-1">Enrolling</p>
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{statusMsg}</p>
              </div>
            </div>
          )}

          <div className="relative">
            <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4 uppercase tracking-tighter">Enrollment</h2>
            
            <form className="space-y-4" onSubmit={handleSignup}>
              {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-[11px] font-bold border border-red-500/20 flex flex-col items-center text-center animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Identity</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-4 rounded-2xl border border-white/10 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm</label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-4 rounded-2xl border border-white/10 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-sm" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98] mt-4"
              >
                Create Global Profile
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Already registered? <button onClick={onSwitchToLogin} className="text-indigo-400 font-black hover:underline">Log In</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
