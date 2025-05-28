import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const TemperatureChart = () => {
  const [data, setData] = useState([]);
  const [monthTicks, setMonthTicks] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      const url =
        'https://archive-api.open-meteo.com/v1/archive?latitude=48.2082&longitude=16.3738&start_date=2024-01-01&end_date=2024-12-31&daily=temperature_2m_min,temperature_2m_max&timezone=Europe%2FBerlin';
      const response = await fetch(url);
      const json = await response.json();

      const combined = json.daily.time.map((date, i) => ({
        date,
        min: json.daily.temperature_2m_min[i],
        max: json.daily.temperature_2m_max[i],
      }));

      setData(combined);

      const ticks = combined
        .filter((entry) => entry.date.endsWith('-01')) // 1st of each month
        .map((entry) => entry.date);

      setMonthTicks(ticks);
    };

    fetchWeather();
  }, []);

  return (
    <div className="chart-wrapper">
      <h2>Vienna Temperatures (2024)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            ticks={monthTicks}
            tickFormatter={(dateStr) =>
              new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })
            }
          />
          <YAxis tickFormatter={(value) => `${value}°C`} />
          <Tooltip formatter={(value) => `${value}°C`} />
          <Line type="monotone" dataKey="max" stroke="#ff7300" name="Max Temp" />
          <Line type="monotone" dataKey="min" stroke="#387908" name="Min Temp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
