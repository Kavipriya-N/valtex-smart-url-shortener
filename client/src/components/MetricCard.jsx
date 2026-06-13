import React from 'react';
import useCounterUp from '../hooks/useCounterUp';

export default function MetricCard({
  label,
  value,
  change,
  changeDir = 'up',
  icon,
  colorClass = 'v1'
}) {
  const animatedValue = useCounterUp(value, 1200);

  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {typeof value === 'number' ? animatedValue.toLocaleString() : value}
      </div>
      {change && (
        <div className={`metric-change ${changeDir}`}>
          {changeDir === 'up' ? '↑' : changeDir === 'down' ? '↓' : ''} {change}
        </div>
      )}
      {icon && (
        <span className="metric-icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </div>
  );
}
