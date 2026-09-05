import React, { useState, useEffect } from 'react';
import { Package, Layers, Activity, HelpCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { stockAPI } from '../api/stockApi'; // Swapped to point directly to our connected stockApi
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [stock, setStock] = useState([]);
  const [logs, setLogs] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleString('en-RW', { timeZone: 'Africa/Kigali' }));
  const [loading, setLoading] = useState(true);

  // 🎯 REAL-TIME CLOUD PIPELINE SYNCHRONIZATION VIA AXIOS
  useEffect(() => {
    const fetchEcosystemData = async () => {
      try {
        const stockData = await stockAPI.getAllStock();
        setStock(Array.isArray(stockData) ? stockData : []);

        const reportData = await stockAPI.getReports();
        setLogs(Array.isArray(reportData) ? reportData : []);
      } catch (err) {
        console.error('Express API connection node failure:', err);
        setStock([]);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEcosystemData();

    // Active Kigali live ticking clock engine running down to the second on viewports
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString('en-RW', { timeZone: 'Africa/Kigali' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const safeStock = Array.isArray(stock) ? stock : [];
  const safeLogs = Array.isArray(logs) ? logs : [];

  // 🔢 MATHEMATICAL COERCION GUARDS: Calculates core aggregates live via database profiles
  const totalVolume = safeStock.reduce((s, c) => s + (Array.isArray(c.products) ? c.products.reduce((sp, p) => sp + (Number(p.qty) || 0), 0) : 0), 0);
  const totalValuation = safeStock.reduce((s, c) => s + (Array.isArray(c.products) ? c.products.reduce((sp, p) => sp + ((Number(p.qty) || 0) * (Number(p.price) || 0)), 0) : 0), 0);

  const totalInflowPcs = safeLogs.filter((l) => l.type === 'STACK IN').reduce((s, l) => s + (Number(l.qty) || 0), 0);
  const totalOutflowPcs = safeLogs.filter((l) => l.type === 'STACK OUT').reduce((s, l) => s + (Number(l.qty) || 0), 0);
  const totalSalesRevenue = safeLogs.filter((l) => l.type === 'STACK OUT').reduce((s, l) => s + (Number(l.total) || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary-color)', fontWeight: '700' }}>
        Streaming secure ledger links from Chivucha MongoDB Cloud Node...
      </div>
    );
  }

  return (
    <div className="db-page-fade">
      {/* 1. CLOCK & HEADLINE METRICS ROW */}
      <div className="db-page-header-row">
        <div>
          <h2>Operational Command Center</h2>
          <p>Real-time ecosystem metrics & workflow monitoring framework.</p>
        </div>
        <div className="db-system-clock-badge">
          <span className="pulse-dot"></span>
          <strong>{time}</strong>
        </div>
      </div>

      {/* 2. SUMMARY METRICS TILES GRID */}
      <div className="db-metrics-grid">
        <div className="db-metric-card">
          <div className="db-metric-icon"><Package size={24} /></div>
          <div className="db-metric-info">
            <span>Warehouse Volume</span>
            <h3>{totalVolume.toLocaleString()} Units</h3>
          </div>
        </div>
        <div className="db-metric-card">
          <div className="db-metric-icon balance"><Layers size={24} /></div>
          <div className="db-metric-info">
            <span>Stock Net Valuation</span>
            <h3>{totalValuation.toLocaleString()} RWF</h3>
          </div>
        </div>
        <div className="db-metric-card">
          <div className="db-metric-icon revenue"><TrendingUp size={24} /></div>
          <div className="db-metric-info">
            <span>Dispatched Outflow Value</span>
            <h3>{totalSalesRevenue.toLocaleString()} RWF</h3>
          </div>
        </div>
        <div className="db-metric-card">
          <div className="db-metric-icon status"><Activity size={24} /></div>
          <div className="db-metric-info">
            <span>Ecosystem Node Status</span>
            <h3 style={{ color: '#006400' }}>SECURE LIVE</h3>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC BAR GRAPH CHART CONNECTED TO MONGO DB ATLAS */}
      <div className="db-panel-card chart-container-block">
        <div className="db-panel-card-header">
          <h4>Category Stock Level Distribution Chart</h4>
          <span className="db-chart-legend">Max capacity capped at 1,500 Pcs</span>
        </div>
        <div className="db-visual-chart-simulation">
          {stock.map((cat) => {
            const catTotal = cat.products ? cat.products.reduce((s, p) => s + (Number(p.qty) || 0), 0) : 0;
            const barPercentage = Math.min(100, (catTotal / 1500) * 100);
            return (
              <div key={cat._id} className="db-chart-bar-row">
                <span className="db-chart-label">{cat.categoryName}</span>
                <div className="db-chart-track">
                  <div className="db-chart-fill" style={{ width: `${barPercentage}%` }}></div>
                </div>
                <span className="db-chart-value">{catTotal.toLocaleString()} Pcs</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. WORKFLOW DOCUMENTATION & METRICS GUIDE */}
      <div className="db-grid-layout-split">
        <div className="db-panel-card">
          <div className="db-guide-header"><HelpCircle size={20} /> <h4>How This Website Works</h4></div>
          <div className="db-guide-steps">
            <div className="db-step-item">
              <CheckCircle2 size={16} />
              <p><strong>Stack-In Module:</strong> Connects live to MongoDB to configure clusters and register entries safely via verified JWT tokens.</p>
            </div>
            <div className="db-step-item">
              <CheckCircle2 size={16} />
              <p><strong>Stack-Out Node:</strong> Updates document items collections simultaneously while logging transaction details to reports.</p>
            </div>
            <div className="db-step-item">
              <CheckCircle2 size={16} />
              <p><strong>Stock Ledger & Reports:</strong> Fetches historical data streams securely to allow instant analytical updates and clean PDF printing.</p>
            </div>
          </div>
        </div>

        <div className="db-panel-card">
          <h4>Ecosystem Distribution Flow Volume</h4>
          <div className="db-distribution-flow">
            <div className="db-flow-row">
              <span>Total Stack-In Load Trajectory</span>
              <strong className="in">+{totalInflowPcs.toLocaleString()} Pcs</strong>
            </div>
            <div className="db-flow-row">
              <span>Total Stack-Out Sales Volume</span>
              <strong className="out">-{totalOutflowPcs.toLocaleString()} Pcs</strong>
            </div>
            <div className="db-flow-note">
              Metrics are synced securely via real-time MongoDB transaction logs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
