import React, { useState, useEffect, useContext } from 'react';
import Chart from 'react-apexcharts';
import './styles/SensorDashboard.css'; // Import CSS file for styling
import AuthContext from '../context/AuthContext';

const SensorDashboard = ({ deviceId }) => {
  const [logs, setLogs] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [soilMoistureData, setSoilMoistureData] = useState([]);
  const [lightData, setLightData] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    fetchLogs();
  }, [deviceId]);

  useEffect(() => {
    if (logs.length > 0) {
      setTemperatureData(logs.map(log => ({ x: new Date(log.timestamp), y: log.temperature })));
      setHumidityData(logs.map(log => ({ x: new Date(log.timestamp), y: log.humidity })));
      setSoilMoistureData(logs.map(log => ({ x: new Date(log.timestamp), y: log.soil_moisture })));
      setLightData(logs.map(log => ({ x: new Date(log.timestamp), y: log.light })));
    }
  }, [logs]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://ecoplant-back.yirade.dev/api/v1/device-sensor-data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ device_id: deviceId })
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
        <div className="chart">
          <h3><i className="fas fa-thermometer-half chart-icon"></i>Temperature</h3>
          <Chart
            options={{ xaxis: { type: 'datetime' }, yaxis: { title: { text: 'Temperature (°C)' } } }}
            series={[{ name: 'Temperature', data: temperatureData }]}
            type="line"
            width="100%"
          />
        </div>
        <div className="chart">
          <h3><i className="fas fa-tint chart-icon"></i>Humidity</h3>
          <Chart
            options={{ xaxis: { type: 'datetime' }, yaxis: { title: { text: 'Humidity (%)' } } }}
            series={[{ name: 'Humidity', data: humidityData }]}
            type="line"
            width="100%"
          />
        </div>
        <div className="chart">
          <h3><i className="fas fa-water chart-icon"></i>Soil Moisture</h3>
          <Chart
            options={{ xaxis: { type: 'datetime' }, yaxis: { title: { text: 'Soil Moisture (%)' } } }}
            series={[{ name: 'Soil Moisture', data: soilMoistureData }]}
            type="line"
            width="100%"
          />
        </div>
        <div className="chart">
          <h3><i className="far fa-sun chart-icon"></i>Light</h3>
          <Chart
            options={{ xaxis: { type: 'datetime' }, yaxis: { title: { text: 'Light Intensity (lux)' } } }}
            series={[{ name: 'Light', data: lightData }]}
            type="line"
            width="100%"
          />
        </div>
      </div>
      <div className="logs-container">
        <div className="logs">
          <div className="log-box">
            <h3>Logs</h3>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>
                  Temp: {log.temperature}, Hum: {log.humidity}, Soil: {log.soil_moisture}, Light: {log.light}, Timestamp: {log.timestamp}
                </li>
              ))}
            </ul>
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
