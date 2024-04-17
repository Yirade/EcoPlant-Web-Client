import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import Chart from 'react-apexcharts';
import './styles/SensorDashboard.css'; // Import CSS file for styling
import AuthContext from '../context/AuthContext';

const SensorDashboard = () => { // No need to pass deviceId as prop
  const [logs, setLogs] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const { authTokens } = useContext(AuthContext);
  const { deviceId } = useParams(); // Access deviceId from route params

  useEffect(() => {
    fetchLogs();
  }, [deviceId]); // Re-fetch logs when deviceId changes

  useEffect(() => {
    if (logs.length > 0) {
      const data = {};

      // Initialize data for each sensor
      logs.forEach(log => {
        Object.keys(log).forEach(key => {
          if (key !== 'timestamp' && key !== 'light' && log[key] !== null && typeof log[key] !== 'undefined') {
            if (!data[key]) data[key] = [];
          }
        });
      });

      // Concatenate values for each sensor
      logs.forEach(log => {
        Object.keys(log).forEach(key => {
          if (key !== 'timestamp' && key !== 'light' && log[key] !== null && typeof log[key] !== 'undefined') {
            data[key].push({ x: new Date(log.timestamp), y: log[key] });
          }
        });
      });

      setSensorData(data);
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
        body: JSON.stringify({ device_id: deviceId }) // Use deviceId from route params
      });

      if (response.ok) {
        const data = await response.json();
        // Sort logs based on timestamps
        const sortedLogs = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setLogs(sortedLogs);
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <div className="sensor-dashboard">
      <div className="charts">
        {Object.keys(sensorData).map((sensor, index) => (
          <div key={index} className="chart">
            <h3>{sensor.toUpperCase()}</h3>
            <Chart
              options={{ xaxis: { type: 'datetime' }, yaxis: { title: { text: `${sensor.toUpperCase()} Value` } } }}
              series={[{ name: sensor.toUpperCase(), data: sensorData[sensor] }]}
              type="line"
              width="100%"
            />
          </div>
        ))}
      </div>
      <div className="logs-container">
        <div className="logs">
          <div className="log-box">
            <h3>Logs</h3>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>
                  <span>Timestamp: {new Date(log.timestamp).toLocaleString()}</span>
                  {Object.keys(log)
                    .filter(key => key !== 'timestamp' && key !== 'light' && log[key] !== null && typeof log[key] !== 'undefined')
                    .map((key, index) => (
                      <span key={index}>{`${key.toUpperCase()}: ${log[key]}, `}</span>
                    ))}
                </li>
              ))}
            </ul>
            <div className="controls">
              <button className="add-log-btn" onClick={fetchLogs}>Refresh Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;
