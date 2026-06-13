import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import { Line, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';
import { formatDate } from '../utils/helpers';
import { ArrowLeft, BarChart3, Calendar, Globe, Monitor, Smartphone, RefreshCw, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { urlId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/analytics/${urlId}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load link analytics.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [urlId]);

  if (loading) {
    return (
      <div className="analytics-loading">
        <RefreshCw className="spinner-large" size={48} />
        <span>Aggregating analytics telemetry...</span>
      </div>
    );
  }

  if (!data) return null;

  const trendLabels = data.trend.map(t => t.date);
  const trendValues = data.trend.map(t => t.count);

  const lineChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Clicks',
        data: trendValues,
        fill: true,
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#7C3AED',
        borderWidth: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'var(--border-subtle)' },
        ticks: { color: 'var(--text-secondary)', font: { family: 'DM Sans' } }
      },
      y: {
        grid: { color: 'var(--border-subtle)' },
        ticks: { color: 'var(--text-secondary)', font: { family: 'DM Sans' }, precision: 0 }
      }
    }
  };

  const browserLabels = data.browsers.map(b => b.name);
  const browserValues = data.browsers.map(b => b.count);
  const doughnutChartData = {
    labels: browserLabels,
    datasets: [
      {
        data: browserValues,
        backgroundColor: ['#7C3AED', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#8892AA'],
        borderWidth: 0
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'var(--text-primary)', boxWidth: 12, font: { family: 'DM Sans' } }
      }
    }
  };

  const getPercentage = (count, total) => {
    if (!total) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="dash-layout">
        <Sidebar activeTab="analytics" setActiveTab={(tab) => navigate(`/dashboard?tab=${tab}`)} />

        <main className="dash-main animate-fade">
          <div className="page-header">
            <button className="back-btn btn btn-secondary" onClick={() => navigate('/dashboard?tab=links')} style={{ marginBottom: '16px' }}>
              <ArrowLeft size={16} /> Back to Links
            </button>
            <h1>Link Analytics</h1>
            <p>
              Detailed tracking report for short link: <a href={data.url.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link-href">{data.url.shortUrl}</a>
            </p>
          </div>

          <div className="info-bar card glass" style={{ marginBottom: '24px' }}>
            <div className="info-item">
              <span className="info-label">Original URL</span>
              <a href={data.url.originalUrl} target="_blank" rel="noopener noreferrer" className="info-value original-url-text">
                {data.url.originalUrl}
              </a>
            </div>
            <div className="info-item">
              <span className="info-label">Created At</span>
              <span className="info-value">{formatDate(data.url.createdAt)}</span>
            </div>
          </div>

          <div className="metrics-grid" style={{ marginBottom: '24px' }}>
            <MetricCard
              label="Total Clicks"
              value={data.totalClicks}
              colorClass="v1"
              icon="📊"
            />
            <MetricCard
              label="Recent Visits (Logged)"
              value={data.recentVisits.length}
              colorClass="v2"
              icon="🧭"
            />
            <MetricCard
              label="Primary OS"
              value={data.devices.length ? data.devices.sort((a,b) => b.count - a.count)[0].name : 0}
              colorClass="v4"
              icon="💻"
            />
            <MetricCard
              label="Last Visit Logged"
              value={data.lastVisit ? 1 : 0}
              colorClass="v3"
              icon="📅"
            />
          </div>

          <div className="charts-row">
            <div className="chart-card line-chart-card card glass">
              <h3 className="chart-title font-display">14-Day Click Trend</h3>
              <div className="chart-container-inner">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            <div className="chart-card doughnut-chart-card card glass">
              <h3 className="chart-title font-display">Browsers</h3>
              <div className="chart-container-inner">
                {browserValues.length > 0 ? (
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                ) : (
                  <div className="no-data-display">No browser details logged.</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid-two-cols">
            <div className="breakdown-card card glass">
              <h3 className="chart-title font-display">Top Countries</h3>
              <div className="breakdown-list">
                {data.countries.length > 0 ? (
                  data.countries.sort((a, b) => b.count - a.count).map((item, idx) => {
                    const pct = getPercentage(item.count, data.totalClicks || data.recentVisits.length);
                    return (
                      <div key={idx} className="breakdown-row">
                        <div className="breakdown-label">
                          <Globe size={16} style={{ color: 'var(--accent-1)' }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="breakdown-bar-container">
                          <div 
                            className="breakdown-bar" 
                            style={{ 
                              '--target-width': `${pct}%`, 
                              background: 'var(--accent-1)',
                              animationDelay: `${idx * 100}ms`
                            }}
                          ></div>
                        </div>
                        <span className="breakdown-value font-display">{pct}% ({item.count})</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-data-display">No country details logged.</div>
                )}
              </div>
            </div>

            <div className="breakdown-card card glass">
              <h3 className="chart-title font-display">Top Devices</h3>
              <div className="breakdown-list">
                {data.devices.length > 0 ? (
                  data.devices.sort((a, b) => b.count - a.count).map((item, idx) => {
                    const pct = getPercentage(item.count, data.totalClicks || data.recentVisits.length);
                    return (
                      <div key={idx} className="breakdown-row">
                        <div className="breakdown-label">
                          {item.name.toLowerCase().includes('mobile') || item.name.toLowerCase().includes('phone') ? (
                            <Smartphone size={16} style={{ color: 'var(--accent-2)' }} />
                          ) : (
                            <Monitor size={16} style={{ color: 'var(--accent-2)' }} />
                          )}
                          <span>{item.name}</span>
                        </div>
                        <div className="breakdown-bar-container">
                          <div 
                            className="breakdown-bar" 
                            style={{ 
                              '--target-width': `${pct}%`, 
                              background: 'var(--accent-2)',
                              animationDelay: `${idx * 100}ms`
                            }}
                          ></div>
                        </div>
                        <span className="breakdown-value font-display">{pct}% ({item.count})</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-data-display">No device details logged.</div>
                )}
              </div>
            </div>
          </div>

          <div className="recent-visits-section card glass">
            <h3 className="chart-title font-display" style={{ marginBottom: '20px' }}>Recent Logged Visits</h3>
            <div className="visits-table-wrapper">
              <table className="valtex-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Browser</th>
                    <th>OS / Device</th>
                    <th>Geographic Origin</th>
                    <th>Referrer</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.length > 0 ? (
                    data.recentVisits.map((v, idx) => (
                      <tr key={idx}>
                        <td>{formatDate(v.createdAt)}</td>
                        <td>{v.browser}</td>
                        <td>{v.os} ({v.device})</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
                            {v.country}
                          </div>
                        </td>
                        <td className="col-referrer">{v.referrer}</td>
                        <td className="font-mono" style={{ color: 'var(--accent-2)', fontFamily: 'var(--fm)' }}>{v.ip}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No visitor sessions logged yet. Share your short link to gather telemetry!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .analytics-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-base);
        }
        .analytics-main {
          display: flex;
          flex: 1;
        }
        .analytics-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
        }
        .analytics-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .back-btn {
          margin-bottom: 8px;
        }
        .analytics-title {
          font-family: var(--ff);
          font-size: 32px;
          font-weight: 800;
        }
        .analytics-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .short-link-href {
          font-family: var(--fm);
          color: var(--accent-2);
          font-weight: 600;
        }
        .short-link-href:hover {
          color: var(--accent-1);
        }

        .info-bar {
          display: flex;
          gap: 48px;
          padding: 16px 24px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 500;
        }
        .original-url-text {
          word-break: break-all;
          transition: var(--transition);
        }
        .original-url-text:hover {
          color: var(--accent-1);
        }

        .analytics-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }

        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .chart-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chart-title {
          font-family: var(--ff);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .chart-container-inner {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .no-data-display {
          color: var(--text-muted);
          font-size: 15px;
        }

        .grid-two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .breakdown-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .breakdown-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .breakdown-label {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 120px;
          flex-shrink: 0;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }
        .breakdown-label span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .breakdown-bar-container {
          flex: 1;
          height: 8px;
          background: var(--bg-hover);
          border-radius: 100px;
          overflow: hidden;
        }
        .breakdown-bar {
          height: 100%;
          border-radius: 100px;
          width: 0%;
          animation: fillBar 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .breakdown-value {
          font-size: 13px;
          color: var(--text-secondary);
          width: 80px;
          text-align: right;
          flex-shrink: 0;
        }

        .recent-visits-section {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }
        .visits-table-wrapper {
          overflow-x: auto;
          width: 100%;
        }
        .col-referrer {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .analytics-loading {
          min-height: 100vh;
          background: var(--bg-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          color: var(--text-secondary);
        }
        .spinner-large {
          animation: spin 1s linear infinite;
          color: var(--accent-1);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fillBar {
          from { width: 0%; }
          to { width: var(--target-width); }
        }

        .animate-fade {
          animation: fadeUp 0.5s ease-out;
        }

        @media (max-width: 990px) {
          .analytics-main { flex-direction: column; }
          .sidebar { width: 100%; height: auto; border-bottom: 1px solid var(--border-subtle); position: relative; top: 0; padding: 16px; }
          .charts-row { grid-template-columns: 1fr; }
          .grid-two-cols { grid-template-columns: 1fr; }
          .analytics-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .info-bar { flex-direction: column; gap: 16px; }
          .analytics-content { padding: 24px 16px; }
        }
        @media (max-width: 600px) {
          .analytics-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
