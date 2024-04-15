import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Typography, Button, Box, IconButton, Snackbar, AppBar, Toolbar, InputAdornment, TextField } from '@mui/material';
import { FileCopy } from '@mui/icons-material';

const SettingsPage = () => {
    const { authTokens } = useContext(AuthContext);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showAccessToken, setShowAccessToken] = useState(false);
    const [greenStyle, setGreenStyle] = useState(true); // Set greenStyle to true initially

    const handleCopyAccessToken = () => {
        navigator.clipboard.writeText(authTokens.access);
        setCopySuccess(true);
    };

    const handleCloseSnackbar = () => {
        setCopySuccess(false);
    };

    const toggleAccessTokenVisibility = () => {
        setShowAccessToken(!showAccessToken);
    };

    const toggleGreenStyle = () => {
        setGreenStyle(!greenStyle);
    };

    return (
        <div style={{ backgroundColor: greenStyle ? '#b4ecb4' : '#ffffff', minHeight: '100vh', padding: '20px' }}>
            <AppBar position="static" style={{ backgroundColor: greenStyle ? '#4caf50' : '#2196f3' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        {/* You can add a menu icon here if needed */}
                    </IconButton>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                        Settings
                    </Typography>
                    <Button color="inherit" onClick={() => window.history.back()}>
                        Return to Dashboard
                    </Button>
                    {/* Add any other navbar content here */}
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
               
                <Button variant="contained" sx={{ bgcolor: greenStyle ? '#388e3c' : '#1976d2', color: '#fff' }} onClick={toggleAccessTokenVisibility}>
                    {showAccessToken ? 'Hide Access Token' : 'Show Access Token'}
                </Button>
                <Button variant="contained" sx={{ bgcolor: greenStyle ? '#388e3c' : '#1976d2', color: '#fff' }} onClick={toggleGreenStyle}>
                    {greenStyle ? 'Disable Green Style' : 'Enable Green Style'}
                </Button>
            </Box>
            {showAccessToken && (
                <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Access Token
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={authTokens.access}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleCopyAccessToken} size="small">
                                        <FileCopy />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            readOnly: true,
                        }}
                    />
                </Box>
            )}
            <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="Access token copied to clipboard"
            />
        </div>
    );
};

export default SettingsPage;
