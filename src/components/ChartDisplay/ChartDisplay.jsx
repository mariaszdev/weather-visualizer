import './ChartDisplay.scss';

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
import chartColors from '../../config/chartColors';

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

const ChartDisplay = ({ year, view }) => {
  const [data, setData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [monthBands, setMonthBands] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=48.2082&longitude=16.3738&start_date=${year}-01-01&end_date=${year}-12-31&daily=temperature_2m_min,temperature_2m_max&timezone=Europe%2FBerlin`;
      const response = await fetch(url);
      const json = await response.json();

      const combined = json.daily.time.map((date, i) => ({
        date,
        min: json.daily.temperature_2m_min[i],
        max: json.daily.temperature_2m_max[i],
      }));

      setData(combined);

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

      const bands = Object.values(grouped).map((dates) => ({
        start: dates[0],
        end: dates[dates.length - 1],
      }));
      setMonthBands(bands);
    };

    fetchWeather();
  }, [year]);

  return (
    <div className="chart-wrapper">
      <h2>Vienna Temperatures ({year})</h2>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height="100%">
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
            <YAxis
              domain={[-32, 40]}
              ticks={[-30, -20, -10, 0, 10, 20, 30, 40]}
              tickFormatter={(v) => `${v}°C`}
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
            <ReferenceLine
              x={data[data.length - 1]?.date}
              stroke={chartColors.grid}
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartDisplay;
