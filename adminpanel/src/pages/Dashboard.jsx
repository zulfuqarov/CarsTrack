import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    inTransit: 0,
    arrived: 0,
    sold: 0,
  });
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      const customers = response.data;

      // Calculate statistics
      const stats = {
        totalCustomers: customers.length,
        inTransit: customers.filter(c => c.car?.status === 'in_transit').length,
        arrived: customers.filter(c => c.car?.status === 'arrived').length,
        sold: customers.filter(c => c.car?.status === 'sold').length,
      };

      setStats(stats);
      setRecentCustomers(customers.slice(0, 5)); // Get 5 most recent customers
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Ümumi Müştərilər</Typography>
            <Typography variant="h4">{stats.totalCustomers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Yolda Olanlar</Typography>
            <Typography variant="h4">{stats.inTransit}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Çatanlar</Typography>
            <Typography variant="h4">{stats.arrived}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Satılanlar</Typography>
            <Typography variant="h4">{stats.sold}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Son Əlavə Olunan Müştərilər
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Müştəri ID</TableCell>
                    <TableCell>Ad</TableCell>
                    <TableCell>Maşın</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>{customer.customerId}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>
                        {customer.car?.make} {customer.car?.model}
                      </TableCell>
                      <TableCell>{customer.car?.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 