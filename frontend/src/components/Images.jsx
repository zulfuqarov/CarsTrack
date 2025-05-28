import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Images = ({ images }) => {
  const [activeTab, setActiveTab] = useState('auction');

  if (!images) return null;

  const categories = [
    { id: 'auction', label: 'Hərrac' },
    { id: 'americanDepot', label: 'Amerika Deposu' },
    { id: 'containerLoading', label: 'Konteyner Yüklənməsi' },
    { id: 'containerUnloading', label: 'Konteyner Boşaldılması' },
    { id: 'bakuRoad', label: 'Bakı Yolu' },
    { id: 'bakuCustoms', label: 'Bakı Gömrük' },
  ];

  return (
    <motion.section
      id="images"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Avtomobil Şəkilləri</h2>
      
      {/* Mobile Accordion */}
      <div className="md:hidden space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg">
            <button
              onClick={() => setActiveTab(activeTab === category.id ? null : category.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left"
            >
              <span className="font-medium text-gray-900">{category.label}</span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-500 transform transition-transform ${
                  activeTab === category.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeTab === category.id && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  {images[category.id]?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${category.label} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`${
                  activeTab === category.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            {images[activeTab]?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${categories.find(c => c.id === activeTab)?.label} ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Images; 