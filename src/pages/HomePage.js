import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Gravatar from 'react-gravatar';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Typography, Container, Box, Button, Menu, MenuItem, Tooltip, Avatar, Card, CardContent, CardActions, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { green, grey } from '@mui/material/colors';

const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [profileData, setProfileData] = useState({ username: '', email: '' }); // Initialize profile data with empty values
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
                // Handle error fetching user details
            }
        };
        fetchUserData();
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

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: green[500] }}>
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
                <Box display="grid" gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(3, 1fr)"} mt={4} gap={2}>
                    {[...Array(12)].map((_, index) => (
                        <Card key={index} onClick={() => history.push(`/sensor/Page${index + 1}`)} sx={{ backgroundColor: grey[200], boxShadow: 3, cursor: 'pointer' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Sensor {index + 1}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Status:
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">View Details</Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Container>
            {/* Profile Dialog */}
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
                    {/* Add fields for changing profile picture and password if needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProfileDialog}>Cancel</Button>
                    <Button onClick={handleProfileSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default HomePage;
