import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import API_ENDPOINTS from '../config/api';

function AddCustomer() {
  const navigate = useNavigate();
  const theme = useTheme();
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
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(API_ENDPOINTS.UPLOAD.IMAGE(category), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: [...prev.images[category], ...response.data.urls],
        },
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(error.response?.data?.message || 'Şəkil yükləmə zamanı xəta baş verdi');
    }
  };

  const handleRemoveImage = (category, index) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [category]: prev.images[category].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_ENDPOINTS.CUSTOMERS.CREATE, formData);
      navigate('/customers');
    } catch (error) {
      console.error('Error adding customer:', error);
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

  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        Yeni Müştəri Əlavə Et
      </Typography>

      <Paper 
        sx={{ 
          p: 3,
          borderRadius: 2,
          boxShadow: 'none',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <form onSubmit={handleSubmit}>
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
                    <TextField
                      fullWidth
                      label="Yükləmə Tarixi"
                      name="car.loadingDate"
                      type="date"
                      value={formData.car.loadingDate}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
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
                      label="Açılış Tarixi"
                      name="car.openingDate"
                      type="date"
                      value={formData.car.openingDate}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
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
                          {formData.images[category.key].map((image, index) => (
                            <Box
                              key={index}
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
                  Yadda Saxla
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
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

export default AddCustomer; 