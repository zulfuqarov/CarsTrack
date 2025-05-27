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
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import API_ENDPOINTS from '../config/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    inTransit: 0,
    arrived: 0,
    sold: 0,
    recentCustomers: [],
  });

  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CUSTOMERS.LIST);
      const customers = response.data;

      // Calculate statistics
      const stats = {
        totalCustomers: customers.length,
        inTransit: customers.filter(c => c.car?.status === 'in_transit').length,
        arrived: customers.filter(c => c.car?.status === 'arrived').length,
        sold: customers.filter(c => c.car?.status === 'sold').length,
        recentCustomers: customers.slice(0, 5), // Get 5 most recent customers
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

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
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 'none',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              Ümumi Müştərilər
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main
              }}
            >
              {stats.totalCustomers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 'none',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.info.main, 0.05),
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              Yolda Olanlar
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.info.main
              }}
            >
              {stats.inTransit}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 'none',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.success.main, 0.05),
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              Çatanlar
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.success.main
              }}
            >
              {stats.arrived}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 'none',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              Satılanlar
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.warning.main
              }}
            >
              {stats.sold}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 'none',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
              Son Əlavə Olunan Müştərilər
            </Typography>

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
                {stats.recentCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.customerId}</TableCell>
                    <TableCell>{customer.name}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 