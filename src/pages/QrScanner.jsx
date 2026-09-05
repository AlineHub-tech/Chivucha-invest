import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, ShieldCheck, CameraOff } from 'lucide-react';
import { stockAPI } from '../api/stockApi'; // Swapped to look up our secure production axios instances
import '../styles/QrScanner.css';

export default function QrScanner() {
  const [stock, setStock] = useState([]);
  const [scannedItem, setScannedItem] = useState(null);
  const [scanError, setScanError] = useState('');
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    const loadWarehouseData = async () => {
      try {
        const data = await stockAPI.getAllStock();
        setStock(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Database connection failure:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWarehouseData();
  }, []);

  useEffect(() => {
    if (!stock.length) return;

    const mountNode = document.getElementById('qr-reader-live-engine');
    if (!mountNode) {
      return;
    }

    const scanner = new Html5QrcodeScanner('qr-reader-live-engine', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: []
    }, false);

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        setScanError('');
        const allFlattenedProducts = stock.flatMap((cat) =>
          cat.products ? cat.products.map((p) => ({ ...p, catName: cat.categoryName })) : []
        );

        const matchedProduct = allFlattenedProducts.find(
          (p) => p._id === decodedText || p.id === decodedText || p.name.toLowerCase() === decodedText.toLowerCase()
        );

        if (matchedProduct) {
          setScannedItem(matchedProduct);
        } else {
          setScanError(`Code Scanned: "${decodedText}" but not matched in Chivucha Stock System database.`);
          setScannedItem(null);
        }
      },
      (error) => {
        if (error && typeof error !== 'string') {
          console.log('Scanner warning:', error);
        }
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error('Failed to clear hardware scanner resource link', err));
      }
    };
  }, [stock]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontWeight: '700' }}>Initializing camera decoder...</div>;
  return (
    <div className="qr-page-fade">
      <div className="qr-page-header">
        <h2>Live Hardware Camera Barcode Decoder</h2>
        <p>Point your phone camera to any product QR/Barcode to stream real stock database balance parameters instantly.</p>
      </div>

      <div className="qr-shell-box">
        <div className="qr-camera-wrapper-frame">
          <div id="qr-reader-live-engine" />
        </div>

        {/* OUTPUT MATRIX RESULTS REAL-TIME PANEL */}
        <div className="qr-output-panel">
          {scanError && (
            <div className="qr-error-status-box">
              <CameraOff size={22} color="#dc2626" />
              <p>{scanError}</p>
            </div>
          )}

          {scannedItem ? (
            <div className="qr-data-success-node">
              <span className="qr-success-pill">
                <ShieldCheck size={12} /> Decryption Verified Live
              </span>
              <h3>{scannedItem.name}</h3>
              
              <div className="qr-specs-sheet">
                <p>Sector Category: <strong>{scannedItem.catName}</strong></p>
                <p>Pack Metric Volume: <strong>{scannedItem.size}</strong></p>
                <p>Unit Valuation Price: <strong>{(Number(scannedItem.price) || 0).toLocaleString()} RWF</strong></p>
                <p>Attributes Context: <strong>{scannedItem.details || 'N/A'}</strong></p>
              </div>

              <div className="qr-balance-badge">
                <span>Real-Time Balance Volume</span>
                <h2>{(Number(scannedItem.qty) || 0).toLocaleString()} Units Left</h2>
              </div>
            </div>
          ) : (
            !scanError && (
              <div className="qr-empty-state-box">
                <QrCode size={28} color="#006400" />
                <p className="qr-empty-text">
                  Camera Interface Active ⚡ Center a traditional product barcode inside the scanner frame grid square to extract warehouse package volume dynamic metrics.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
