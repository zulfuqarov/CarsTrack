import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, TruckIcon, MapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Müştəri ID-ni daxil edin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Axtarış başladı:', searchQuery);
      const response = await axios.get(`https://api.autonex360.online/api/customers/customerId/${searchQuery}`);
      console.log('API cavabı:', response.data);

      if (response.data) {
        // Məlumatları localStorage-də saxlayırıq
        localStorage.setItem('customerData', JSON.stringify(response.data));
        console.log('Məlumatlar localStorage-də saxlandı');
        // Avtomobillər səhifəsinə yönləndiririk
        navigate('/cars');
      } else {
        setError('Müştəri məlumatı tapılmadı');
      }
    } catch (err) {
      console.error('API xətası:', err);
      if (err.response) {
        // Server xətası
        setError(err.response.data.message || 'Müştəri tapılmadı');
      } else if (err.request) {
        // Serverə qoşulma xətası
        setError('Serverə qoşulma xətası. Zəhmət olmasa daha sonra yenidən cəhd edin.');
      } else {
        // Digər xətalar
        setError('Xəta baş verdi. Zəhmət olmasa daha sonra yenidən cəhd edin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    console.log('Klaviatura düyməsi basıldı:', e.key);
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const features = [
    {
      icon: <TruckIcon className="h-8 w-8 text-blue-600" />,
      title: 'Real-time İzləmə',
      description: 'Avtomobilinizin cari statusunu real vaxtda izləyin',
    },
    {
      icon: <MapIcon className="h-8 w-8 text-blue-600" />,
      title: 'Xəritə İzləmə',
      description: 'Avtomobilinizin cari məkanını xəritədə görün',
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-blue-600" />,
      title: 'Təhlükəsizlik',
      description: 'Məlumatlarınız tam təhlükəsizlik altındadır',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://i.hizliresim.com/tecn3xb.png")',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Avtomobilinizi İzləyin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            Real vaxtda avtomobilinizin statusunu izləyin
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center bg-white rounded-lg p-2">
              <input
                type="text"
                placeholder="Müştəri ID-ni daxil edin"
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                // onClick={() => {
                //   handleSearch()
                // }}
              />
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <MagnifyingGlassIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Xidmətlərimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-8 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Aktiv Müştəri</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">İzlənən Avtomobil</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Dəstək</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-gray-600">Məmnuniyyət</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Həmişə Əlaqədə Olun</h2>
          <p className="text-xl mb-8">
            Avtomobilinizin statusunu izləmək üçün bizimlə əlaqə saxlayın
          </p>
          <Link
          to="/contact"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Əlaqə
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 