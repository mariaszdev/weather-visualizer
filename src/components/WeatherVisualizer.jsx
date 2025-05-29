import React, { useState } from 'react';
import ChartDisplay from './ChartDisplay/ChartDisplay';
import ControlPanel from './ControlPanel/ControlPanel';

const WeatherVisualizer = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [view, setView] = useState('year');

  return (
    <div className="container">
      <ControlPanel
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        view={view}
        onViewChange={setView}
      />

      <ChartDisplay year={selectedYear} view={view} />
    </div>
  );
};

export default WeatherVisualizer;
