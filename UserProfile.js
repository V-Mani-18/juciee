import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper
} from '@mui/material';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));

    if (!localUser || !localUser._id) {
      alert("User not logged in");
      return;
    }

    fetch(`/api/user/${localUser._id}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Typography variant="h6" color="error" align="center">
        Could not load user profile.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80 }}>
            {userData.name?.[0]}
          </Avatar>
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          {userData.name}
        </Typography>

        <Typography><strong>Email:</strong> {userData.email}</Typography>
        <Typography><strong>Phone:</strong> {userData.phone}</Typography>
        <Typography><strong>Gender:</strong> {userData.gender}</Typography>
      </Paper>
    </Box>
  );
};

export default UserProfile;
