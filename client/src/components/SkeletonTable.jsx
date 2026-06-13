import React from 'react';

export default function SkeletonTable({ rows = 5, cols = 5 }) {
  const rowArray = Array.from({ length: rows });
  const colArray = Array.from({ length: cols });

  return (
    <div className="skeleton-wrapper">
      <table className="skeleton-table">
        <thead>
          <tr className="skeleton-header-row">
            {colArray.map((_, index) => (
              <th key={index} className="skeleton-header-cell">
                <div className="skeleton-shimmer" style={{ width: '50%', height: '14px' }}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowArray.map((_, rIndex) => (
            <tr key={rIndex} className="skeleton-row">
              {colArray.map((_, cIndex) => (
                <td key={cIndex} className="skeleton-cell">
                  <div className="skeleton-shimmer"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .skeleton-wrapper {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          overflow: hidden;
          padding: 16px;
        }
        .skeleton-table {
          width: 100%;
          border-collapse: collapse;
        }
        .skeleton-header-row {
          border-bottom: 1px solid var(--border-default);
        }
        .skeleton-header-cell {
          padding: 16px 24px;
          text-align: left;
        }
        .skeleton-row {
          border-bottom: 1px solid var(--border-subtle);
        }
        .skeleton-row:last-child {
          border-bottom: none;
        }
        .skeleton-cell {
          padding: 16px 24px;
        }
        .skeleton-shimmer {
          height: 16px;
          background: linear-gradient(
            90deg,
            var(--bg-elevated) 25%,
            var(--bg-hover) 50%,
            var(--bg-elevated) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
        }
        .skeleton-cell:nth-child(1) .skeleton-shimmer { width: 45%; }
        .skeleton-cell:nth-child(2) .skeleton-shimmer { width: 75%; }
        .skeleton-cell:nth-child(3) .skeleton-shimmer { width: 55%; }
        .skeleton-cell:nth-child(4) .skeleton-shimmer { width: 35%; }
        .skeleton-cell:nth-child(5) .skeleton-shimmer { width: 60%; }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
