import { motion } from 'framer-motion';
import {
  TruckIcon,
  MapIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <TruckIcon className="h-12 w-12 text-blue-600" />,
      title: 'Real-time İzləmə',
      description: 'Avtomobilinizin cari statusunu real vaxtda izləyin. Hər addımda məlumatlı olun.',
      features: [
        'Real vaxtda status yeniləmələri',
        'Detallı izləmə məlumatları',
        'Mobil cihazlardan giriş',
      ],
    },
    {
      icon: <MapIcon className="h-12 w-12 text-blue-600" />,
      title: 'Xəritə İzləmə',
      description: 'Avtomobilinizin cari məkanını xəritədə görün və hərəkətini izləyin.',
      features: [
        'İnteraktiv xəritə',
        'Məkan təyin etmə',
        'Hərəkət tarixçəsi',
      ],
    },
    {
      icon: <ShieldCheckIcon className="h-12 w-12 text-blue-600" />,
      title: 'Təhlükəsizlik',
      description: 'Məlumatlarınız tam təhlükəsizlik altındadır. Şəxsi məlumatlarınız qorunur.',
      features: [
        'SSL şifrələmə',
        'İki faktorlu autentifikasiya',
        'Məlumatların qorunması',
      ],
    },
    {
      icon: <ClockIcon className="h-12 w-12 text-blue-600" />,
      title: '24/7 Dəstək',
      description: 'Hər zaman bizimlə əlaqə saxlaya bilərsiniz. Dəstək komandamız həmişə hazırdır.',
      features: [
        '24/7 dəstək xidməti',
        'Ekspres cavab',
        'Professional kömək',
      ],
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-600" />,
      title: 'Müştəri Xidmətləri',
      description: 'Müştəri xidmətlərimiz həftənin 7 günü, 24 saat fəaliyyətdədir.',
      features: [
        'Onlayn chat',
        'Email dəstəyi',
        'Telefon dəstəyi',
      ],
    },
    {
      icon: <DocumentTextIcon className="h-12 w-12 text-blue-600" />,
      title: 'Sənədlərin İdarə Edilməsi',
      description: 'Bütün sənədlərinizi bir yerdə idarə edin və asanlıqla əldə edin.',
      features: [
        'Rəqəmsal sənədlər',
        'Sənəd arxivləri',
        'Asan əldə etmə',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4"
        >
          Xidmətlərimiz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Avtomobilinizin izlənməsi üçün bütün lazımi xidmətləri təqdim edirik
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <div className="flex justify-center mb-6">{service.icon}</div>
            <h3 className="text-xl font-semibold text-center mb-4">{service.title}</h3>
            <p className="text-gray-600 text-center mb-6">{service.description}</p>
            <ul className="space-y-3">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 text-blue-600 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Xidmətlərimizdən İstifadə Edin</h2>
        <p className="text-lg mb-6">
          Avtomobilinizin izlənməsi üçün bizimlə əlaqə saxlayın
        </p>
        <Link
          to="/contact"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 ">
          Əlaqə
        </Link>
      </motion.div>
    </div>
  );
};

export default Services; 