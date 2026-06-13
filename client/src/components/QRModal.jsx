import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Copy, Download, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export default function QRModal({ isOpen, onClose, url }) {
  const [useFallback, setUseFallback] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUseFallback(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (useFallback && canvasRef.current && url) {
      const alias = url.customAlias || url.shortCode;
      const qrBaseUrl = `https://vltx.io/${alias}`;
      QRCode.toCanvas(canvasRef.current, qrBaseUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#0A0C18', light: '#FFFFFF' }
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
  }, [useFallback, url]);

  if (!url) return null;

  const alias = url.customAlias || url.shortCode;
  const displayUrl = url.shortUrl;
  const qrBaseUrl = `https://vltx.io/${alias}`;

  const size = '200x200';
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(qrBaseUrl)}&bgcolor=ffffff&color=0a0c18&format=svg&margin=10&ecc=M`;
  const downloadPngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrBaseUrl)}&bgcolor=ffffff&color=0a0c18&format=png&margin=10&ecc=M`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadQR = () => {
    if (useFallback && canvasRef.current) {
      const urlImage = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `valtex-qr-${alias}.png`;
      link.href = urlImage;
      link.click();
    } else {
      const link = document.createElement('a');
      link.href = downloadPngUrl;
      link.target = '_blank';
      link.download = `valtex-qr-${alias}.png`;
      link.click();
    }
    toast.success('QR Code downloaded!');
  };

  const handleQRError = () => {
    setUseFallback(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share QR Code">
      <div className="qr-modal-content">
        <div className="qr-container">
          {!useFallback ? (
            <img
              id="qrImage"
              src={qrSrc}
              alt={`QR Code for ${displayUrl}`}
              width="200"
              height="200"
              loading="lazy"
              style={{
                borderRadius: '12px',
                display: 'block',
                border: '1px solid var(--border-default)',
                animation: 'qrImageReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
                clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
              }}
              onError={handleQRError}
            />
          ) : (
            <canvas
              id="qrCanvas"
              ref={canvasRef}
              width="200"
              height="200"
              style={{
                borderRadius: '12px',
                display: 'block',
                margin: '0 auto',
                background: '#FFFFFF',
                animation: 'qrImageReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
                clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
              }}
            />
          )}
          <div id="qrScanLine"></div>
        </div>

        <p className="qr-info">
          Scan this code to immediately redirect to:<br />
          <span className="short-url-text">{displayUrl}</span>
        </p>

        <div className="qr-actions">
          <button className="btn btn-secondary" onClick={handleCopyLink}>
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button className="btn btn-primary" onClick={handleDownloadQR}>
            <Download size={16} />
            Download QR
          </button>
        </div>
      </div>

      <style>{`
        .qr-modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .qr-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 24px;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
        }
        #qrScanLine {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-2), transparent);
          box-shadow: 0 0 10px var(--accent-2);
          animation: scanLine 2s linear infinite;
          pointer-events: none;
        }
        .qr-info {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          text-align: center;
          margin-bottom: 24px;
        }
        .short-url-text {
          font-family: var(--fm);
          color: var(--accent-2);
          font-weight: 500;
          word-break: break-all;
          display: inline-block;
          margin-top: 4px;
        }
        .qr-actions {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        .qr-actions .btn {
          flex: 1;
        }
        @keyframes qrImageReveal {
          from { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
          to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
        }
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </Modal>
  );
}
