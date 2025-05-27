import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import API_ENDPOINTS from '../config/api';

function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    car: {
      year: '',
      make: '',
      model: '',
      vin: '',
      containerNumber: '',
      portOfLoading: '',
      loadingDate: '',
      openingDate: '',
      trackingLinks: {
        carrier: '',
        ship: '',
      },
      status: 'pending',
    },
    images: {
      auction: [],
      americanDepot: [],
      containerLoading: [],
      containerUnloading: [],
      bakuRoad: [],
      bakuCustoms: [],
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingImages, setPendingImages] = useState({
    auction: [],
    americanDepot: [],
    containerLoading: [],
    containerUnloading: [],
    bakuRoad: [],
    bakuCustoms: [],
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_ENDPOINTS.CUSTOMERS.GET_ONE(id));
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Müştəri məlumatları alınarkən xəta baş verdi');
      }

      const customerData = response.data.data;
      
      // Format dates to YYYY-MM-DD
      if (customerData.car.loadingDate) {
        customerData.car.loadingDate = new Date(customerData.car.loadingDate).toISOString().split('T')[0];
      }
      if (customerData.car.openingDate) {
        customerData.car.openingDate = new Date(customerData.car.openingDate).toISOString().split('T')[0];
      }

      // Ensure all required fields are present
      const formattedData = {
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        car: {
          year: customerData.car?.year || '',
          make: customerData.car?.make || '',
          model: customerData.car?.model || '',
          vin: customerData.car?.vin || '',
          containerNumber: customerData.car?.containerNumber || '',
          portOfLoading: customerData.car?.portOfLoading || '',
          loadingDate: customerData.car?.loadingDate || '',
          openingDate: customerData.car?.openingDate || '',
          trackingLinks: {
            carrier: customerData.car?.trackingLinks?.carrier || '',
            ship: customerData.car?.trackingLinks?.ship || '',
          },
          status: customerData.car?.status || 'pending',
        },
        images: {
          auction: customerData.images?.auction || [],
          americanDepot: customerData.images?.americanDepot || [],
          containerLoading: customerData.images?.containerLoading || [],
          containerUnloading: customerData.images?.containerUnloading || [],
          bakuRoad: customerData.images?.bakuRoad || [],
          bakuCustoms: customerData.images?.bakuCustoms || [],
        },
      };
      
      setFormData(formattedData);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError(error.response?.data?.message || 'Müştəri məlumatları yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('trackingLinks.')) {
      const [, linkType] = name.split('.');
      setFormData(prev => ({
        ...prev,
        car: {
          ...prev.car,
          trackingLinks: {
            ...prev.car.trackingLinks,
            [linkType]: value,
          },
        },
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e, category) => {
    const files = Array.from(e.target.files);
    
    // Create temporary URLs for preview
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPendingImages(prev => ({
      ...prev,
      [category]: [...prev[category], ...newImages]
    }));
  };

  const handleRemoveImage = (category, index, isPending = false) => {
    if (isPending) {
      setPendingImages(prev => ({
        ...prev,
        [category]: prev[category].filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: prev.images[category].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const uploadImagesToCloudinary = async (images, category) => {
    const formData = new FormData();
    images.forEach(({ file }) => {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const newFile = new File([file], cleanFileName, { type: file.type });
      formData.append('images', newFile);
    });

    try {
      const response = await axios.post(API_ENDPOINTS.UPLOAD.IMAGE(category), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.urls && response.data.urls.length > 0) {
        return response.data.urls;
      } else {
        throw new Error('No URLs returned from server');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload all pending images first
      const uploadedUrls = {};
      for (const category of Object.keys(pendingImages)) {
        if (pendingImages[category].length > 0) {
          const urls = await uploadImagesToCloudinary(pendingImages[category], category);
          uploadedUrls[category] = urls;
        }
      }

      // Combine existing and new images
      const finalFormData = {
        ...formData,
        images: {
          ...formData.images,
          ...Object.keys(uploadedUrls).reduce((acc, category) => ({
            ...acc,
            [category]: [...formData.images[category], ...uploadedUrls[category]]
          }), {})
        }
      };

      await axios.put(API_ENDPOINTS.CUSTOMERS.UPDATE(id), finalFormData);
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(error.response?.data?.message || 'Müştəri məlumatları yenilənərkən xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const imageCategories = [
    { key: 'auction', label: 'Auksion Şəkilləri' },
    { key: 'americanDepot', label: 'Amerika Deposu Şəkilləri' },
    { key: 'containerLoading', label: 'Konteynerə Yüklənmə Şəkilləri' },
    { key: 'containerUnloading', label: 'Konteyner Boşaldılma Şəkilləri' },
    { key: 'bakuRoad', label: 'Bakı Yol Şəkilləri' },
    { key: 'bakuCustoms', label: 'Bakı Gömrük Terminal Şəkilləri' },
  ];

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(pendingImages).forEach(images => {
        images.forEach(image => URL.revokeObjectURL(image.preview));
      });
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Müştəri Məlumatlarını Redaktə Et
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Müştəri məlumatlarını yeniləyin və ya düzəldin
        </Typography>
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 'none',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
        }}
      >
        {isSubmitting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
              borderRadius: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Grid container spacing={3}>
          {/* 1. Müştəri Məlumatları */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                borderRadius: 2,
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                1. Müştəri Məlumatları
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ad"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="E-poçt"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ünvan"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 2. Maşın Əsas Məlumatları */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                borderRadius: 2,
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.info.main, 0.02),
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                2. Maşın Əsas Məlumatları
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="İl"
                    name="car.year"
                    type="number"
                    value={formData.car.year}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Marka"
                    name="car.make"
                    value={formData.car.make}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Model"
                    name="car.model"
                    value={formData.car.model}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="VIN"
                    name="car.vin"
                    value={formData.car.vin}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="car.status"
                    select
                    value={formData.car.status}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="pending">Gözləyir</MenuItem>
                    <MenuItem value="in_transit">Yoldadır</MenuItem>
                    <MenuItem value="arrived">Çatıb</MenuItem>
                    <MenuItem value="sold">Satılıb</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 3. Daşıma Məlumatları */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                borderRadius: 2,
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.success.main, 0.02),
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                3. Daşıma Məlumatları
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Konteyner Nömrəsi"
                    name="car.containerNumber"
                    value={formData.car.containerNumber}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Yükləmə Limanı"
                    name="car.portOfLoading"
                    value={formData.car.portOfLoading}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Yükləmə Tarixi"
                      value={formData.car.loadingDate ? new Date(formData.car.loadingDate) : null}
                      onChange={(newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          car: {
                            ...prev.car,
                            loadingDate: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                          },
                        }));
                      }}
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Açılış Tarixi"
                      value={formData.car.openingDate ? new Date(formData.car.openingDate) : null}
                      onChange={(newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          car: {
                            ...prev.car,
                            openingDate: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                          },
                        }));
                      }}
                      minDate={formData.car.loadingDate ? new Date(formData.car.loadingDate) : new Date()}
                      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Daşıyıcı İzləmə Linki"
                    name="trackingLinks.carrier"
                    value={formData.car.trackingLinks.carrier}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Gəmi İzləmə Linki"
                    name="trackingLinks.ship"
                    value={formData.car.trackingLinks.ship}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 4. Şəkillər */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                borderRadius: 2,
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: alpha(theme.palette.warning.main, 0.02),
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                4. Şəkillər
              </Typography>

              <Grid container spacing={2}>
                {imageCategories.map((category) => (
                  <Grid item xs={12} key={category.key}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        borderColor: alpha(theme.palette.divider, 0.1),
                        position: 'relative',
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mb: 2,
                          fontWeight: 500,
                          color: theme.palette.text.primary
                        }}
                      >
                        {category.label}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        {/* Existing images */}
                        {formData.images[category.key].map((image, index) => (
                          <Box
                            key={`existing-${index}`}
                            sx={{
                              position: 'relative',
                              width: 150,
                              height: 150,
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                              border: `2px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <img
                              src={image}
                              alt={`${category.label} ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1,
                                background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.7)}, transparent)`,
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleImageClick(image)}
                                sx={{
                                  minWidth: 'auto',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: '0.75rem',
                                  bgcolor: alpha(theme.palette.common.white, 0.9),
                                  color: theme.palette.text.primary,
                                  '&:hover': {
                                    bgcolor: theme.palette.common.white,
                                  },
                                }}
                              >
                                Bax
                              </Button>
                              <IconButton
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.common.white, 0.9),
                                  '&:hover': {
                                    bgcolor: theme.palette.common.white,
                                  },
                                }}
                                onClick={() => handleRemoveImage(category.key, index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}

                        {/* Pending images */}
                        {pendingImages[category.key].map((image, index) => (
                          <Box
                            key={`pending-${index}`}
                            sx={{
                              position: 'relative',
                              width: 150,
                              height: 150,
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                              border: `2px solid ${theme.palette.warning.main}`,
                            }}
                          >
                            <img
                              src={image.preview}
                              alt={`Pending ${category.label} ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1,
                                background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.7)}, transparent)`,
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleImageClick(image.preview)}
                                sx={{
                                  minWidth: 'auto',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: '0.75rem',
                                  bgcolor: alpha(theme.palette.common.white, 0.9),
                                  color: theme.palette.text.primary,
                                  '&:hover': {
                                    bgcolor: theme.palette.common.white,
                                  },
                                }}
                              >
                                Bax
                              </Button>
                              <IconButton
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.common.white, 0.9),
                                  '&:hover': {
                                    bgcolor: theme.palette.common.white,
                                  },
                                }}
                                onClick={() => handleRemoveImage(category.key, index, true)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>

                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AddIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        Şəkil Əlavə Et
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, category.key)}
                        />
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* 5. Form Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/customers')}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderColor: alpha(theme.palette.text.primary, 0.3),
                  color: theme.palette.text.primary,
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                    bgcolor: alpha(theme.palette.text.primary, 0.05),
                  },
                }}
              >
                Ləğv Et
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    bgcolor: alpha(theme.palette.primary.main, 0.9),
                  },
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Yüklənir...
                  </Box>
                ) : (
                  'Yadda Saxla'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: alpha(theme.palette.common.white, 0.9),
              '&:hover': {
                bgcolor: theme.palette.common.white,
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default EditCustomer; 