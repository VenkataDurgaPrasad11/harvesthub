
import React, { useState, useEffect } from 'react';
import { Fertilizer } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const ManageListings: React.FC = () => {
  const [listings, setListings] = useState<Fertilizer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const { t } = useLanguage();

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const fetchListings = async () => {
      const storedListings = await api.getFertilizerListings();
      setListings(storedListings);
    };
    fetchListings();
  }, []);
  
  const resetForm = () => {
    setShowForm(false);
    setEditingListingId(null);
    setName('');
    setPrice('');
    setDescription('');
    setImagePreview('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setImagePreview(`data:${file.type};base64,${base64}`);
    }
  };

  const handleEditClick = (listing: Fertilizer) => {
    setEditingListingId(listing.id);
    setName(listing.name);
    setPrice(listing.price.toString());
    setDescription(listing.description);
    setImagePreview(listing.imageUrl);
    setShowForm(true);
  };

  const handleRemove = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      const updatedListings = listings.filter(l => l.id !== id);
      setListings(updatedListings);
      await api.saveFertilizerListings(updatedListings);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedListings;

    if(editingListingId) {
        updatedListings = listings.map(l => l.id === editingListingId ? {
            ...l,
            name,
            price: parseFloat(price),
            description,
            imageUrl: imagePreview,
        } : l);
    } else {
        const newListing: Fertilizer = {
          id: new Date().toISOString(),
          name,
          price: parseFloat(price),
          description,
          imageUrl: imagePreview
        };
        updatedListings = [...listings, newListing];
    }
    
    setListings(updatedListings);
    await api.saveFertilizerListings(updatedListings);
    
    resetForm();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('manageListings.title')}</h1>
        <button onClick={() => { showForm ? resetForm() : setShowForm(true); }} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 active:scale-95">
            {showForm ? t('manageListings.cancel') : t('manageListings.addFertilizer')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">{editingListingId ? t('manageListings.editListingTitle') : t('manageListings.newListingTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('manageListings.productName')}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('manageListings.price')}</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">{t('manageListings.description')}</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('manageListings.productImage')}</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              {imagePreview && <img src={imagePreview} alt="preview" className="mt-4 h-32 w-32 object-cover rounded-md" />}
            </div>
            <div className="text-right">
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 active:scale-95">
                {editingListingId ? t('manageListings.updateListing') : t('manageListings.listProduct')}
              </button>
            </div>
          </form>
        </div>
      )}

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="mt-4">
                    <span className="text-xl font-bold text-green-700">₹{item.price}</span>
                </div>
              </div>
              <div className="p-2 bg-gray-50 border-t flex justify-end space-x-4">
                    <button onClick={() => handleEditClick(item)} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-transform active:scale-95">{t('manageListings.edit')}</button>
                    <button onClick={() => handleRemove(item.id)} className="text-sm font-medium text-red-600 hover:text-red-800 transition-transform active:scale-95">{t('manageListings.remove')}</button>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t('manageListings.noListings')}</p>
          <p className="text-sm text-gray-400 mt-2">{t('manageListings.noListingsSub')}</p>
        </div>
      )}
    </div>
  );
};

export default ManageListings;
