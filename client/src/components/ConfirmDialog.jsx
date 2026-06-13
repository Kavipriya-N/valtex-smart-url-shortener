import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-container">
        <div className="confirm-icon-box">
          <AlertTriangle size={36} style={{ color: 'var(--accent-3)' }} />
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>

      <style>{`
        .confirm-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
        }
        .confirm-icon-box {
          background: rgba(236, 72, 153, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.2);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .confirm-message {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
        }
        .confirm-actions {
          display: flex;
          gap: 16px;
          width: 100%;
        }
        .confirm-actions .btn {
          flex: 1;
        }
      `}</style>
    </Modal>
  );
}
