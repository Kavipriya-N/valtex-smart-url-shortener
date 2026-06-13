import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import UrlTable from '../components/UrlTable';
import SkeletonTable from '../components/SkeletonTable';
import Modal from '../components/Modal';
import QRModal from '../components/QRModal';
import ConfirmDialog from '../components/ConfirmDialog';
import CreateLinkCard from '../components/CreateLinkCard';
import api from '../api/axios';
import { Link2, Search, ArrowUpDown, ArrowRight, RefreshCw, Layers, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // Data States
  const [urls, setUrls] = useState([]);
  const [totalUrlsCount, setTotalUrlsCount] = useState(0);
  const [newUrlId, setNewUrlId] = useState(null);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    totalVisits: 0,
    activeLinks: 0
  });

  // Loading States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUrls, setLoadingUrls] = useState(true);

  // Pagination & Filtering
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [updatingUrl, setUpdatingUrl] = useState(false);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingUrl, setDeletingUrl] = useState(false);

  // Sync tab from search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'overview' || tab === 'links')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch Overview Stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/analytics/overview');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load stats overview.');
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch URLs
  const fetchUrls = async (isNewItem = false) => {
    try {
      setLoadingUrls(true);
      const res = await api.get('/urls', {
        params: {
          page,
          limit: activeTab === 'overview' ? 5 : 10,
          search,
          sort
        }
      });
      if (res.data.success) {
        setUrls(res.data.urls);
        setTotalUrlsCount(res.data.pagination.total);
        setTotalPages(res.data.pagination.pages);
        if (!isNewItem) {
          setNewUrlId(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load links.');
    } finally {
      setLoadingUrls(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUrls(false);
  }, [page, search, sort, activeTab]);

  const handleTabChange = (tabId) => {
    if (tabId === 'profile') {
      navigate('/profile');
    } else {
      setActiveTab(tabId);
      setPage(1);
    }
  };

  // Callback when a URL is created in CreateLinkCard
  const handleUrlCreated = (newUrl) => {
    setNewUrlId(newUrl._id);
    fetchStats();
    fetchUrls(true);
  };

  // Edit URL handler triggers
  const triggerEdit = (url) => {
    setEditingUrl(url);
    setEditOriginalUrl(url.originalUrl);
    setEditExpiryDate(url.expiryDate ? new Date(url.expiryDate).toISOString().split('T')[0] : '');
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdatingUrl(true);
    try {
      const res = await api.put(`/urls/${editingUrl._id}`, {
        originalUrl: editOriginalUrl,
        expiryDate: editExpiryDate || null
      });
      if (res.data.success) {
        toast.success('Link updated successfully!');
        setIsEditOpen(false);
        fetchUrls();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update link.');
    } finally {
      setUpdatingUrl(false);
    }
  };

  // Delete URL handler triggers
  const triggerDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    setDeletingUrl(true);
    try {
      const res = await api.delete(`/urls/${deletingId}`);
      if (res.data.success) {
        toast.success('Link deleted successfully!');
        setIsDeleteOpen(false);
        fetchStats();
        fetchUrls();
      }
    } catch (err) {
      toast.error('Failed to delete link.');
    } finally {
      setDeletingUrl(false);
    }
  };

  // QR Modal triggers
  const triggerQR = (url) => {
    setQrUrl(url);
    setIsQrOpen(true);
  };

  // Analytics view redirect
  const viewAnalytics = (id) => {
    navigate(`/analytics/${id}`);
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dash-layout">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} linkCount={totalUrlsCount} />

        <main className="dash-main animate-fade">
          {activeTab === 'overview' && (
            <div>
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1>Good morning, {firstName} ✦</h1>
                  <p>Here's your link performance at a glance</p>
                </div>
                <button className="refresh-btn" onClick={() => { fetchStats(); fetchUrls(); }} title="Refresh Data">
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="metrics-grid">
                <MetricCard
                  label="Total Links"
                  value={loadingStats ? 0 : stats.totalLinks}
                  colorClass="v1"
                  icon="🔗"
                />
                <MetricCard
                  label="Active Links"
                  value={loadingStats ? 0 : stats.activeLinks}
                  colorClass="v4"
                  icon="📂"
                />
                <MetricCard
                  label="Total Clicks"
                  value={loadingStats ? 0 : stats.totalClicks}
                  colorClass="v2"
                  icon="👆"
                />
                <MetricCard
                  label="Unique Visitors"
                  value={loadingStats ? 0 : stats.totalVisits}
                  colorClass="v3"
                  icon="👥"
                />
              </div>

              {/* Create Link Card Component */}
              <CreateLinkCard onUrlCreated={handleUrlCreated} />

              <div className="table-card">
                <div className="table-card-header">
                  <h2>Recent Links</h2>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleTabChange('links')}>
                    View All →
                  </button>
                </div>

                {loadingUrls ? (
                  <SkeletonTable rows={5} />
                ) : (
                  <UrlTable
                    urls={urls.slice(0, 5)}
                    onDelete={triggerDelete}
                    onEdit={triggerEdit}
                    onQR={triggerQR}
                    onAnalytics={viewAnalytics}
                    newUrlId={newUrlId}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div>
              <div className="page-header">
                <h1>My Links</h1>
                <p>Search, filter, and manage all your shortened links.</p>
              </div>

              <div className="table-controls card glass" style={{ display: 'flex', gap: '16px', padding: '16px', marginBottom: '24px' }}>
                <div className="search-box" style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} className="search-icon" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="search"
                    className="si2"
                    placeholder="🔍  Search links…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    autoComplete="off"
                    spellCheck="false"
                    style={{ paddingLeft: '44px', width: '100%' }}
                  />
                </div>

                <div className="sort-box" style={{ position: 'relative' }}>
                  <ArrowUpDown size={18} className="sort-icon" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <select 
                    className="fi" 
                    value={sort} 
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    style={{ paddingLeft: '44px', width: '180px', height: '40px', cursor: 'pointer' }}
                  >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-clickCount">Most Clicked</option>
                    <option value="clickCount">Least Clicked</option>
                  </select>
                </div>
              </div>

              {loadingUrls ? (
                <SkeletonTable rows={8} />
              ) : (
                <>
                  <UrlTable
                    urls={urls}
                    onDelete={triggerDelete}
                    onEdit={triggerEdit}
                    onQR={triggerQR}
                    onAnalytics={viewAnalytics}
                    newUrlId={newUrlId}
                  />

                  {totalPages > 1 && (
                    <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '24px' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      >
                        Prev
                      </button>
                      <span className="page-info" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Page {page} of {totalPages}
                      </span>
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Link Settings">
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="fg">
            <label htmlFor="editUrl">Original URL</label>
            <div className="input-wrapper">
              <input
                id="editUrl"
                type="url"
                className="fi"
                value={editOriginalUrl}
                onChange={(e) => setEditOriginalUrl(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="fg">
            <label htmlFor="editExpiry">Expiration Date</label>
            <div className="input-wrapper">
              <input
                id="editExpiry"
                type="date"
                className="fi"
                value={editExpiryDate}
                onChange={(e) => setEditExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updatingUrl}>
              {updatingUrl ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <QRModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} url={qrUrl} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Short Link?"
        message="Are you sure you want to delete this short code? This will permanently disable the URL redirection and delete all accumulated visit analytics. This action cannot be undone."
      />

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-base);
        }
        .dashboard-main {
          display: flex;
          flex: 1;
        }
        .dashboard-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }
        .dashboard-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .welcome-title {
          font-family: var(--ff);
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .welcome-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .refresh-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          cursor: pointer;
        }
        .refresh-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
          color: var(--text-primary);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .recent-links-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-subheader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .section-subheader h3 {
          font-family: var(--ff);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .view-all-btn {
          background: transparent;
          border: none;
          color: var(--accent-1);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .view-all-btn:hover {
          color: var(--accent-2);
        }
        .table-controls {
          display: flex;
          justify-content: space-between;
          padding: 16px 24px;
          gap: 24px;
        }
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .search-box input {
          width: 100%;
          padding-left: 44px;
        }
        .sort-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sort-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          margin-top: 16px;
        }
        .page-btn {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
        }
        .page-btn:hover:not(:disabled) {
          border-color: var(--accent-1);
          color: var(--accent-1);
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 14px;
          color: var(--text-secondary);
        }
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }
        .animate-fade {
          animation: fadeUp 0.5s ease-out;
        }
        @media (max-width: 990px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dashboard-main { flex-direction: column; }
          .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border-subtle); padding: 16px; position: relative; top: 0; }
          .dashboard-content { padding: 24px 16px; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          .table-controls { flex-direction: column; gap: 16px; }
          .sort-box select { width: 100%; }
        }
      `}</style>
    </div>
  );
}
