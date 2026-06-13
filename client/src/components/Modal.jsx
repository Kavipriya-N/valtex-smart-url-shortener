import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(4, 6, 15, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeInOverlay 0.3s ease-out forwards;
        }
        .modal-container {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 460px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          overflow: hidden;
          perspective: 800px;
          transform-style: preserve-3d;
          animation: modalPopCustom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .modal-title {
          font-family: var(--ff);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          transition: var(--transition);
        }
        .modal-close-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .modal-content {
          padding: 24px;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPopCustom {
          from {
            opacity: 0;
            transform: scale(0.8) rotateY(15deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
}
