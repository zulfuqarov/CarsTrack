import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from "../assets/logo.png"
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Ana Səhifə' },
    { path: '/cars', label: 'Avtomobillər' },
    { path: '/services', label: 'Xidmətlər' },
    { path: '/about', label: 'Haqqımızda' },
    { path: '/contact', label: 'Əlaqə' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                <img src={Logo} alt="CarsTrack Logo" className="h-[120px] w-auto" />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                      location.pathname === link.path ? 'text-blue-600 font-semibold' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                <img src={Logo} alt="CarsTrack Logo" className="h-[120px] w-auto" />
              </span>
            </Link>              <p className="text-gray-400">
                Avtomobilinizi real vaxtda izləyin və statusunu öyrənin.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sürətli Linklər</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Əlaqə</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@autonex360.online</li>
                <li>Tel: +994 70 966 81 11</li>
                <li>Tel: +994 70 964 64 66</li>
                <li>Ünvan: Bakı şəhəri,Bakıxanov qəs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Bizi İzləyin</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@autonex1?_t=ZS-8wlKcSIcXVH&_r=1"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AutoNex360. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 