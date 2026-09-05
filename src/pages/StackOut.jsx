import React, { useState, useEffect } from 'react';
import { stockAPI } from '../api/stockApi'; // Swapped to look up our secure Render axios instance
import '../styles/StackOut.css';

export default function StackOut() {
  const [stock, setStock] = useState([]);
  const [form, setForm] = useState({ selectedProductId: '', quantity: 1 });
  const [loading, setLoading] = useState(true);

  // 🎯 LOAD RECOVERY PIPELINE FROM MONGO DB ASYNC ENGINE
  const loadDatabaseStock = async () => {
    try {
      const data = await stockAPI.getAllStock();
      setStock(data);
      setLoading(false);
    } catch (err) {
      console.error("Database tracking link failure:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseStock();
  }, []);

  // 🎯 CONNECTED DROPDOWN DATA LINKING PIPELINE
  const allFlattenedProducts = stock.flatMap(cat => 
    cat.products ? cat.products.map(p => ({ ...p, catId: cat._id || cat.id, catName: cat.categoryName })) : []
  );
  const currentSelectedProduct = allFlattenedProducts.find(p => p._id === form.selectedProductId || p.id === form.selectedProductId);

  const handleProcessStackOut = async (e) => {
    e.preventDefault();
    const targetProdId = form.selectedProductId;
    if (!targetProdId || !currentSelectedProduct) return;

    if (currentSelectedProduct.qty < form.quantity) {
      alert("Operational Error: Insufficient stock capacity volume in warehouse nodes!");
      return;
    }

    try {
      // 🎯 CONNECTED DISPATCH STREAM TO EXPRESS BACKEND/MONGODB
      await stockAPI.stackOut(targetProdId, Number(form.quantity));
      
      alert(`Stack-Out Operation Successful: Deducted ${form.quantity} units.`);
      setForm({ selectedProductId: '', quantity: 1 });
      loadDatabaseStock(); // Refresh available volumes dynamically
    } catch (err) {
      alert(err.response?.data?.message || "Stack-Out pipeline routing execution fault.");
    }
  };
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontWeight: '700' }}>Streaming database metrics...</div>;
  return (
    <div className="so-page-fade">
      <div className="so-page-header">
        <h2>Connected Stack-Out Processing Node</h2>
        <p>De-allocate warehouse metrics parameters directly into automated activity ledgers synced with MongoDB.</p>
      </div>

      <div className="so-split-grid">
        <div className="so-panel-card">
          <h4>Process Stack Out Order</h4>
          <form onSubmit={handleProcessStackOut} className="so-node-form">
            <div className="so-form-element">
              <label>Select Tracked Target Product</label>
              <select required value={form.selectedProductId} onChange={(e) => setForm({ ...form, selectedProductId: e.target.value })}>
                <option value="">-- Choose Warehouse Item --</option>
                {allFlattenedProducts.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    [{p.catName}] - {p.name} ({p.size}) - Avail: {p.qty} pcs
                  </option>
                ))}
              </select>
            </div>

            <div className="so-form-element">
              <label>Outflow Quantity Dispatch Volume</label>
              <input type="number" min="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value)) })} />
            </div>

            {currentSelectedProduct && (
              <div className="so-preview-box">
                <p>Unit Price: <strong>{(Number(currentSelectedProduct.price) || 0).toLocaleString()} RWF</strong></p>
                <p>Total Dispatch Net Valuation: <strong style={{ color: '#006400' }}>{((Number(currentSelectedProduct.price) || 0) * form.quantity).toLocaleString()} RWF</strong></p>
              </div>
            )}

            <button type="submit" className="so-submit-btn">Process Outflow Dispatch</button>
          </form>
        </div>

        <div className="so-panel-card">
          <h4>Live Inventory Matrix Quick-Look</h4>
          <div className="so-table-responsive">
            <table className="so-table">
              <thead><tr><th>Tracked Item</th><th>Pack Size</th><th>Current Balance</th></tr></thead>
              <tbody>
                {allFlattenedProducts.slice(0, 8).map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.name}</td>
                    <td>{p.size}</td>
                    <td><strong style={{ color: p.qty < 50 ? '#b91c1c' : '#15803d' }}>{(Number(p.qty) || 0).toLocaleString()} units</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
