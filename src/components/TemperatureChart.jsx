import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';

import chartColors from '../config/chartColors';

// Custom tick renderer — renders centered month label
const CustomMonthTick = ({ x, y, payload }) => {
  const label = new Date(payload.value).toLocaleDateString('en-US', {
    month: 'short',
  });

  return (
    <text x={x} y={y + 15} textAnchor="middle" fontSize={12}>
      {label}
    </text>
  );
};

const TemperatureChart = () => {
  const [data, setData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [monthBands, setMonthBands] = useState([]);

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

      // Midpoint of each month for centered label
      const grouped = {};
      combined.forEach((entry) => {
        const month = entry.date.slice(0, 7);
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(entry.date);
      });

      const labels = Object.values(grouped).map((dates) => {
        const mid = Math.floor(dates.length / 2);
        return dates[mid];
      });
      setMonthLabels(labels);

      // Shaded bands for each month
      const bands = Object.values(grouped).map((dates) => ({
        start: dates[0],
        end: dates[dates.length - 1],
      }));
      setMonthBands(bands);
    };

    fetchWeather();
  }, []);

  return (
    <div className="chart-wrapper">
      <h2>Vienna Temperatures (2024)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid
            stroke={chartColors.grid}
            strokeDasharray="5 5"
            vertical={false}
            horizontal={true}
          />

          {monthBands.map(({ start, end }, i) => (
            <ReferenceArea
              key={start}
              x1={start}
              x2={end}
              strokeOpacity={0}
              fill={i % 2 === 0 ? chartColors.bandEven : chartColors.bandOdd}
              fillOpacity={0.5}
            />
          ))}

          <XAxis
            dataKey="date"
            ticks={monthLabels}
            tick={<CustomMonthTick />}
            axisLine
            tickLine={false}
          />
          <YAxis tickFormatter={(v) => `${v}°C`} />
          <ReferenceLine
            x={data[data.length - 1]?.date}
            stroke={chartColors.grid}
            strokeWidth={1}
            strokeDasharray="5 5"
          />
          <Tooltip formatter={(v) => `${v}°C`} />
          <Line
            type="monotone"
            dataKey="max"
            stroke={chartColors.maxTemp}
            dot={{ r: 0, strokeWidth: 0, fill: chartColors.maxTemp }}
            name="Max Temp"
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke={chartColors.minTemp}
            dot={{ r: 0, strokeWidth: 0, fill: chartColors.minTemp }}
            name="Min Temp"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
