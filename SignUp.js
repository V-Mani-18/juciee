import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AnimatedTitle from './AnimatedTitle';

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff8f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: `'Poppins', sans-serif`,
      }}
    >
      <Box
        sx={{
          width: isMobile ? '90%' : '360px',
          bgcolor: '#fff',
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <AnimatedTitle sx={{ mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            sx={{
              mb: 2,
              backgroundColor: '#f8eaea',
              borderRadius: 2,
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{
              mb: 2,
              backgroundColor: '#f8eaea',
              borderRadius: 2,
            }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            sx={{
              mb: 2,
              backgroundColor: '#f8eaea',
              borderRadius: 2,
            }}
          />
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{
              mb: 2,
              backgroundColor: '#f8eaea',
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            sx={{
              mb: 2,
              backgroundColor: '#f8eaea',
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth sx={{ mb: 3, textAlign: 'left' }}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              sx={{
                backgroundColor: '#f8eaea',
                borderRadius: 2,
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#ef1c1c',
              color: '#fff',
              borderRadius: 100,
              py: 1.2,
              fontWeight: 'bold',
              fontSize: '1rem',
              mb: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#d91414',
              },
            }}
          >
            Register
          </Button>
        </form>

        <Typography sx={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span
            style={{
              fontWeight: 'bold',
              color: '#000',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={() => navigate('/')}
          >
            Sign In
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
