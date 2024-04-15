import React, { useState, useEffect, useContext } from 'react';
import Chart from 'react-apexcharts';
import './styles/SensorDashboard.css'; // Import CSS file for styling
import AuthContext from '../context/AuthContext';

const SensorDashboard = ({ deviceId }) => {
  const [logs, setLogs] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const { authTokens } = useContext(AuthContext);
  
  useEffect(() => {
    // Fetch logs from backend when component mounts
    fetchLogs();
  }, [deviceId]);

  console.log(deviceId)
  useEffect(() => {
    // Update temperature and humidity data when logs change
    if (logs.length > 0) {
      const temperature = logs.map(log => ({
        x: new Date(log.timestamp),
        y: log.temperature
      }));
      const humidity = logs.map(log => ({
        x: new Date(log.timestamp),
        y: log.humidity
      }));
      setTemperatureData(temperature);
      setHumidityData(humidity);
    }
  }, [logs]);

  const fetchLogs = async () => {
    try {
      // Make API call to fetch logs from backend
      const response = await fetch('https://ecoplant-back.yirade.dev/api/v1/device-sensor-data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ device_id: "66c6d059-2c0a-4cd9-9008-9ddea43cd581" })
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="sensor-dashboard">
      <div className="charts">
        {/* Temperature chart */}
        <div className="chart">
          <h3>Temperature</h3>
          <Chart
            options={{
              xaxis: { type: 'datetime' },
              yaxis: { title: { text: 'Temperature (°C)' } }
            }}
            series={[{ name: 'Temperature', data: temperatureData }]}
            type="line"
            width="100%"
          />
        </div>
        {/* Humidity chart */}
        <div className="chart">
          <h3>Humidity</h3>
          <Chart
            options={{
              xaxis: { type: 'datetime' },
              yaxis: { title: { text: 'Humidity (%)' } }
            }}
            series={[{ name: 'Humidity', data: humidityData }]}
            type="line"
            width="100%"
          />
        </div>
      </div>
      <div className="logs-container">
        <div className="logs">
          <div className="log-box">
            {/* Logs display */}
            <h3>Logs</h3>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>
                  Temperature: {log.temperature}, Humidity: {log.humidity}, Timestamp: {log.timestamp}
                </li>
              ))}
            </ul>
            {/* Buttons for controlling logs */}
            <div className="controls">
              <button className="add-log-btn" onClick={fetchLogs}>Refresh Logs</button>
              <button className="clear-logs-btn" onClick={clearLogs}>Clear Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;
