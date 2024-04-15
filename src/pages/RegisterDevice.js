import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const RegisterDevicePage = () => {
    const { authTokens } = useContext(AuthContext);
    const [deviceData, setDeviceData] = useState({});
    const history = useHistory();

    const handleRegisterDevice = async () => {
        try {
            const response = await fetch('https://ecoplant-back.yirade.dev/api/v1/register-device/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(deviceData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Device registered successfully:', data);
                history.goBack();
            } else {
                console.error('Error registering device:', response.statusText);
            }
        } catch (error) {
            console.error('Error registering device:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDeviceData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleReturn = () => {
        history.goBack();
    };

    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor: '#4caf50' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Register Device
                    </Typography>
                    <Button color="inherit" onClick={handleReturn}>
                        <ArrowBack />
                        Return
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2 }}>
                <TextField
                    name="deviceName"
                    label="Device Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <TextField
                    name="deviceType"
                    label="Device Type"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleInputChange}
                />
                <Button variant="contained" color="success" onClick={handleRegisterDevice}>Register Device</Button>
            </Box>
        </Box>
    );
}

export default RegisterDevicePage;
