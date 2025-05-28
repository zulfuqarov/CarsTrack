import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form göndərmə məntiqi burada olacaq
    console.log('Form data:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const contactInfo = [
    {
      icon: <PhoneIcon className="h-6 w-6 text-blue-600" />,
      title: 'Telefon',
      content: '+994 50 123 45 67',
    },
    {
      icon: <EnvelopeIcon className="h-6 w-6 text-blue-600" />,
      title: 'Email',
      content: 'info@cartrack.az',
    },
    {
      icon: <MapPinIcon className="h-6 w-6 text-blue-600" />,
      title: 'Ünvan',
      content: 'Bakı şəhəri, Nərimanov rayonu',
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-blue-600" />,
      title: 'İş Saatları',
      content: 'Bazar ertəsi - Şənbə: 09:00 - 18:00',
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
          Bizimlə Əlaqə
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Suallarınız və təklifləriniz üçün bizimlə əlaqə saxlaya bilərsiniz
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Mesaj Göndərin</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Mövzu
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Göndər
            </button>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  {info.icon}
                  <h3 className="text-lg font-semibold ml-3">{info.title}</h3>
                </div>
                <p className="text-gray-600">{info.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4283901491!2d49.8517568!3d40.3771909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d079efb5163%3A0xc20aa51a5f0b5e01!2sNarimanov%20district%2C%20Baku!5e0!3m2!1sen!2saz!4v1647881234567!5m2!1sen!2saz"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Sosial Media</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Twitter
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 