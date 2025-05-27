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
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (name.includes('trackingLinks.')) {
      const [, linkType] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        car: {
          ...prev.car,
          trackingLinks: {
            ...prev.car.trackingLinks,
            [linkType]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
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
      const response = await axios.post(`http://localhost:5000/api/upload/${category}`, formData, {
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
      await axios.put(`http://localhost:5000/api/customers/${id}`, formData);
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
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
      <Typography variant="h4" sx={{ mb: 3 }}>
        Müştəri Məlumatlarını Düzəliş Et
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Müştəri Məlumatları
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ad"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Maşın Məlumatları
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="İl"
                name="car.year"
                type="number"
                value={formData.car.year}
                onChange={handleChange}
                required
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
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Konteyner Nömrəsi"
                name="car.containerNumber"
                value={formData.car.containerNumber}
                onChange={handleChange}
                required
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
              >
                <MenuItem value="pending">Gözləyir</MenuItem>
                <MenuItem value="in_transit">Yoldadır</MenuItem>
                <MenuItem value="arrived">Çatıb</MenuItem>
                <MenuItem value="sold">Satılıb</MenuItem>
              </TextField>
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
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Şəkillər
              </Typography>
            </Grid>

            {imageCategories.map((category) => (
              <Grid item xs={12} key={category.key}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
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
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={() => handleRemoveImage(category.key, index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddIcon />}
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

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/customers')}
                >
                  Ləğv Et
                </Button>
                <Button type="submit" variant="contained">
                  Yadda Saxla
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default EditCustomer; 