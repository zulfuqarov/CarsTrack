import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş zamanı gözlənilməz xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Admin Girişi
          </Typography>

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

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-poçt"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Şifrə"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              error={!!error}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  bgcolor: alpha(theme.palette.primary.main, 0.9),
                },
                '&.Mui-disabled': {
                  bgcolor: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Daxil Ol'
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 