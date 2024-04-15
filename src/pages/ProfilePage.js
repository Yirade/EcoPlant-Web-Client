import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Box, TextField, Button, Avatar, Typography, Container, AppBar, Toolbar, IconButton, Menu, MenuItem, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { green } from '@mui/material/colors';
import { useHistory } from 'react-router-dom';
import Gravatar from 'react-gravatar';
import MenuIcon from '@mui/icons-material/Menu';

const ProfilePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({ username: '', email: '' }); // Initialize profile data with empty values
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const history = useHistory();

    const handleLogout = () => {
        logoutUser();
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
                            Profile
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={() => history.push('/home')} // Navigate back to home page
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="xl">
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        alt="User Avatar"
                        src={authTokens.username ? <Gravatar email={authTokens.username.toString()} size={120} default="identicon" /> : ""}
                        sx={{ width: 120, height: 120, mb: 2 }}
                    >
                        {authTokens.username ? authTokens.username.charAt(0).toUpperCase() : ""}
                    </Avatar>
                    <Button variant="contained" sx={{ bgcolor: green[500], color: '#fff', mb: 2 }}>Change Profile Picture</Button>
                    <TextField
                        margin="normal"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        value={profileData.username}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={profileData.email}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    {/* Add fields for changing password if needed */}
                    <Button variant="contained" sx={{ bgcolor: green[500], color: '#fff' }} onClick={handleProfileSubmit}>Save Changes</Button>
                </Box>
            </Container>
        </div>
    );
}

export default ProfilePage;
