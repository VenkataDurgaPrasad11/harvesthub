
import React, { useState, useEffect } from 'react';
import { CropHealthHistoryItem } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const MockWeather: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
            <div>
                <p className="font-bold text-lg">{t('dashboard.weatherTitle')}</p>
                <p>{t('dashboard.weatherCondition')}</p>
            </div>
            <div className="text-right">
                <p className="text-4xl font-bold">28°C</p>
                <p>{t('dashboard.humidity', { value: 65 })}</p>
            </div>
            </div>
            <div className="mt-4 text-sm">
                <p><strong>{t('dashboard.weatherTip')}</strong></p>
                <p className="text-xs mt-2 text-gray-500">{t('dashboard.weatherDisclaimer')}</p>
            </div>
        </div>
    )
};

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<CropHealthHistoryItem[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchHistory = async () => {
      const storedHistory = await api.getCropHealthHistory();
      setHistory(storedHistory);
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{t('dashboard.title')}</h1>
      <MockWeather />
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('dashboard.historyTitle')}</h2>
        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
                <img src={item.imageUrl} alt="Analyzed crop" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{item.analysis.disease}</h3>
                  <p className="text-sm text-gray-600 truncate">{item.analysis.remedy}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('dashboard.noHistory')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('dashboard.noHistorySub')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
