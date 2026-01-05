
import React from 'react';
import { AppView, UserRole, LanguageCode } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  currentView: AppView;
  userRole: UserRole;
}

const Header: React.FC<HeaderProps> = ({ currentView, userRole }) => {
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const viewTitles: Record<AppView, string> = {
      [AppView.DASHBOARD]: t('header.dashboard'),
      [AppView.CROP_ANALYSIS]: t('header.cropAnalysis'),
      [AppView.VOICE_ASSISTANT]: t('header.aiAssistant'),
      [AppView.MARKETPLACE]: t('header.yourMarketplace'),
      [AppView.FERTILIZER_STORE]: t('header.fertilizerStore'),
      [AppView.BROWSE_PRODUCE]: t('header.browseProduce'),
      [AppView.MANAGE_LISTINGS]: t('header.manageListings'),
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10 flex-shrink-0 pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <span className="text-2xl font-bold text-green-700">🌱</span>
             <h1 className="ml-3 text-xl font-semibold text-gray-800">{viewTitles[currentView]}</h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden sm:flex items-center space-x-2">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                    aria-label="Select language"
                >
                    <option value={LanguageCode.ENGLISH}>{t('languages.en-US')}</option>
                    <option value={LanguageCode.HINDI}>{t('languages.hi-IN')}</option>
                    <option value={LanguageCode.TELUGU}>{t('languages.te-IN')}</option>
                    <option value={LanguageCode.MALAYALAM}>{t('languages.ml-IN')}</option>
                </select>
                <span className="text-sm text-gray-600">{user?.displayName || user?.email}</span>
             </div>
             <button
                onClick={logout}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-all active:scale-95"
              >
                {t('header.logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;