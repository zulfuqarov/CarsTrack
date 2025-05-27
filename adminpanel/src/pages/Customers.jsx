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
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Image as ImageIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import API_ENDPOINTS from '../config/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CUSTOMERS.LIST);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
          onClick={() => navigate('/customers/add')}
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
                <TableCell>Müştəri ID</TableCell>
                <TableCell>Ad</TableCell>
                <TableCell>E-poçt</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Maşın</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.customerId}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.car.year} {customer.car.make} {customer.car.model}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        customer.car.status === 'pending'
                          ? 'Gözləyir'
                          : customer.car.status === 'in_transit'
                          ? 'Yoldadır'
                          : customer.car.status === 'arrived'
                          ? 'Çatıb'
                          : 'Satılıb'
                      }
                      color={
                        customer.car.status === 'pending'
                          ? 'default'
                          : customer.car.status === 'in_transit'
                          ? 'info'
                          : customer.car.status === 'arrived'
                          ? 'success'
                          : 'warning'
                      }
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/customers/edit/${customer._id}`)}
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
                      Redaktə Et
                    </Button>
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