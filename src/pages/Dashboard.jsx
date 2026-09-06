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
        Loading Chivucha dashboard data...
      </div>
    );
  }

  return (
    <div className="db-page-fade">
      {/* 1. CLOCK & HEADLINE METRICS ROW */}
      <div className="db-page-header-row">
        <div>
          <h2>Operational Command Center</h2>
          <p>Live inventory performance and daily operations overview.</p>
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
            <span>Business Operations Status</span>
            <h3 style={{ color: '#006400' }}>ACTIVE</h3>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY STOCK LEVEL CHART */}
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
          <div className="db-guide-header"><HelpCircle size={20} /> <h4>How the workflow works</h4></div>
          <p className="db-panel-intro">The system is organized around four simple operational steps.</p>
          <div className="db-guide-steps">
            <div className="db-step-item">
              <span className="db-step-number">01</span><CheckCircle2 size={16} />
              <p><strong>Stack-In:</strong> Create categories and register incoming products with quantity and price.</p>
            </div>
            <div className="db-step-item">
              <span className="db-step-number">02</span><CheckCircle2 size={16} />
              <p><strong>Stack-Out:</strong> Dispatch stock only when enough quantity is available.</p>
            </div>
            <div className="db-step-item">
              <span className="db-step-number">03</span><CheckCircle2 size={16} />
              <p><strong>Stock Ledger:</strong> Shows current quantities, inflow, outflow, and valuation.</p>
            </div>
            <div className="db-step-item">
              <span className="db-step-number">04</span><CheckCircle2 size={16} />
              <p><strong>Reports:</strong> Keeps a chronological audit trail for review and printing.</p>
            </div>
          </div>
        </div>

        <div className="db-panel-card">
          <h4>Inventory Movement Summary</h4>
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
              Stock movement totals from recorded Chivucha transactions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
