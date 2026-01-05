import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CropAnalysis from './components/CropAnalysis';
import VoiceAssistant from './components/VoiceAssistant';
import RoleSelection from './components/RoleSelection';
import Marketplace from './components/Marketplace';
import FertilizerStore from './components/FertilizerStore';
import BrowseProduce from './components/BrowseProduce';
import ManageListings from './components/ManageListings';
import BottomNavBar from './components/BottomNavBar';
import Auth from './components/Auth';
import { AppView, UserRole, LanguageCode } from './types';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './hooks/useLanguage';


const App: React.FC = () => {
  const { user, selectRole, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const { setLanguage } = useLanguage();
  const roleRef = useRef(user?.role);

  // Auto-detect language on first load
  useEffect(() => {
    const savedLang = localStorage.getItem('user-language');
    if (savedLang) {
      setLanguage(savedLang as LanguageCode);
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const countryCode = data?.address?.country_code;

            if (countryCode === 'in') {
              setLanguage(LanguageCode.HINDI);
            } else {
              setLanguage(LanguageCode.ENGLISH);
            }
          } catch (error) {
            console.error("Error getting location-based language:", error);
            setLanguage(LanguageCode.ENGLISH);
          }
        },
        () => {
          // Geolocation denied or failed
          setLanguage(LanguageCode.ENGLISH);
        }
      );
    }
  }, [setLanguage]);

  // This effect will run when the user's role changes to set a default view.
  useEffect(() => {
     if (user?.role && user.role !== roleRef.current) {
        switch (user.role) {
            case UserRole.FARMER:
            setCurrentView(AppView.DASHBOARD);
            break;
            case UserRole.BUYER:
            setCurrentView(AppView.BROWSE_PRODUCE);
            break;
            case UserRole.SELLER:
            setCurrentView(AppView.MANAGE_LISTINGS);
            break;
            default:
            setCurrentView(AppView.DASHBOARD);
        }
        roleRef.current = user.role;
    }
  }, [user?.role]);

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
  };
  
  const renderView = () => {
    // Adding a wrapper with a key for animations
    return (
        <div key={currentView} className="view-container">
            {(() => {
                switch (currentView) {
                  case AppView.CROP_ANALYSIS:
                    return <CropAnalysis setCurrentView={setCurrentView} />;
                  case AppView.VOICE_ASSISTANT:
                    return <VoiceAssistant />;
                  case AppView.MARKETPLACE:
                    return <Marketplace />;
                  case AppView.FERTILIZER_STORE:
                    return <FertilizerStore />;
                  case AppView.BROWSE_PRODUCE:
                    return <BrowseProduce />;
                  case AppView.MANAGE_LISTINGS:
                    return <ManageListings />;
                  case AppView.DASHBOARD:
                  default:
                    return <Dashboard />;
                }
            })()}
        </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center">
          <span className="text-4xl">🌱</span>
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mt-4"></div>
          <p className="mt-4 text-gray-600">Loading HarvestHub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (!user.role) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  return (
    <div className="h-full w-full bg-gray-100 font-sans flex flex-col">
      <Header 
        currentView={currentView} 
        userRole={user.role}
      />
      <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
        {renderView()}
      </main>
      <BottomNavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={user.role}
      />
    </div>
  );
};

export default App;