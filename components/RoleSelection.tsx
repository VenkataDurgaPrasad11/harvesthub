
import React from 'react';
import { UserRole } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleCard: React.FC<{ title: string; description: string; emoji: string; onClick: () => void; }> = ({ title, description, emoji, onClick }) => (
    <button
        onClick={onClick}
        className="w-full md:w-80 text-left p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-100"
    >
        <div className="flex items-center space-x-4">
            <div className="text-5xl">{emoji}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
        </div>
    </button>
);


const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700">{t('roleSelection.welcome')}</h1>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl">
          {t('roleSelection.prompt')}
        </p>
      </div>
      <div className="space-y-6">
        <RoleCard 
            title={t('roleSelection.farmer')}
            description={t('roleSelection.farmerDesc')}
            emoji="🧑‍🌾"
            onClick={() => onSelectRole(UserRole.FARMER)}
        />
        <RoleCard 
            title={t('roleSelection.buyer')}
            description={t('roleSelection.buyerDesc')}
            emoji="🛒"
            onClick={() => onSelectRole(UserRole.BUYER)}
        />
        <RoleCard 
            title={t('roleSelection.seller')}
            description={t('roleSelection.sellerDesc')}
            emoji="📦"
            onClick={() => onSelectRole(UserRole.SELLER)}
        />
      </div>
    </div>
  );
};

export default RoleSelection;
