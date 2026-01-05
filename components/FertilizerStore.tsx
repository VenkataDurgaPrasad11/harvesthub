
import React, { useState, useEffect } from 'react';
import { Fertilizer } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const FertilizerStore: React.FC = () => {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Fertilizer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchFertilizers = async () => {
      const listings = await api.getFertilizerListings();
      setFertilizers(listings);
    };
    fetchFertilizers();
  }, []);

  const handleBuyClick = (item: Fertilizer) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const resetModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setPaymentMethod(null);
    setOrderPlaced(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('fertilizerStore.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fertilizers.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1 flex-grow">{item.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-green-700">₹{item.price}</span>
                <button 
                    onClick={() => handleBuyClick(item)}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 active:scale-95"
                >
                    {t('fertilizerStore.buyNow')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
       {fertilizers.length === 0 && (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{t('fertilizerStore.noListings')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('fertilizerStore.noListingsSub')}</p>
          </div>
        )}

      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          {orderPlaced ? (
            // Success View
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{t('paymentModal.orderSuccessTitle')}</h3>
              <p className="mt-2 text-gray-600">{t('paymentModal.orderSuccessMessage', { productName: selectedItem.name })}</p>
              <button
                onClick={resetModal}
                className="mt-6 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 active:scale-95"
              >
                {t('paymentModal.close')}
              </button>
            </div>
          ) : (
            // Payment Selection View
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">{t('paymentModal.title')}</h3>
                <button onClick={resetModal} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-600">{t('paymentModal.product', { productName: selectedItem.name })}</p>
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full text-left p-4 border rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    <p className="font-bold">{t('paymentModal.payNow')}</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full text-left p-4 border rounded-lg transition-all ${
                      paymentMethod === 'cod' ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-bold">{t('paymentModal.cod')}</p>
                  </button>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t text-right">
                <button
                  onClick={() => { if (paymentMethod === 'cod') setOrderPlaced(true); }}
                  disabled={paymentMethod !== 'cod'}
                  className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {t('paymentModal.placeOrder')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FertilizerStore;
