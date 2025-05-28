import { motion } from 'framer-motion';

const CarInfo = ({ car }) => {
  if (!car) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'arrived':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.section
      id="car-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Avtomobil Məlumatları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Marka & Model</label>
            <p className="mt-1 text-lg text-gray-900">{car.make} {car.model}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">İl</label>
            <p className="mt-1 text-lg text-gray-900">{car.year}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">VIN</label>
            <p className="mt-1 text-lg text-gray-900">{car.vin}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Konteyner Nömrəsi</label>
            <p className="mt-1 text-lg text-gray-900">{car.containerNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Yükləmə Limanı</label>
            <p className="mt-1 text-lg text-gray-900">{car.portOfLoading}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Yükləmə Tarixi</label>
            <p className="mt-1 text-lg text-gray-900">{formatDate(car.loadingDate)}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Açılış Tarixi</label>
            <p className="mt-1 text-lg text-gray-900">{formatDate(car.openingDate)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.status)}`}>
              {car.status === 'in_transit' ? 'Yoldadır' :
               car.status === 'arrived' ? 'Çatıb' :
               car.status === 'sold' ? 'Satılıb' :
               'Gözləyir'}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CarInfo; 