import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, X, Save, FolderPlus } from 'lucide-react';
import { stockAPI } from '../api/stockApi';
import '../styles/StackIn.css';

export default function StackIn() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const resolveUserRole = () => {
    const storedRole = localStorage.getItem('chivucha_user_role');
    if (storedRole) return storedRole.toUpperCase();

    const token = localStorage.getItem('chivucha_jwt_token');
    if (!token) return 'GUEST';

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return (payload.role || 'GUEST').toUpperCase();
    } catch (error) {
      return 'GUEST';
    }
  };

  const userRole = resolveUserRole();
  const canManageInventory = Boolean(localStorage.getItem('chivucha_jwt_token')) || userRole === 'ADMIN';

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isEditCatModalOpen, setIsEditCatModalOpen] = useState(false);
  const [isAddProdModalOpen, setIsAddProdModalOpen] = useState(false);
  const [isEditProdModalOpen, setIsEditProdModalOpen] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProdCatId, setEditingProdCatId] = useState('');
  const [addProductForm, setAddProductForm] = useState({ name: '', size: '', details: '', qty: '', price: '' });

  const loadDatabaseStock = async () => {
    try {
      const data = await stockAPI.getAllStock();
      setStock(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Database connection fault:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseStock();
  }, []);
  const executeAddCategory = async (e) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;
    try {
      await stockAPI.addCategory(trimmedName);
      await loadDatabaseStock();
      setIsAddCatModalOpen(false);
      setNewCategoryName('');
    } catch (err) {
      const message = err?.response?.data?.message || 'Category creation failed.';
      alert(message);
    }
  };

  const executeUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await stockAPI.updateCategory(editingCategory._id, editingCategory.categoryName.trim());
      await loadDatabaseStock();
      setIsEditCatModalOpen(false);
    } catch (err) {
      const message = err?.response?.data?.message || 'Category update failed.';
      alert(message);
    }
  };

  const executeDeleteCategory = async (catId, catName) => {
    if (window.confirm(`⚠️ Erase "${catName}" and ALL products inside from MongoDB?`)) {
      try {
        await stockAPI.deleteCategory(catId);
        await loadDatabaseStock();
      } catch (err) {
        const message = err?.response?.data?.message || 'Category deletion failed.';
        alert(message);
      }
    }
  };

  const executeAddProduct = async (e) => {
    e.preventDefault();
    try {
      await stockAPI.addProduct(activeCategoryId, {
        name: addProductForm.name.trim(),
        size: addProductForm.size.trim(),
        details: addProductForm.details.trim(),
        qty: Number(addProductForm.qty) || 0,
        price: Number(addProductForm.price) || 0
      });
      await loadDatabaseStock();
      setIsAddProdModalOpen(false);
      setAddProductForm({ name: '', size: '', details: '', qty: '', price: '' });
    } catch (err) {
      const message = err?.response?.data?.message || 'Product creation failed.';
      alert(message);
    }
  };

  const executeUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await stockAPI.updateProduct(editingProduct._id, {
        ...editingProduct,
        name: editingProduct.name.trim(),
        size: editingProduct.size.trim(),
        details: (editingProduct.details || '').trim(),
        qty: Number(editingProduct.qty) || 0,
        price: Number(editingProduct.price) || 0
      });
      await loadDatabaseStock();
      setIsEditProdModalOpen(false);
    } catch (err) {
      const message = err?.response?.data?.message || 'Product update failed.';
      alert(message);
    }
  };

  const executeDeleteProduct = async (prodId, prodName) => {
    if (window.confirm(`Remove "${prodName}" from database?`)) {
      try {
        await stockAPI.deleteProduct(prodId);
        await loadDatabaseStock();
      } catch (err) {
        const message = err?.response?.data?.message || 'Product deletion failed.';
        alert(message);
      }
    }
  };
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontWeight: '700', color: '#006400' }}>Streaming database records from MongoDB Atlas...</div>;

      return (
    <div className="si-page-fade">
      <div className="si-page-header-row">
        <div>
          <h2>Control Center Node</h2>
          <p>Absolute CRUD panel for sectors and products synced live with MongoDB.</p>
        </div>
        {canManageInventory && (
          <button className="si-btn-primary green-btn" onClick={() => setIsAddCatModalOpen(true)}>
            <FolderPlus size={16} /> Add New Category
          </button>
        )}
      </div>

      {stock.length === 0 && canManageInventory && (
        <div className="si-group-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <h3 style={{ marginBottom: '12px' }}>No category created yet</h3>
          <p style={{ marginBottom: '18px', color: '#64748b' }}>Start by creating the first warehouse category.</p>
          <button className="si-btn-primary green-btn" onClick={() => setIsAddCatModalOpen(true)}>
            <FolderPlus size={16} /> Create First Category
          </button>
        </div>
      )}

      {stock.map((cat) => (
        <div key={cat._id} className="si-group-card">
          <div className="si-group-header">
            <div className="si-cat-title-area">
              <h3>{cat.categoryName}</h3>
              {userRole === 'ADMIN' && (
                <div className="si-cat-crud-actions">
                  <button className="si-cat-action-btn edit" onClick={() => { setEditingCategory({ ...cat }); setIsEditCatModalOpen(true); }}>Edit Title</button>
                  <button className="si-cat-action-btn delete" onClick={() => executeDeleteCategory(cat._id, cat.categoryName)}>Delete Cat</button>
                </div>
              )}
            </div>
            {userRole === 'ADMIN' && (
              <button className="si-btn-primary" onClick={() => { setActiveCategoryId(cat._id); setIsAddProdModalOpen(true); }}>
                <PlusCircle size={14} /> Add Product
              </button>
            )}
          </div>
          
          <div className="si-table-responsive">
            <table className="si-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Size</th>
                  <th>Details Specs</th>
                  <th>Stock Vol</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!cat.products || cat.products.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No managed products here.</td></tr>
                ) : (
                  cat.products.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="si-spec-badge">{p.size}</span></td>
                      <td>{p.details}</td>
                      <td><strong className="si-qty-count">{(Number(p.qty) || 0).toLocaleString()} Pcs</strong></td>
                      <td>{(Number(p.price) || 0).toLocaleString()} RWF</td>
                      <td>
                        {userRole === 'ADMIN' ? (
                          <div className="si-crud-group">
                            <button className="si-btn-icon edit" onClick={() => { setEditingProdCatId(cat._id); setEditingProduct({...p}); setIsEditProdModalOpen(true); }}><Edit size={14} /></button>
                            <button className="si-btn-icon delete" onClick={() => executeDeleteProduct(p._id, p.name)}><Trash2 size={14} /></button>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>Read-Only View</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {isAddCatModalOpen && (
        <div className="si-modal-overlay" onClick={() => setIsAddCatModalOpen(false)}>
          <div className="si-modal-card select-box" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header"><h3>Create Category</h3><button onClick={() => setIsAddCatModalOpen(false)}><X size={18} /></button></div>
            <form onSubmit={executeAddCategory} className="si-modal-form">
              <div className="si-form-group"><label>Category Name</label><input type="text" required value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} /></div>
              <button type="submit" className="si-btn-primary full-btn"><Save size={16} /> Save Category</button>
            </form>
          </div>
        </div>
      )}

      {isEditCatModalOpen && editingCategory && (
        <div className="si-modal-overlay" onClick={() => setIsEditCatModalOpen(false)}>
          <div className="si-modal-card select-box" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header"><h3>Modify Category</h3><button onClick={() => setIsEditCatModalOpen(false)}><X size={18} /></button></div>
            <form onSubmit={executeUpdateCategory} className="si-modal-form">
              <div className="si-form-group"><label>Category Title</label><input type="text" required value={editingCategory.categoryName} onChange={(e) => setEditingCategory({...editingCategory, categoryName: e.target.value})} /></div>
              <button type="submit" className="si-btn-primary full-btn"><Save size={16} /> Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {isAddProdModalOpen && (
        <div className="si-modal-overlay" onClick={() => setIsAddProdModalOpen(false)}>
          <div className="si-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header"><h3>Load Product</h3><button onClick={() => setIsAddProdModalOpen(false)}><X size={18} /></button></div>
            <form onSubmit={executeAddProduct} className="si-modal-form">
              <div className="si-form-group"><label>Product Name</label><input type="text" required value={addProductForm.name} onChange={(e) => setAddProductForm({...addProductForm, name: e.target.value})} /></div>
              <div className="si-form-grid">
                <div className="si-form-group"><label>Size</label><input type="text" required value={addProductForm.size} onChange={(e) => setAddProductForm({...addProductForm, size: e.target.value})} /></div>
                <div className="si-form-group"><label>Details</label><input type="text" required value={addProductForm.details} onChange={(e) => setAddProductForm({...addProductForm, details: e.target.value})} /></div>
              </div>
              <div className="si-form-grid">
                <div className="si-form-group"><label>Stock Volume</label><input type="number" required value={addProductForm.qty} onChange={(e) => setAddProductForm({...addProductForm, qty: e.target.value})} /></div>
                <div className="si-form-group"><label>Unit Price</label><input type="number" required value={addProductForm.price} onChange={(e) => setAddProductForm({...addProductForm, price: e.target.value})} /></div>
              </div>
              <button type="submit" className="si-btn-primary full-btn"><Save size={16} /> Save Product</button>
            </form>
          </div>
        </div>
      )}

      {isEditProdModalOpen && editingProduct && (
        <div className="si-modal-overlay" onClick={() => setIsEditProdModalOpen(false)}>
          <div className="si-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header"><h3>Modify Product</h3><button onClick={() => setIsEditProdModalOpen(false)}><X size={18} /></button></div>
            <form onSubmit={executeUpdateProduct} className="si-modal-form">
              <div className="si-form-group"><label>Product Name</label><input type="text" required value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
              <div className="si-form-grid">
                <div className="si-form-group"><label>Size</label><input type="text" required value={editingProduct.size} onChange={(e) => setEditingProduct({...editingProduct, size: e.target.value})} /></div>
                <div className="si-form-group"><label>Details</label><input type="text" required value={editingProduct.details} onChange={(e) => setEditingProduct({...editingProduct, details: e.target.value})} /></div>
              </div>
              <div className="si-form-grid">
                <div className="si-form-group"><label>Stock Volume</label><input type="number" required value={editingProduct.qty} onChange={(e) => setEditingProduct({...editingProduct, qty: Number(e.target.value)})} /></div>
                <div className="si-form-group"><label>Unit Price</label><input type="number" required value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></div>
              </div>
              <button type="submit" className="si-btn-primary full-btn"><Save size={16} /> Commit Updates</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
