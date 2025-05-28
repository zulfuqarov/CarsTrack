import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  GlobeAltIcon,
  TrophyIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    {
      icon: <UserGroupIcon className="h-8 w-8 text-blue-600" />,
      value: '1000+',
      label: 'Məmnun Müştəri',
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-blue-600" />,
      value: '50+',
      label: 'Ölkə',
    },
    {
      icon: <TrophyIcon className="h-8 w-8 text-blue-600" />,
      value: '10+',
      label: 'İl Təcrübə',
    },
    {
      icon: <HeartIcon className="h-8 w-8 text-blue-600" />,
      value: '99%',
      label: 'Məmnuniyyət',
    },
  ];

  const team = [
    {
      name: 'Əli Məmmədov',
      position: 'CEO',
      image: '/team/ceo.jpg',
    },
    {
      name: 'Ayşə Əliyeva',
      position: 'CTO',
      image: '/team/cto.jpg',
    },
    {
      name: 'Məhəmməd Həsənov',
      position: 'Müştəri Xidmətləri Müdiri',
      image: '/team/customer-service.jpg',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4"
        >
          Haqqımızda
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          CarTrack - Avtomobil izləmə sistemləri sahəsində lider şirkət
        </motion.p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">{stat.icon}</div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Bizim Hekayəmiz</h2>
          <p className="text-gray-600 mb-4">
            2014-cü ildə yaradılan CarTrack, avtomobil izləmə sistemləri sahəsində innovativ həllər təqdim edən lider şirkətdir. Bizim missiyamız müştərilərimizə ən yaxşı xidməti təqdim etmək və avtomobil izləmə prosesini asanlaşdırmaqdır.
          </p>
          <p className="text-gray-600">
            Bu gün CarTrack, dünyanın 50-dən çox ölkəsində fəaliyyət göstərir və minlərlə məmnun müştəriyə xidmət edir. Biz daim yeni texnologiyaları tətbiq edərək və müştəri təcrübəsini təkmilləşdirərək öz liderliyimizi möhkəmləndiririk.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-96"
        >
          <img
            src="/about/office.jpg"
            alt="CarTrack Office"
            className="rounded-lg object-cover w-full h-full"
          />
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Komandamız</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600">{member.position}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-12">Dəyərlərimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Müştəri Məmnuniyyəti</h3>
            <p className="text-gray-600">
              Müştərilərimizin məmnuniyyəti bizim ən yüksək prioritetimizdir. Hər zaman ən yaxşı xidməti təqdim etməyə çalışırıq.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">İnnovasiya</h3>
            <p className="text-gray-600">
              Daim yeni texnologiyaları tətbiq edərək və proseslərimizi təkmilləşdirərək irəliləyiş edirik.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">Etibarlılıq</h3>
            <p className="text-gray-600">
              Müştərilərimizə qarşı şəffaf və etibarlı münasibət qururuq. Hər zaman öz vədələrimizi yerinə yetiririk.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About; 