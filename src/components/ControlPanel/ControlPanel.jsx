import './ControlPanel.scss';

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - 1 - i);

const ControlPanel = ({ selectedYear, onYearChange }) => {
  return (
    <div className="control-panel">
      <label>
        Year:&nbsp;
        <select value={selectedYear} onChange={(e) => onYearChange(Number(e.target.value))}>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ControlPanel;
