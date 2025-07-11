import React, { useState,useEffect } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  InputAdornment,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const dummyUsers = [
  { name: 'Sophia', image: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Ethan', image: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Olivia', image: 'https://i.pravatar.cc/150?img=13' },
  { name: 'Noah', image: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Ava', image: 'https://i.pravatar.cc/150?img=15' },
];

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['Sophia', 'Noah','manish', 'Ethan', 'Olivia']);
  const [friendRequests, setFriendRequests] = useState({}); // Track request state per user
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  
  const handleRemoveRecent = (name) => {
    setRecentSearches((prev) => prev.filter((item) => item !== name));
  };

  const handleAddFriend = (userId) => {
    setFriendRequests((prev) => ({ ...prev, [userId]: true }));
    // Optionally: send friend request to backend here
  };

  const handleCancelRequest = (userId) => {
    setFriendRequests((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
    // Optionally: cancel friend request in backend here
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim() === '') return;

      try {
       const res = await fetch(`http://localhost:5000/api/users/search?q=${search}`);
 // changed from /api/users/search
        const data = await res.json();
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, [search]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : '70%',
          maxWidth: 1000,
        }}
      >
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 8,
              bgcolor: '#fcecec',
            }
          }}
        />

        {search.trim() === '' && recentSearches.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#888', fontWeight: 500 }}>
              Recent Searches
            </Typography>
            <List>
              {recentSearches.map((name, idx) => {
                const user = dummyUsers.find((u) => u.name === name);
                return (
                  <ListItem
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveRecent(name)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user?.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{name}</Typography>}
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
        )}

        {search.trim() !== '' && (
          <>
            {filteredUsers.length > 0 ? (
             <List>
  {filteredUsers.map((user, idx) => (
    <ListItem key={idx} sx={{ px: 1 }} secondaryAction={
      <Box>
        {!friendRequests[user._id] ? (
          <button
            style={{
              backgroundColor: '#f06292',
              border: 'none',
              color: 'white',
              fontWeight: 500,
              borderRadius: '20px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
            onClick={() => handleAddFriend(user._id)}
          >
            Add Friend
          </button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #f06292',
                color: '#f06292',
                fontWeight: 500,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'default',
                fontSize: '0.85rem'
              }}
              disabled
            >
              Requested
            </button>
            <button
              style={{
                backgroundColor: '#f06292',
                border: 'none',
                color: 'white',
                fontWeight: 500,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
              onClick={() => handleCancelRequest(user._id)}
            >
              Cancel
            </button>
          </Box>
        )}
      </Box>
    }>
      <ListItemAvatar>
        <Avatar src={user.profilePic || `https://i.pravatar.cc/150?u=${user._id}`} />
      </ListItemAvatar>
      <ListItemText primary={<Typography fontWeight={600}>{user.username}</Typography>} />
    </ListItem>
  ))}
</List>


            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No users found for "{search.trim()}".
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
