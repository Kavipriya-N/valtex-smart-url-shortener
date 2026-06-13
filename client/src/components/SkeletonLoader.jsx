import React from 'react';

export default function SkeletonLoader({ rows = 5, cols = 6 }) {
  const rowArray = Array.from({ length: rows });
  const colArray = Array.from({ length: cols });

  return (
    <div className="skeleton-wrapper">
      <table className="skeleton-table">
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
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          padding: 1rem;
        }
        .skeleton-table {
          width: 100%;
          border-collapse: collapse;
        }
        .skeleton-row {
          border-bottom: 1px solid var(--border);
        }
        .skeleton-row:last-child {
          border-bottom: none;
        }
        .skeleton-cell {
          padding: 1.2rem 1.5rem;
        }
        .skeleton-shimmer {
          height: 18px;
          background: linear-gradient(
            90deg,
            var(--card2) 25%,
            var(--card3) 50%,
            var(--card2) 75%
          );
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
        }
        .skeleton-cell:nth-child(1) .skeleton-shimmer { width: 60%; }
        .skeleton-cell:nth-child(2) .skeleton-shimmer { width: 40%; }
        .skeleton-cell:nth-child(3) .skeleton-shimmer { width: 50%; }
        .skeleton-cell:nth-child(4) .skeleton-shimmer { width: 30%; }
        .skeleton-cell:nth-child(5) .skeleton-shimmer { width: 40%; }
        .skeleton-cell:nth-child(6) .skeleton-shimmer { width: 70%; }

        @keyframes loading-shimmer {
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
