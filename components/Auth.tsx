
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VerifyEmail from './VerifyEmail';
import GoogleIcon from './icons/GoogleIcon';
import { useLanguage } from '../hooks/useLanguage';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleAccountError, setIsGoogleAccountError] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGoogleAccountError(false);
    if (!email) {
      setError('Please enter a valid email.');
      return;
    }
     if (!password) {
      setError('Please enter a password.');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        // On successful login, the main App component will re-render and this component will be unmounted.
      } else {
        // Handle Signup
        await signup(email, password);
        setShowVerification(true); // Switch to the verification view
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);

      // Check for the specific Google account error
      if (errorMessage.toLowerCase().includes('google')) {
        setIsGoogleAccountError(true);
      }
      
      // If the error is about verification, show the verification screen
      if (err.message && err.message.toLowerCase().includes('verify')) {
        setShowVerification(true);
      }
    }
  };
  
  const handleGoogleLogin = async (prefilledEmail?: string) => {
    setError(null);
    setIsGoogleAccountError(false);
    const googleEmail = prefilledEmail || window.prompt("To simulate Google Sign-In, please enter your email address:");
    if (googleEmail) {
      try {
        await loginWithGoogle(googleEmail);
      } catch (err: any) {
        setError(err.message || "An error occurred during Google Sign-In.");
      }
    }
  };
  
  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setShowVerification(false);
    setError(null);
    setIsGoogleAccountError(false);
  };

  if (showVerification) {
    return (
       <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-green-700">{t('auth.title')}</h1>
          </div>
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <VerifyEmail email={email} password={password} onSwitchToLogin={handleSwitchToLogin} />
          </div>
       </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-green-700">{t('auth.title')}</h1>
        <p className="text-gray-600 mt-4 text-lg">{t('auth.subtitle')}</p>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
        </h2>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 text-sm" role="alert">
                <p className="font-bold">{isLogin ? t('auth.loginError') : t('auth.signupError')}</p>
                <p>{error}</p>
                {isGoogleAccountError && (
                    <button
                        onClick={() => handleGoogleLogin(email)}
                        className="mt-2 font-bold text-red-800 underline hover:text-red-900 transition-colors"
                    >
                        {t('auth.googleAccountErrorPrompt')}
                    </button>
                )}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('auth.emailLabel')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('auth.passwordLabel')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-95"
            >
              {isLogin ? t('auth.signIn') : t('auth.signUp')}
            </button>
          </div>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">{t('auth.or')}</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => handleGoogleLogin()}
            type="button"
            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            {t('auth.signInWithGoogle')}
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
          <button onClick={() => { setIsLogin(!isLogin); setError(null); setIsGoogleAccountError(false); }} className="font-medium text-green-600 hover:text-green-500 ml-1">
            {isLogin ? t('auth.signUp') : t('auth.signIn')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
