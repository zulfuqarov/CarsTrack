import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const Tracking = ({ tracking }) => {
  if (!tracking) return null;

  return (
    <motion.section
      id="tracking"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">İzləmə Linkləri</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Daşıyıcı İzləmə</h3>
            <p className="text-sm text-gray-500">Daşıyıcı ilə yüklənməni izləyin</p>
          </div>
          <a
            href={tracking.carrier}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İzlə
            <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
          </a>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Gəmi İzləmə</h3>
            <p className="text-sm text-gray-500">Gəmi ilə yüklənməni izləyin</p>
          </div>
          <a
            href={tracking.ship}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İzlə
            <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default Tracking; 