import React, { useState, useEffect } from 'react';
import { stockAPI } from '../api/stockApi'; // Swapped to look up our secure production axios instances
import '../styles/Stock.css';

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnifiedLedgerData = async () => {
      try {
        const stockData = await stockAPI.getAllStock();
        setStock(Array.isArray(stockData) ? stockData : []);

        const reportData = await stockAPI.getReports();
        setLogs(Array.isArray(reportData) ? reportData : []);
      } catch (err) {
        console.error('Database connection failure:', err);
        setStock([]);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadUnifiedLedgerData();
  }, []);

  const safeLogs = Array.isArray(logs) ? logs : [];

  const calculateFlows = (productName, unitPrice, initialQty) => {
    const itemLogs = safeLogs.filter((l) => {
      const prod = (l && l.product) ? String(l.product) : '';
      return prod === productName || prod.startsWith(productName);
    });

    const inLogs = itemLogs.filter(l => l && l.type === "STACK IN");
    const totalIn = inLogs.reduce((acc, curr) => acc + (Number(curr && curr.qty) || 0), 0);
    const lastInDate = inLogs.length > 0 ? inLogs[0].date : "N/A";

    const outLogs = itemLogs.filter(l => l && l.type === "STACK OUT");
    const totalOut = outLogs.reduce((acc, curr) => acc + (Number(curr && curr.qty) || 0), 0);
    const lastOutDate = outLogs.length > 0 ? outLogs[0].date : "N/A";

    const totalOutPrice = totalOut * (Number(unitPrice) || 0);
    const displayedIn = totalIn > 0 ? totalIn : (Number(initialQty) || 0);

    return { displayedIn, lastInDate, totalOut, lastOutDate, totalOutPrice };
  };
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontWeight: '700' }}>Loading Chivucha stock ledger...</div>;
  return (
    <div className="st-page-fade">
      <div className="st-page-header">
        <h2>Stock Overview</h2>
        <p>Review available products, incoming stock, outgoing stock, and current value.</p>
      </div>

      {stock.map((cat) => (
        <div key={cat._id} className="st-group-card">
          <div className="st-group-header">
            <h3>{cat.categoryName}</h3>
            <span className="st-cat-badge">{cat.products ? cat.products.length : 0} Tracked Items</span>
          </div>
          
          <div className="st-table-responsive">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Stock In (Loaded)</th>
                  <th>Stock Out (Dispatched)</th>
                  <th>Total Out Price</th>
                </tr>
              </thead>
              <tbody>
                {!cat.products || cat.products.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>No items loaded in this sector.</td></tr>
                ) : (
                  cat.products.map(p => {
                    const metrics = calculateFlows(p.name, p.price, p.qty);
                    return (
                      <tr key={p._id}>
                        <td>
                          <strong>{p.name}</strong>
                          <div className="st-item-sub-meta">Size: {p.size} | Unit: {(Number(p.price) || 0).toLocaleString()} RWF</div>
                        </td>
                        <td>
                          <div className="st-metric-flow in">+{(Number(metrics.displayedIn) || 0).toLocaleString()} Pcs</div>
                          <small className="st-time-stamp">Date: {metrics.lastInDate}</small>
                        </td>
                        <td>
                          <div className="st-metric-flow out">-{(Number(metrics.totalOut) || 0).toLocaleString()} Pcs</div>
                          <small className="st-time-stamp">Date: {metrics.lastOutDate}</small>
                        </td>
                        <td>
                          <strong className="st-price-valuation">
                            {(Number(metrics.totalOutPrice) || 0).toLocaleString()} RWF
                          </strong>
                          <div className="st-item-sub-meta">Based on quantities</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
