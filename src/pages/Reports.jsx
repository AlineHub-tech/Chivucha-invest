import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { stockAPI } from '../api/apiService';
import '../styles/Reports.css';

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 FETCH REPORT LOGS LIVE FROM MONGO DB ON PAGE LOAD
  useEffect(() => {
    const loadDatabaseLogs = async () => {
      try {
        const reportData = await stockAPI.getReports();
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

  // 🎯 PDF EXPORT ENGINE: Gukora print-to-pdf isobanutse neza
  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary-color)', fontWeight: '700' }}>
        Streaming transaction history logs from Chivucha MongoDB Node...
      </div>
    );
  }
  return (
    <div className="rep-page-fade">
      <div className="rep-page-header-row">
        <div>
          <h2>Ecosystem Audits & Transaction Reports</h2>
          <p>Comprehensive logging streaming of all stack operations dynamic metrics.</p>
        </div>
        <button className="rep-btn-download" onClick={handleDownloadPDF} disabled={logs.length === 0}>
          <Download size={16} /> Download PDF Report
        </button>
      </div>

      <div className="rep-panel-card printable-area">
        <div className="rep-print-header">
          <h3>CHIVUCHA INVESTMENT LTD</h3>
          <p>Official Inventory Operations & Audit Report Ledger</p>
          <small>Generated on: {new Date().toLocaleString('en-RW')}</small>
        </div>

        <h4>System Logs Balance Stream</h4>
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
                  <td colSpan="6" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
                    No system transaction logs verified inside the database stream yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id || log.id}>
                    <td className="rep-td-date">{log.date}</td>
                    <td>
                      <span className={`rep-pill ${log.type === 'STACK IN' ? 'inflow' : 'outflow'}`}>
                        {log.type === 'STACK IN' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {log.type}
                      </span>
                    </td>
                    <td><strong>{log.product}</strong></td>
                    <td>{log.qty.toLocaleString()} Pcs</td>
                    <td>{log.price.toLocaleString()} RWF</td>
                    <td><strong>{log.total.toLocaleString()} RWF</strong></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
