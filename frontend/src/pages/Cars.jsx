import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const cars = [
    {
      id: 'IM6615513',
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      status: 'in_transit',
      location: 'Bakı',
      estimatedDelivery: '2024-03-15',
    },
    {
      id: 'IM6615514',
      brand: 'Honda',
      model: 'Accord',
      year: 2023,
      status: 'delivered',
      location: 'Gəncə',
      estimatedDelivery: '2024-03-10',
    },
    // Daha çox avtomobil əlavə edə bilərsiniz
  ];

  const statusColors = {
    in_transit: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    pending: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    in_transit: 'Yoldadır',
    delivered: 'Çatdırılıb',
    pending: 'Gözləyir',
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || car.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Avtomobillər</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Avtomobil ID, marka və ya model axtarın..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Bütün Statuslar</option>
              <option value="in_transit">Yoldadır</option>
              <option value="delivered">Çatdırılıb</option>
              <option value="pending">Gözləyir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
                  <p className="text-gray-600">ID: {car.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[car.status]}`}>
                  {statusLabels[car.status]}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">İl:</span> {car.year}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Məkan:</span> {car.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Təxmini Çatdırılma:</span> {car.estimatedDelivery}
                </p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Detalları Gör
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Heç bir nəticə tapılmadı</p>
        </div>
      )}
    </div>
  );
};

export default Cars; 