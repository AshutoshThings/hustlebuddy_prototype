import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

      const data = await response.json();

      if (response.ok) {
        // Success logic matching your Postman response
        localStorage.setItem('hb_token', data.token);
        localStorage.setItem('hb_user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection refused. Is the backend server at port 3000 running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      initial={{ backgroundColor: '#030303' }}
      animate={{ backgroundColor: '#FAFAFA' }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
      className="min-h-screen w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-violet-100 selection:text-violet-900"
    >
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
        className="w-full z-10"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity inline-block">
            HustleBuddy<span className="text-violet-600"></span>
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Let's get you started
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
          <div className="bg-white py-8 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:px-10 border border-slate-200/60">
            
            <form className="space-y-5" onSubmit={handleRegister}>
              {error && (
                <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-1.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ashutosh V"
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">College Email</label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@gmail.com"
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1.5">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Creating account...' : 'Create my account'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">or</span></div>
              </div>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <GoogleIcon /><span>Google</span>
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest">
            Jiit Noida Node • Team ThePenguin
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}