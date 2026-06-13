import React, { useState } from 'react';
import { Copy, BarChart3, Edit, QrCode, Trash2, ExternalLink, Check } from 'lucide-react';
import { formatDate, truncateUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function UrlTable({ urls, onDelete, onEdit, onQR, onAnalytics, newUrlId }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (urlId, shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(urlId);
    toast.success('Copied link to clipboard!');
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="table-empty card glass">
        <p>No links found. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="table-card" style={{ width: '100%' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <colgroup>
            <col style={{ width: '28%' }} />  {/* Original URL */}
            <col style={{ width: '18%' }} />  {/* Short Link */}
            <col style={{ width: '12%' }} />  {/* Created */}
            <col style={{ width: '10%' }} />  {/* Clicks */}
            <col style={{ width: '10%' }} />  {/* Status */}
            <col style={{ width: '22%' }} />  {/* Actions */}
          </colgroup>
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short Link</th>
              <th>Created</th>
              <th>Clicks</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, i) => {
              const status = url.status || 'active';
              const isJustCreated = url._id === newUrlId;
              const isCopied = url._id === copiedId;

              return (
                <tr 
                  key={url._id} 
                  className={`slide-in ${isJustCreated ? 'slide-in-row' : ''}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <td className="td-url">
                    <span className="td-url-text" title={url.originalUrl}>
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                        {truncateUrl(url.originalUrl, 45)}
                      </a>
                    </span>
                  </td>

                  <td>
                    <span 
                      className={`td-short ${isCopied ? 'glow-pulse' : ''}`}
                      onClick={() => handleCopy(url._id, url.shortUrl)}
                      title="Click to copy"
                    >
                      {url.shortUrl}
                    </span>
                  </td>

                  <td className="td-date">{formatDate(url.createdAt)}</td>

                  <td>
                    <span className="td-clicks">{(url.clickCount || 0).toLocaleString()}</span>
                  </td>

                  <td>
                    <span className={`status-pill ${status}`}>
                      {status}
                    </span>
                  </td>

                  <td>
                    <div className="action-group">
                      <button 
                        className="action-btn" 
                        title="Copy"
                        onClick={() => handleCopy(url._id, url.shortUrl)}
                      >
                        {isCopied ? '✓' : '📋'}
                      </button>
                      <button 
                        className="action-btn" 
                        title="Analytics"
                        onClick={() => onAnalytics(url._id)}
                      >
                        📊
                      </button>
                      <button 
                        className="action-btn" 
                        title="Edit"
                        onClick={() => onEdit(url)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn" 
                        title="QR Code"
                        onClick={() => onQR(url)}
                      >
                        ⬛
                      </button>
                      <button 
                        className="action-btn danger" 
                        title="Delete"
                        onClick={() => onDelete(url._id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
