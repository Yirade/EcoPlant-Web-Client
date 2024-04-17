import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Gravatar from 'react-gravatar';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Typography, Container, Box, Button, Menu, MenuItem, Tooltip, Avatar, Card, CardContent, CardActions, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { green, grey } from '@mui/material/colors';
import { CircularProgress } from '@mui/material';
import './styles/ViewDevices.css'; // Import CSS file

const ViewDevices = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [profileData, setProfileData] = useState({ username: '', email: '' });
    const isMobile = useMediaQuery('(max-width:600px)');
    const history = useHistory();
    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://ecoplant-back.yirade.dev/api/v1/user-detail/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserData();

        const fetchDevices = async () => {
            try {
                const response = await axios.get('https://ecoplant-back.yirade.dev/api/v1/user-devices/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setDevices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching devices:', error);
                setLoading(false);
            }
        };
        fetchDevices();
    }, [authTokens.access]);

    const handleLogout = () => {
        logoutUser();
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeviceRegistration = () => {
        history.push('/register-device');
        handleMenuClose(); 
    };

    const handleOpenProfileDialog = () => {
        setOpenProfileDialog(true);
    };

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false);
    };

    const handleProfileSubmit = () => {
        console.log('Updating profile with:', profileData);
        handleCloseProfileDialog();
    };

    const handleViewDevices = () => {
        history.push('/view-device');
        handleMenuClose();
    };

    const handleSettings = () => {
        history.push('/settings');
        handleMenuClose();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleViewDetails = (deviceId) => {
        history.push(`/sensor/${deviceId}`);
    };

    
    return (
       
        <div className="view-devices-container"  style={{ backgroundColor:  '#b4ecb4' , minHeight: '100vh', padding: '20px' }}>
           <AppBar position="static" style={{ backgroundColor:  '#4caf50'  }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Eco Plant Dashboard {profileData.username ? `Welcome, ${profileData.username}` : ''}
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2 }}>
                                    <Avatar
                                        alt="User Avatar"
                                        src={authTokens.username ? <Gravatar email={authTokens.username.toString()} size={40} default="identicon" /> : ""}
                                    >
                                        {authTokens.username ? authTokens.username.charAt(0).toUpperCase() : ""}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="user-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleOpenProfileDialog}>Profile</MenuItem>
                                <MenuItem onClick={handleSettings}>Settings</MenuItem>
                                <MenuItem onClick={handleViewDevices}>View</MenuItem>
                                <MenuItem onClick={handleDeviceRegistration}>Register Device</MenuItem>
                                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="xl">
                <Box display="grid" gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(2, 1fr)"} mt={4} gap={2}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        devices.map((device, index) => (
                            <Card key={index} className={`device-card ${device.status === 'active' ? 'active' : ''}`} sx={{ backgroundColor: "#388e3c", boxShadow: 3, cursor: 'pointer' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Device Name: {device.name}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Device ID: {device.device_id}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Status: {device.status}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleViewDetails(device.device_id)}>View Details</Button>
                                </CardActions>
                            </Card>
                        ))
                    )}
                </Box>
            </Container>
            <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        value={profileData.username}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={profileData.email}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProfileDialog}>Cancel</Button>
                    <Button onClick={handleProfileSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ViewDevices;
