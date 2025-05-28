import { motion } from 'framer-motion';

const CustomerInfo = ({ customer }) => {
  if (!customer) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Müştəri Məlumatları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Ad Soyad</label>
            <p className="mt-1 text-lg text-gray-900">{customer.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">E-poçt</label>
            <p className="mt-1 text-lg text-gray-900">{customer.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Telefon</label>
            <p className="mt-1 text-lg text-gray-900">{customer.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Ünvan</label>
            <p className="mt-1 text-lg text-gray-900">{customer.address}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CustomerInfo; 