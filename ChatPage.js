import React, { useState, useRef } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, List,
  ListItem, ListItemAvatar, ListItemText, Box, Paper, useMediaQuery,
  Button, BottomNavigation, BottomNavigationAction, Tooltip, TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon, ArrowBack as ArrowBackIcon, Settings as SettingsIcon,
  Phone as PhoneIcon, Chat as ChatIcon, AccountCircle as AccountCircleIcon,
  Mic as MicIcon, Send as SendIcon, Add as AddIcon,
  Image as ImageIcon, Description as DocumentIcon, Contacts as ContactIcon
} from '@mui/icons-material';
import call from './call'; // Assuming you have a separate call component
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AnimatedTitle from './AnimatedTitle';
import Settings from './Settings';
import SearchPage from './SearchPage';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import UserProfile from './UserProfile';
import NotificationsIcon from '@mui/icons-material/Notifications';







const chatMembers = [
  { name: 'Sophia', image: 'https://i.pravatar.cc/150?img=11', online: true },
  { name: 'Ethan', image: 'https://i.pravatar.cc/150?img=12', online: false },
  { name: 'Olivia', image: 'https://i.pravatar.cc/150?img=13', online: true },
  { name: 'Noah', image: 'https://i.pravatar.cc/150?img=14', online: false },
  { name: 'Ava', image: 'https://i.pravatar.cc/150?img=15', online: true },
  { name: 'Sophia', image: 'https://i.pravatar.cc/150?img=11', online: true },
  { name: 'Ethan', image: 'https://i.pravatar.cc/150?img=12', online: false },
  { name: 'Olivia', image: 'https://i.pravatar.cc/150?img=13', online: true },
  { name: 'Noah', image: 'https://i.pravatar.cc/150?img=14', online: false },
  { name: 'Ava', image: 'https://i.pravatar.cc/150?img=15', online: true },
];


const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [bottomNav, setBottomNav] = useState(0); // 0: Chats, 1: Call, 2: Profile, 3: Settings
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const showChatList = isMobile ? !selectedUser : true;
  const showChatPane = isMobile ? !!selectedUser : true;
  const [userProfile, setUserProfile] = useState(null);
  const [hasFriendRequest, setHasFriendRequest] = useState(false); // or false based on your logic


  const filteredMembers = chatMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    const now = new Date();
    const updatedMessages = { ...messages };
    const key = selectedUser.name;
    if (!updatedMessages[key]) updatedMessages[key] = [];

    updatedMessages[key].push({
      sender: 'You',
      text: message.trim(),
      timestamp: formatTime(now),
      date: formatDate(now),
    });

    setMessages(updatedMessages);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      // Start recording
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new window.MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      }
    } else {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendAudio = () => {
    if (audioBlob && selectedUser) {
      const key = selectedUser.name;
      const updatedMessages = { ...messages };
      if (!updatedMessages[key]) updatedMessages[key] = [];
      updatedMessages[key].push({
        sender: 'You',
        audio: URL.createObjectURL(audioBlob),
        timestamp: formatTime(new Date()),
        date: formatDate(new Date()),
      });
      setMessages(updatedMessages);
      setAudioBlob(null);
    }
  };

  
  return (
    <Box sx={{
      height: '100vh',
      bgcolor: '#fdf4f4',
      position: 'relative',
      fontFamily: `'Poppins', sans-serif`,
    }}>
      <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: 'none', borderBottom: '1px solid #f1dcdc' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <AnimatedTitle />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <IconButton onClick={() => alert("Check your friend requests!")}>
    <NotificationsIcon sx={{ color: hasFriendRequest ? '#ff69b4' : '#000' }} />
  </IconButton>

  <IconButton
    onClick={() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) return alert("User not logged in");

      setBottomNav(4);
      fetch(`/api/user/${user._id}`)
        .then(res => res.json())
        .then(data => setUserProfile(data))
        .catch(err => console.error("Error fetching user:", err));
    }}
  >
    <AccountCircleIcon sx={{ color: '#000' }} />
  </IconButton>
</Box>





        </Toolbar>
      </AppBar>

      <Box sx={{ height: isMobile ? 'calc(100vh - 64px - 56px)' : 'calc(100vh - 64px)', display: 'flex' }}>
        {/* Desktop vertical navigation */}
        {!isMobile && (
          <Box sx={{
            width: 80,
            bgcolor: '#fff',
            borderRight: '1px solid #f1dcdc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
            gap: 2,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
          }}>
            <IconButton
              color={bottomNav === 0 ? 'primary' : 'default'}
              onClick={() => { setBottomNav(0); setSelectedUser(null); }}
            >
              <ChatIcon />
            </IconButton>
            <IconButton
              color={bottomNav === 1 ? 'primary' : 'default'}
              onClick={() => { setBottomNav(1); setSelectedUser(null); }}
            >
              <PhoneIcon />
            </IconButton>
            <IconButton
  color={bottomNav === 2 ? 'primary' : 'default'}
  onClick={() => setBottomNav(2)}
>
  <SearchIcon />
</IconButton>

            <IconButton
              color={bottomNav === 3 ? 'primary' : 'default'}
              onClick={() => setBottomNav(3)}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        )}
        {/* Show Profile if Profile tab is selected */}
        {bottomNav === 2 ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 2 }}>
    <SearchPage />
  </Box>
) : bottomNav === 3 ? (
  <Settings onBack={() => setBottomNav(0)} />
) : bottomNav === 4 ? (
  <UserProfile />
) : bottomNav === 1 ? (
  // CALL LOGS TAB
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3.5 }}>
    {React.createElement(call)}
  </Box>
) : (
          <>
            {showChatList && (
              <Box sx={{
                width: { xs: '100%', md: '30%' },
                bgcolor: '#fff',
                p: 2,
                overflowY: 'auto',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.03)',
                borderRight: '1px solid #f1dcdc'
              }}>
                {/* Search Bar */}
                <TextField
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats"
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
                <List>
                  {filteredMembers.map((member, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => setSelectedUser(member)}
                      sx={{
                        borderRadius: 3,
                        mb: 1.5,
                        px: 2,
                        '&:hover': { bgcolor: '#ffecec' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={member.image} sx={{ width: 48, height: 48 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 600 }}>{member.name}</Typography>}
                        secondary={<Typography sx={{ fontSize: '0.85rem', color: '#888' }}>Hey, how are you?</Typography>}
                      />
                      <Box sx={{ textAlign: 'right' }}>
  <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>10:30 AM</Typography>
  <Typography
    sx={{
      fontSize: '0.75rem',
      fontWeight: 500,
      color: member.online ? 'green' : 'red'
    }}
  >
    {member.online ? 'Online' : 'Offline'}
  </Typography>
</Box>

                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {showChatPane && selectedUser && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#fff', mb: 1, justifyContent: 'space-between', borderBottom: '1px solid #f1dcdc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                      <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedUser(null)} sx={{ m: 1, alignSelf: 'flex-start' }}></Button>
                    )}
                    <Avatar src={selectedUser.image} sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{selectedUser.name}</Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Call">
                      <IconButton><PhoneIcon sx={{ color: '#000' }} /></IconButton>
                    </Tooltip>
                  </Box>
                </Paper>

                <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                  {(messages[selectedUser.name] || []).map((msg, idx) => (
                    <Box key={idx} sx={{ mb: 2, textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                      <Paper sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        bgcolor: msg.sender === 'You' ? '#ffdfdf' : '#f5f5f5',
                        maxWidth: '70%',
                      }}>
                        {msg.text && (
                          <Typography variant="body2">{msg.text}</Typography>
                        )}
                        {msg.image && (
                          <img src={msg.image} alt="sent-img" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: 5 }} />
                        )}
                        {msg.document && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            📄 <strong>{msg.document}</strong>
                          </Typography>
                        )}
                        {msg.contact && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">📱 <strong>{msg.contact.name}</strong></Typography>
                            <Typography variant="caption">{msg.contact.phone}</Typography>
                          </Box>
                        )}
                        {msg.audio && (
                          <audio controls src={msg.audio} style={{ marginTop: 5, width: '100%' }} />
                        )}

                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#aaa' }}>{msg.timestamp}</Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                <Box sx={{
                  p: 1.5,
                  borderTop: '1px solid #f1dcdc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: '#fff',
                  position: isMobile ? 'fixed' : 'relative',
                  bottom: 0,
                  left: 0,
                  width: isMobile ? '100%' : 'auto',
                  zIndex: 1200,
                  boxShadow: '0px -2px 8px rgba(0,0,0,0.05)'
                }}>
                  <IconButton onClick={() => setShowAttachments(!showAttachments)}><AddIcon /></IconButton>
                  {showAttachments && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Image Upload */}
                      <Tooltip title="Image">
                        <IconButton component="label">
                          <ImageIcon />
                          <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && selectedUser) {
                                const key = selectedUser.name;
                                const updatedMessages = { ...messages };
                                if (!updatedMessages[key]) updatedMessages[key] = [];
                                updatedMessages[key].push({
                                  sender: 'You',
                                  image: URL.createObjectURL(file),
                                  timestamp: formatTime(new Date()),
                                  date: formatDate(new Date()),
                                });
                                setMessages(updatedMessages);
                              }
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      {/* Document Upload */}
                      <Tooltip title="Document">
                        <IconButton component="label">
                          <DocumentIcon />
                          <input
                            hidden
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && selectedUser) {
                                const key = selectedUser.name;
                                const updatedMessages = { ...messages };
                                if (!updatedMessages[key]) updatedMessages[key] = [];
                                updatedMessages[key].push({
                                  sender: 'You',
                                  document: file.name,
                                  timestamp: formatTime(new Date()),
                                  date: formatDate(new Date()),
                                });
                                setMessages(updatedMessages);
                              }
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      {/* Contact Picker */}
                      <Tooltip title="Contact">
                        <IconButton onClick={() => {
                          if (selectedUser) {
                            const dummyContact = {
                              name: 'John Doe',
                              phone: '+91 9876543210',
                            };
                            const key = selectedUser.name;
                            const updatedMessages = { ...messages };
                            if (!updatedMessages[key]) updatedMessages[key] = [];
                            updatedMessages[key].push({
                              sender: 'You',
                              contact: dummyContact,
                              timestamp: formatTime(new Date()),
                              date: formatDate(new Date()),
                            });
                            setMessages(updatedMessages);
                          }
                        }}>
                          <ContactIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}

                 <Box sx={{ position: 'relative', flex: 1 }}>
  <TextField
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyPress={handleKeyPress}
    placeholder="Type a message"
    multiline
    maxRows={4}
    variant="outlined"
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <InsertEmoticonIcon
            sx={{ cursor: 'pointer', color: '#888' }}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
        </InputAdornment>
      ),
      sx: {
        borderRadius: 8,
        bgcolor: '#fcecec',
        px: 2,
        border: 'none',
      },
    }}
  />

  {/* Emoji Picker dropdown */}
  {showEmojiPicker && (
    <Box sx={{ position: 'absolute', bottom: '60px', left: 0, zIndex: 1000 }}>
      <Picker
        data={data}
        onEmojiSelect={(emoji) => {
          setMessage((prev) => prev + emoji.native);
          setShowEmojiPicker(false);
        }}
        theme="light"
        maxFrequentRows={2}
      />
    </Box>
  )}
</Box>

                  {/* Mic/Send button logic */}
                  {message.trim() ? (
                    <IconButton onClick={handleSendMessage}>
                      <SendIcon sx={{ color: '#ff4d4d' }} />
                    </IconButton>
                  ) : isRecording ? (
                    <IconButton onClick={handleMicClick}>
                      <SendIcon sx={{ color: '#ff4d4d' }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleMicClick}>
                      <MicIcon sx={{ color: '#999' }} />
                    </IconButton>
                  )}
                  {/* If audio is ready to send */}
                  {audioBlob && !isRecording && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={handleSendAudio}
                    >
                      Send Audio
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {isMobile && (
       <BottomNavigation
  showLabels
  value={bottomNav}
  onChange={(event, newValue) => {
    setBottomNav(newValue);
    if (newValue !== 2) setSelectedUser(null); // Deselect user when switching tabs except Search (previously Profile)
  }}
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    borderTop: '1px solid #eee',
    bgcolor: '#fff',
    boxShadow: '0px -2px 8px rgba(0,0,0,0.05)',
  }}
>
  <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
  <BottomNavigationAction label="Call" icon={<PhoneIcon />} />
  <BottomNavigationAction label="Search" icon={<SearchIcon />} />  {/* ← Updated */}
 <BottomNavigationAction
  label="Settings"
  icon={<SettingsIcon />}
  onClick={() => setBottomNav(3)}
/>

 

</BottomNavigation>

      )}
    </Box>
  );
};

export default ChatPage;
