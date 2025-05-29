import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  TruckIcon, 
  MapIcon, 
  CalendarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClockIcon,
  LinkIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Cars = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const fetchCustomerData = async (customerId) => {
    try {
      const response = await axios.get(`https://api.autonex360.online/api/customers/customerId/${customerId}`);
      console.log('Yeni API məlumatları:', response.data);
      setCustomerData(response.data.data);
      localStorage.setItem('customerData', JSON.stringify(response.data));
    } catch (error) {
      console.error('API xətası:', error);
      setCustomerData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedData = localStorage.getItem('customerData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const customerId = parsedData.data.customerId;
        // Hər refresh zamanı yeni məlumatları gətir
        fetchCustomerData(customerId);
      } catch (error) {
        console.error('JSON parse xətası:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const statusColors = {
    'in_transit': 'bg-yellow-100 text-yellow-800',
    'delivered': 'bg-green-100 text-green-800',
    'pending': 'bg-blue-100 text-blue-800',
    'cancelled': 'bg-red-100 text-gray-800',
    'arrived': 'bg-green-100 text-green-800',
    'loading': 'bg-blue-100 text-blue-800',
    'unloading': 'bg-yellow-100 text-yellow-800'
  };

  const statusLabels = {
    'in_transit': 'Yoldadır',
    'delivered': 'Çatdırılıb',
    'pending': 'Gözləyir',
    'cancelled': 'Ləğv edilib',
    'arrived': 'Çatıb',
    'loading': 'Yüklənir',
    'unloading': 'Boşaldılır'
  };

  const imageCategories = {
    auction: 'Hərrac Şəkilləri',
    americanDepot: 'Amerika Deposu Şəkilləri',
    containerLoading: 'Konteyner Yükləmə Şəkilləri',
    containerUnloading: 'Konteyner Boşaltma Şəkilləri',
    bakuRoad: 'Bakı Yolu Şəkilləri',
    bakuCustoms: 'Bakı Gömrük Şəkilləri'
  };

  const handleImageClick = (category, imageUrl, index) => {
    const images = customerData.images[category] || [];
    const formattedImages = images.map(url => ({
      original: url,
      thumbnail: url,
    }));
    setGalleryImages(formattedImages);
    setCurrentCategory(category);
    setSelectedImage(true);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || !customerData.images) {
      console.log('No category or images available');
      return;
    }
    
    const images = customerData.images[currentCategory] || [];
    console.log('Current images:', images);
    console.log('Current index:', currentImageIndex);
    
    const nextIndex = (currentImageIndex + 1) % images.length;
    console.log('Next index:', nextIndex);
    
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (!currentCategory || !customerData.images) {
      console.log('No category or images available');
      return;
    }
    
    const images = customerData.images[currentCategory] || [];
    console.log('Current images:', images);
    console.log('Current index:', currentImageIndex);
    
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    console.log('Previous index:', prevIndex);
    
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentCategory(null);
    setGalleryImages([]);
  };

  const handleClearData = () => {
    localStorage.removeItem('customerData');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Müştəri məlumatı tapılmadı</h2>
          <p className="text-gray-600">Zəhmət olmasa ana səhifəyə qayıdın və müştəri ID-ni yenidən daxil edin.</p>
        </div>
      </div>
    );
  }

  // Status məlumatını yoxlayırıq
  console.log('Render zamanı status:', customerData.car.status);
  console.log('Status rəngi:', statusColors[customerData.car.status]);
  console.log('Status etiketi:', statusLabels[customerData.car.status]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Avtomobil İzləmə</h1>
            <p className="text-gray-600">Müştəri ID: {customerData.customerId}</p>
          </div>
          <button
            onClick={handleClearData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Təmizlə</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Avtomobil Statusu</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[customerData.car.status] || 'bg-gray-100 text-gray-800'
                }`}>
                  {statusLabels[customerData.car.status] || customerData.car.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Marka & Model</p>
                    <p className="font-semibold">{customerData.car.make} {customerData.car.model}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">İstehsal İli</p>
                    <p className="font-semibold">{customerData.car.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">VIN Kodu</p>
                    <p className="font-semibold">{customerData.car.vin || 'Məlumat yoxdur'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Konteyner Nömrəsi</p>
                    <p className="font-semibold">{customerData.car.containerNumber || 'Məlumat yoxdur'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gəmiçilik Məlumatları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Yükləmə Limanı</p>
                    <p className="font-semibold">{customerData.car.portOfLoading || 'Məlumat yoxdur'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Yükləmə Tarixi</p>
                    <p className="font-semibold">
                      {customerData.car.loadingDate ? new Date(customerData.car.loadingDate).toLocaleDateString() : 'Məlumat yoxdur'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Açılış Tarixi</p>
                    <p className="font-semibold">
                      {customerData.car.openingDate ? new Date(customerData.car.openingDate).toLocaleDateString() : 'Məlumat yoxdur'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Images Section */}
            {customerData.images && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Avtomobil Şəkilləri</h2>
                <div className="space-y-8">
                  {Object.entries(imageCategories).map(([category, title]) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
                      {customerData.images[category] && customerData.images[category].length > 0 ? (
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          spaceBetween={20}
                          slidesPerView={1}
                          navigation
                          pagination={{ clickable: true }}
                          // autoplay={{
                          //   delay: 3000,
                          //   disableOnInteraction: false,
                          // }}
                          breakpoints={{
                            640: {
                              slidesPerView: 2,
                            },
                            1024: {
                              slidesPerView: 3,
                            },
                          }}
                          className="w-full"
                        >
                          {customerData.images[category].map((image, index) => (
                            <SwiperSlide key={index}>
                              <div
                                className="relative aspect-[4/3] group cursor-pointer"
                                onClick={() => handleImageClick(category, image, index)}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="w-full h-full object-contain rounded-lg transition-all duration-300 group-hover:opacity-80 bg-gray-50"
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Şəkil mövcud deyil</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Tracking Links */}
          <div className="space-y-6">
            {/* Tracking Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">İzləmə Linkləri</h2>
              <div className="space-y-4">
                {customerData.car.trackingLinks?.carrier && (
                  <a
                    href={customerData.car.trackingLinks.carrier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Daşıyıcı İzləmə</p>
                        <p className="text-sm text-gray-600 mt-1">Avtomobilin daşıyıcı tərəfindən izlənməsi</p>
                      </div>
                    </div>
                  </a>
                )}
                {customerData.car.trackingLinks?.ship && (
                  <a
                    href={customerData.car.trackingLinks.ship}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Gəmi İzləmə</p>
                        <p className="text-sm text-gray-600 mt-1">Gəminin real vaxt izlənməsi</p>
                      </div>
                    </div>
                  </a>
                )}
                {(!customerData.car.trackingLinks?.carrier && !customerData.car.trackingLinks?.ship) && (
                  <p className="text-gray-500 text-center py-4">İzləmə linkləri mövcud deyil</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeModal}
          >
            <div className="relative w-[95%] max-w-6xl mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="absolute -top-16 left-0 text-left">
                <h3 className="text-xl font-semibold text-white">
                  {imageCategories[currentCategory]}
                </h3>
              </div>

              <button
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
                onClick={closeModal}
              >
                <XMarkIcon className="h-8 w-8" />
              </button>

              <div className="bg-white rounded-lg p-4">
                <style>
                  {`
                    .image-gallery-slide {
                      background: white;
                    }
                    .image-gallery-image {
                      max-height: 60vh;
                      object-fit: contain;
                    }
                    .image-gallery-thumbnail {
                      width: 80px;
                      height: 60px;
                    }
                    .image-gallery-thumbnail-image {
                      object-fit: cover;
                      height: 100%;
                    }
                    .image-gallery-thumbnails-container {
                      background: white;
                    }
                    .image-gallery-thumbnail.active {
                      border: 2px solid #2563eb;
                    }
                    .image-gallery-thumbnail:hover {
                      border: 2px solid #3b82f6;
                    }
                    .image-gallery-icon {
                      filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
                    }
                    .image-gallery-icon:hover {
                      color: #2563eb;
                    }
                  `}
                </style>
                <ImageGallery
                  items={galleryImages}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  showThumbnails={true}
                  thumbnailPosition="bottom"
                  slideInterval={0}
                  slideOnThumbnailOver={true}
                  additionalClass="custom-gallery"
                  showIndex={true}
                  showBullets={false}
                  lazyLoad={true}
                  useBrowserFullscreen={true}
                  renderCustomControls={() => (
                    <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                      {galleryImages.length} şəkil
                    </div>
                  )}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cars; 