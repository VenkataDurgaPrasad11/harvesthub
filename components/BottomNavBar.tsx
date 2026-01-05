
import React from 'react';
import { AppView, UserRole } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import LeafIcon from './icons/LeafIcon';
import SparklesIcon from './icons/SparklesIcon';
import StoreIcon from './icons/StoreIcon';
import ListingsIcon from './icons/ListingsIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import { useLanguage } from '../hooks/useLanguage';

interface BottomNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 ${
      isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
    } active:scale-90`}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setCurrentView, userRole }) => {
  const { t } = useLanguage();

  const farmerNav = [
    { id: AppView.DASHBOARD, label: t('bottomNav.dashboard'), icon: <DashboardIcon className="w-6 h-6" /> },
    { id: AppView.CROP_ANALYSIS, label: t('bottomNav.analyze'), icon: <LeafIcon className="w-6 h-6" /> },
    { id: AppView.VOICE_ASSISTANT, label: t('bottomNav.assistant'), icon: <SparklesIcon className="w-6 h-6" /> },
    { id: AppView.MARKETPLACE, label: t('bottomNav.sell'), icon: <StoreIcon className="w-6 h-6" /> },
    { id: AppView.FERTILIZER_STORE, label: t('bottomNav.buy'), icon: <ShoppingCartIcon className="w-6 h-6" /> },
  ];

  const buyerNav = [
    { id: AppView.BROWSE_PRODUCE, label: t('bottomNav.browse'), icon: <StoreIcon className="w-6 h-6" /> },
  ];

  const sellerNav = [
    { id: AppView.MANAGE_LISTINGS, label: t('bottomNav.listings'), icon: <ListingsIcon className="w-6 h-6" /> },
  ];

  let navItems = farmerNav;
  if (userRole === UserRole.BUYER) navItems = buyerNav;
  if (userRole === UserRole.SELLER) navItems = sellerNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md z-10">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={currentView === item.id}
            onClick={() => setCurrentView(item.id)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
