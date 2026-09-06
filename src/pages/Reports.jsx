import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { reportAPI } from '../api/reportApi'; // Updated to point directly to our connected reportApi file
import '../styles/Reports.css';

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 REAL-TIME CLOUD PIPELINE DATA STREAM INJECTION
  useEffect(() => {
    const loadDatabaseLogs = async () => {
      try {
        const reportData = await reportAPI.getReports();
        setLogs(Array.isArray(reportData) ? reportData : []);
      } catch (err) {
        console.error('Database tracking link failed:', err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadDatabaseLogs();
  }, []);

  // 🎯 SMART PRINT TO A4 DOCUMENT LAYOUT
  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary-color)', fontWeight: '700' }}>
        Loading Chivucha transaction reports...
      </div>
    );
  }

  return (
    <div className="rep-page-fade">
      <div className="rep-page-header-row">
        <div>
          <h2>Inventory Reports</h2>
          <p>Review the history of stock received and products dispatched.</p>
        </div>
        <button className="rep-btn-download" onClick={handleDownloadPDF} disabled={logs.length === 0}>
          <Download size={16} /> Download PDF Report
        </button>
      </div>

      <div className="rep-panel-card printable-area">
        <div className="rep-print-header">
          <h3>CHIVUCHA INVESTMENT LTD</h3>
          <p>Official Chivucha Inventory Operations Report</p>
          <small>Generated on: {new Date().toLocaleString('en-RW', { timeZone: 'Africa/Kigali' })}</small>
        </div>

        <h4>Inventory Transaction History</h4>
        <div className="rep-table-responsive">
          <table className="rep-table">
            <thead>
              <tr>
                <th>Timestamp Logs</th>
                <th>Transaction Mode</th>
                <th>Impacted Product</th>
                <th>Quantity Vol</th>
                <th>Unit Value</th>
                <th>Total Net Valuation</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                    No inventory transactions have been recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  // Explicit mathematical coercion guards before parsing to localized strings
                  const safeQty = Number(log.qty) || 0;
                  const safePrice = Number(log.price) || 0;
                  const safeTotal = Number(log.total) || 0;

                  return (
                    <tr key={log._id}>
                      <td className="rep-td-date">{log.date}</td>
                      <td>
                        <span className={`rep-pill ${log.type === 'STACK IN' ? 'inflow' : 'outflow'}`}>
                          {log.type === 'STACK IN' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {log.type}
                        </span>
                      </td>
                      <td><strong>{log.product}</strong></td>
                      <td>{safeQty.toLocaleString()} Pcs</td>
                      <td>{safePrice.toLocaleString()} RWF</td>
                      <td><strong>{safeTotal.toLocaleString()} RWF</strong></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
