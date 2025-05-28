import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  TruckIcon, 
  MapIcon, 
  CalendarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('customerData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('API məlumatları:', parsedData.data);
        console.log('Avtomobil statusu:', parsedData.data.car.status);
        console.log('Tracking Links:', parsedData.data.car.trackingLinks);
        setCustomerData(parsedData.data);
      } catch (error) {
        console.error('JSON parse xətası:', error);
      }
    }
    setLoading(false);
  }, []);

  const statusColors = {
    'in_transit': 'bg-yellow-100 text-yellow-800',
    'delivered': 'bg-green-100 text-green-800',
    'pending': 'bg-blue-100 text-blue-800',
    'cancelled': 'bg-red-100 text-gray-800',
    'arrived': 'bg-green-100 text-green-800',
    'loading': 'bg-blue-100 text-blue-800',
    'unloading': 'bg-yellow-100 text-yellow-800'
  };

  const statusLabels = {
    'in_transit': 'Yoldadır',
    'delivered': 'Çatdırılıb',
    'pending': 'Gözləyir',
    'cancelled': 'Ləğv edilib',
    'arrived': 'Çatıb',
    'loading': 'Yüklənir',
    'unloading': 'Boşaldılır'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Müştəri məlumatı tapılmadı</h2>
          <p className="text-gray-600">Zəhmət olmasa ana səhifəyə qayıdın və müştəri ID-ni yenidən daxil edin.</p>
        </div>
      </div>
    );
  }

  // Status məlumatını yoxlayırıq
  console.log('Render zamanı status:', customerData.car.status);
  console.log('Status rəngi:', statusColors[customerData.car.status]);
  console.log('Status etiketi:', statusLabels[customerData.car.status]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Avtomobil İzləmə</h1>
          <p className="text-gray-600">Müştəri ID: {customerData.customerId}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Avtomobil Statusu</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[customerData.car.status] || 'bg-gray-100 text-gray-800'
                }`}>
                  {statusLabels[customerData.car.status] || customerData.car.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Marka & Model</p>
                    <p className="font-semibold">{customerData.car.make} {customerData.car.model}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">İstehsal İli</p>
                    <p className="font-semibold">{customerData.car.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">VIN Kodu</p>
                    <p className="font-semibold">{customerData.car.vin || 'Məlumat yoxdur'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Konteyner Nömrəsi</p>
                    <p className="font-semibold">{customerData.car.containerNumber || 'Məlumat yoxdur'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gəmiçilik Məlumatları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Yükləmə Limanı</p>
                    <p className="font-semibold">{customerData.car.portOfLoading || 'Məlumat yoxdur'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Yükləmə Tarixi</p>
                    <p className="font-semibold">
                      {customerData.car.loadingDate ? new Date(customerData.car.loadingDate).toLocaleDateString() : 'Məlumat yoxdur'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Açılış Tarixi</p>
                    <p className="font-semibold">
                      {customerData.car.openingDate ? new Date(customerData.car.openingDate).toLocaleDateString() : 'Məlumat yoxdur'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Images Section */}
            {customerData.images && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Avtomobil Şəkilləri</h2>
                <div className="space-y-6">
                  {/* Auction Images */}
                  {customerData.images.auction && customerData.images.auction.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Hərrac Şəkilləri</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customerData.images.auction.map((image, index) => (
                          <div key={index} className="relative aspect-video group">
                            <img
                              src={image}
                              alt={`Hərrac şəkli ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Images */}
                  {customerData.images.other && customerData.images.other.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Digər Şəkillər</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customerData.images.other.map((image, index) => (
                          <div key={index} className="relative aspect-video group">
                            <img
                              src={image}
                              alt={`Digər şəkil ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Tracking Links */}
          <div className="space-y-6">
            {/* Tracking Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">İzləmə Linkləri</h2>
              <div className="space-y-4">
                {customerData.car.trackingLinks?.carrier && (
                  <a
                    href={customerData.car.trackingLinks.carrier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Daşıyıcı İzləmə</p>
                        <p className="text-sm text-gray-600 mt-1">Avtomobilin daşıyıcı tərəfindən izlənməsi</p>
                      </div>
                    </div>
                  </a>
                )}
                {customerData.car.trackingLinks?.ship && (
                  <a
                    href={customerData.car.trackingLinks.ship}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Gəmi İzləmə</p>
                        <p className="text-sm text-gray-600 mt-1">Gəminin real vaxt izlənməsi</p>
                      </div>
                    </div>
                  </a>
                )}
                {(!customerData.car.trackingLinks?.carrier && !customerData.car.trackingLinks?.ship) && (
                  <p className="text-gray-500 text-center py-4">İzləmə linkləri mövcud deyil</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars; 