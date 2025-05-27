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
} from '@mui/material';
import { Edit as EditIcon, Image as ImageIcon } from '@mui/icons-material';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Müştərilər</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/customers/add')}
        >
          Yeni Müştəri
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Müştəri ID</TableCell>
              <TableCell>Ad</TableCell>
              <TableCell>Email</TableCell>
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
                <TableCell>{customer.car.status}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewImages(customer)}
                      title="Şəkillərə Bax"
                    >
                      <ImageIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/customers/edit/${customer._id}`)}
                      title="Redaktə Et"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCustomer?.name} - Şəkillər
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {imageCategories.map((category) => (
                <Box key={category.key}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
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