import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  alpha,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Image as ImageIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import API_ENDPOINTS from '../config/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_ENDPOINTS.CUSTOMERS.LIST);
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Müştərilər yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewImages = (customer) => {
    setSelectedCustomer(customer);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedCustomer(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_transit':
        return 'info';
      case 'arrived':
        return 'success';
      case 'sold':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Gözləyir';
      case 'in_transit':
        return 'Yoldadır';
      case 'arrived':
        return 'Çatıb';
      case 'sold':
        return 'Satılıb';
      default:
        return status;
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

  const handleDelete = async (id) => {
    if (!window.confirm('Bu müştərini silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(API_ENDPOINTS.CUSTOMERS.DELETE(id));
      setCustomers(customers.filter(customer => customer._id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Müştəri silinərkən xəta baş verdi');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Müştərilər
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-customer')}
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
          Yeni Müştəri
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
            },
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: 'none',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Maşın</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.car?.year} {customer.car?.make} {customer.car?.model}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(customer.car?.status)}
                      color={getStatusColor(customer.car?.status)}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewImages(customer)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ImageIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/edit-customer/${customer._id}`)}
                        sx={{
                          color: theme.palette.info.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(customer._id)}
                        disabled={deletingId === customer._id}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        {deletingId === customer._id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          pb: 2,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedCustomer?.name} - Şəkillər
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedCustomer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {imageCategories.map((category) => (
                <Box key={category.key}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {category.label}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {selectedCustomer.images[category.key].map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 200,
                          height: 200,
                          position: 'relative',
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
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
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Customers; 