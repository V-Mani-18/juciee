import React, { useState, useEffect } from 'react';
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
import { useRef } from 'react';

const SearchPage = () => {
  // Use localStorage to persist recent searches
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState({});
  const [lastLoginUsers, setLastLoginUsers] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    // Load from localStorage if available
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Add user to recent searches when "Add Friend" is clicked
  const handleAddFriend = (userId) => {
    setFriendRequests((prev) => ({ ...prev, [userId]: true }));
    // Try to find user object from filteredUsers or lastLoginUsers
    const user =
      filteredUsers.find(u => u._id === userId) ||
      lastLoginUsers.find(u => u._id === userId);
    if (user) {
      setRecentSearches(prev => {
        // Remove if already present, then add to front
        const filtered = prev.filter(u => u._id !== userId);
        const updated = [user, ...filtered];
        return updated.slice(0, 5); // Keep only last 5
      });
    }
    // Optionally: send friend request to backend here
  };

  // Remove from recent searches by userId
  const handleRemoveRecent = (userId) => {
    setRecentSearches((prev) => prev.filter((u) => u._id !== userId));
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

  // Fetch last 20 (desktop) or 15 (mobile) registered users from backend
  useEffect(() => {
    const fetchLastLogins = async () => {
      try {
        const limit = isMobile ? 15 : 20;
        const res = await fetch(`http://localhost:5000/api/last-logins?limit=${limit}`);
        const data = await res.json();
        setLastLoginUsers(data);
      } catch (error) {
        setLastLoginUsers([]);
      }
    };
    fetchLastLogins();
    // eslint-disable-next-line
  }, [isMobile]);

  // Save recentSearches to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden', // Prevent outer scroll
        p: 0,
        m: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : 1000,
          mx: 'auto',
          bgcolor: 'transparent',
          borderRadius: 0,
          boxShadow: 'none',
          p: isMobile ? 0 : 3,
          minHeight: isMobile ? 'auto' : 500,
          transition: 'all 0.2s',
          overflow: 'hidden',
          mt: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Make only this Box scrollable */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
          }}
        >
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, mt: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearch('')}
                    edge="end"
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 8,
                bgcolor: '#fcecec',
              }
            }}
          />

          {/* Search Results - show at top */}
          {search.trim() !== '' && (
            <Box sx={{ width: '100%', mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#888', fontWeight: 500 }}>
                Search Results
              </Typography>
              {filteredUsers.length > 0 ? (
                <List>
                  {filteredUsers.map((user, idx) => (
                    <ListItem key={user._id} sx={{ px: 1 }} secondaryAction={
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
            </Box>
          )}

          {/* Recent Searches - show below search results */}
          {recentSearches.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#888', fontWeight: 500 }}>
                Recent Searches
              </Typography>
              <List sx={{ maxWidth: 400, width: '100%' }}>
                {recentSearches.map((user, idx) => (
                  <ListItem
                    key={user._id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveRecent(user._id)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePic || `https://i.pravatar.cc/150?u=${user._id}`} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{user.username}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* SUGGESTIONS always at bottom */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                color: '#888',
                fontWeight: 500,
                display: 'block'
              }}
            >
              {isMobile ? 'SUGGESTIONS' : 'SUGGESTIONS'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                overflowX: 'auto',
                pb: 1,
                maxWidth: '100%',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
              }}
            >
              {/* Split users into rows */}
              {(() => {
                const usersPerRow = isMobile ? 6 : 10;
                const rows = [];
                for (let i = 0; i < lastLoginUsers.length; i += usersPerRow) {
                  rows.push(lastLoginUsers.slice(i, i + usersPerRow));
                }
                return rows.map((row, rowIdx) => (
                  <Box
                    key={rowIdx}
                    sx={{
                      display: 'flex',
                      gap: 3,
                      justifyContent: isMobile ? 'flex-start' : 'center',
                      width: '100%',
                      overflowX: isMobile ? 'auto' : 'visible',
                      mb: rowIdx !== rows.length - 1 ? 2.5 : 0
                    }}
                  >
                    {row.map((user) => (
                      <Box
                        key={user._id}
                        sx={{
                          minWidth: 90,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          bgcolor: '#fff',
                          borderRadius: 2,
                          boxShadow: 1,
                          p: 1,
                          flex: '0 0 auto'
                        }}
                      >
                        <Avatar
                          src={user.profilePic || `https://i.pravatar.cc/150?u=${user._id}`}
                          sx={{ width: 48, height: 48, mb: 1 }}
                        />
                        <Typography
                          fontWeight={600}
                          fontSize={13}
                          sx={{
                            textAlign: 'center',
                            mb: 1,
                            maxWidth: 70,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {user.username}
                        </Typography>
                        {!friendRequests[user._id] ? (
                          <button
                            style={{
                              backgroundColor: '#f06292',
                              border: 'none',
                              color: 'white',
                              fontWeight: 500,
                              borderRadius: '20px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                            onClick={() => handleAddFriend(user._id)}
                          >
                            Add Friend
                          </button>
                        ) : (
                          <button
                            style={{
                              backgroundColor: '#f06292',
                              border: 'none',
                              color: 'white',
                              fontWeight: 500,
                              borderRadius: '20px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                            onClick={() => handleCancelRequest(user._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </Box>
                    ))}
                  </Box>
                ));
              })()}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
