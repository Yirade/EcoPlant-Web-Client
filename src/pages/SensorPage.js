import React, { useState, useEffect, useContext } from 'react';
import Chart from 'react-apexcharts';
import './styles/SensorDashboard.css'; // Import CSS file for styling
import AuthContext from '../context/AuthContext';

const SensorDashboard = ({ deviceId }) => {
  const [logs, setLogs] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    fetchLogs();
  }, [deviceId]);

  useEffect(() => {
    if (logs.length > 0) {
      const data = {};
      logs.forEach(log => {
        Object.keys(log).forEach(key => {
          if (key !== 'timestamp' && log[key] !== null && typeof log[key] !== 'undefined') {
            if (!data[key]) data[key] = [];
            data[key].push({ x: new Date(), y: log[key] });
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
        body: JSON.stringify({ device_id: "05e4bc86-a09b-4b1d-813f-318dc94cb484" })
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
                  {Object.keys(log)
                    .filter(key => key !== 'timestamp' && log[key] !== null && typeof log[key] !== 'undefined')
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
