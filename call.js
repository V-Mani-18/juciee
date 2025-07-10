import React from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const callLogs = [
    { name: 'Sophia', type: 'missed', time: '10:15 AM', image: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Ethan', type: 'missed', time: '9:45 AM', image: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Noah', type: 'incoming', time: 'Yesterday', image: 'https://i.pravatar.cc/150?img=14' },
    { name: 'Olivia', type: 'missed', time: 'Monday', image: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Ava', type: 'incoming', time: 'Sunday', image: 'https://i.pravatar.cc/150?img=15' },
];

const Call = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                width: '100%',
                height: isMobile ? 'calc(100vh - 120px)' : '100%',
                p: 2,
                overflowY: 'auto',
                bgcolor: '#fff6f8',
                fontFamily: 'Poppins, sans-serif',
            }}
        >
            <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, textAlign: isMobile ? 'center' : 'left' }}
            >
                Call Logs
            </Typography>

            <List>
                {callLogs.map((log, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            bgcolor: '#fff',
                            borderRadius: 3,
                            mb: 1,
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.03)',
                            px: 2,
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar src={log.image} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography sx={{ fontWeight: 600 }}>
                                    {log.name}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    sx={{
                                        fontSize: '0.85rem',
                                        color: log.type === 'missed' ? '#f44336' : '#4caf50',
                                    }}
                                >
                                    {log.type === 'missed' ? 'Missed Call' : 'Incoming Call'} • {log.time}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Call;
