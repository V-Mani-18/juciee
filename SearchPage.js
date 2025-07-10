import React, { useState } from 'react';
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
  const [recentSearches, setRecentSearches] = useState(['Sophia', 'Noah']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredUsers =
    search.trim() === ''
      ? dummyUsers.filter(user => recentSearches.includes(user.name))
      : dummyUsers.filter(user =>
          user.name.toLowerCase().includes(search.toLowerCase())
        );

  const handleRemoveRecent = (name) => {
    setRecentSearches((prev) => prev.filter((item) => item !== name));
  };

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
          width: isMobile ? '100%' : '50%',
          maxWidth: 600,
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
    <ListItem
      key={idx}
      sx={{ px: 1 }}
      secondaryAction={
        <Box>
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
            onClick={() => alert(`Friend request sent to ${user.name}`)}
          >
            Add Friend
          </button>
        </Box>
      }
    >
      <ListItemAvatar>
        <Avatar src={user.image} />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography fontWeight={600}>{user.name}</Typography>}
      />
    </ListItem>
  ))}
</List>

            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No users found.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
