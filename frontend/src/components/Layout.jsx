import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Ana Səhifə', path: '/' },
    { name: 'Avtomobillər', path: '/cars' },
    { name: 'Xidmətlər', path: '/services' },
    { name: 'Haqqımızda', path: '/about' },
    { name: 'Əlaqə', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="CarTrack" className="h-10 w-auto" />
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                CarTrack
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : isScrolled
                      ? 'text-gray-600 hover:text-blue-600'
                      : 'text-white hover:text-blue-200'
                  } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Giriş
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4"
              >
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${
                        location.pathname === item.path
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      } hover:text-blue-600 transition-colors duration-200`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Giriş
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CarTrack</h3>
              <p className="text-gray-400">
                Avtomobilinizin statusunu izləyin və bütün məlumatlara rahat şəkildə çatın.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sürətli Linklər</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Əlaqə</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@cartrack.az</li>
                <li>Telefon: +994 50 123 45 67</li>
                <li>Ünvan: Bakı şəhəri, Nərimanov rayonu</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Bizi İzləyin</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarTrack. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 