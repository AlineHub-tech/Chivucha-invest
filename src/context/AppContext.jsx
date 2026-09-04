import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const initialProducts = [
  {
    id: generateId(),
    name: 'Imifuka y’umuceri',
    sku: 'RICE-001',
    category: 'Groceries',
    stockQuantity: 48,
    purchasePrice: 4000,
    sellingPrice: 5500,
    minStockLevel: 10,
    unit: 'bags',
    location: 'Warehouse A',
    qrCodeValue: 'RICE-001',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Amavuta yo guteka',
    sku: 'OIL-002',
    category: 'Groceries',
    stockQuantity: 12,
    purchasePrice: 2500,
    sellingPrice: 3500,
    minStockLevel: 8,
    unit: 'bottles',
    location: 'Warehouse A',
    qrCodeValue: 'OIL-002',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Icyayi cy’umwimerere',
    sku: 'TEA-003',
    category: 'Beverages',
    stockQuantity: 22,
    purchasePrice: 1500,
    sellingPrice: 2400,
    minStockLevel: 6,
    unit: 'boxes',
    location: 'Warehouse B',
    qrCodeValue: 'TEA-003',
    createdAt: new Date().toISOString(),
  },
];

const initialTransactions = [
  {
    id: generateId(),
    type: 'sale',
    productId: initialProducts[0].id,
    productName: initialProducts[0].name,
    quantity: 8,
    amount: 44000,
    date: new Date().toISOString(),
    note: 'Retail sale to local customer',
  },
  {
    id: generateId(),
    type: 'stock_in',
    productId: initialProducts[1].id,
    productName: initialProducts[1].name,
    quantity: 20,
    amount: 50000,
    date: new Date().toISOString(),
    note: 'New batch received',
  },
];

const initialMessages = [
  {
    id: generateId(),
    sender: 'Boss',
    text: 'Mureke dukore update ya stock y’umuceri mbere ya 4:00 PM.',
    timestamp: new Date().toISOString(),
  },
  {
    id: generateId(),
    sender: 'Stockkeeper',
    text: 'Nibyo boss, ndakora raporo ndakwandikira.',
    timestamp: new Date().toISOString(),
  },
];

const roles = {
  boss: { name: 'Boss', role: 'owner' },
  stockkeeper: { name: 'Stockkeeper', role: 'storekeeper' },
  manager: { name: 'Manager', role: 'admin' },
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [messages, setMessages] = useState(initialMessages);
  const [scanResult, setScanResult] = useState(null);

  const login = (email, roleKey) => {
    const profile = roles[roleKey] || { name: 'Employee', role: 'cashier' };
    setUser({ name: profile.name, email, role: profile.role });
  };

  const logout = () => {
    setUser(null);
  };

  const addProduct = (product) => {
    const createdProduct = {
      ...product,
      id: generateId(),
      stockQuantity: Number(product.stockQuantity) || 0,
      qrCodeValue: product.sku || `QR-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProducts((current) => [...current, createdProduct]);
    return createdProduct;
  };

  const updateProduct = (product) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              ...product,
              stockQuantity: Number(product.stockQuantity) || item.stockQuantity,
              sellingPrice: Number(product.sellingPrice) || item.sellingPrice,
              purchasePrice: Number(product.purchasePrice) || item.purchasePrice,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts((current) => current.filter((item) => item.id !== productId));
  };

  const addTransaction = (transaction) => {
    setTransactions((current) => [
      {
        ...transaction,
        id: generateId(),
        date: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const recordInventoryMovement = ({ productId, type, quantity, amount, note }) => {
    const safeQuantity = Number(quantity) || 0;
    const safeAmount = Number(amount) || 0;

    setProducts((current) =>
      current.map((item) => {
        if (item.id !== productId) return item;

        let nextQuantity = item.stockQuantity;
        if (type === 'stock_in') nextQuantity = item.stockQuantity + safeQuantity;
        if (type === 'stock_out' || type === 'sale') nextQuantity = item.stockQuantity - safeQuantity;

        return {
          ...item,
          stockQuantity: Math.max(0, nextQuantity),
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const product = products.find((item) => item.id === productId);
    addTransaction({
      type,
      productId,
      productName: product?.name || 'Unknown product',
      quantity: safeQuantity,
      amount: safeAmount,
      note: note || '',
    });
  };

  const addMessage = (message) => {
    setMessages((current) => [
      {
        id: generateId(),
        sender: user?.name || 'Unknown',
        text: message,
        timestamp: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const scanProductByQr = (value) => {
    const product = products.find((item) => item.qrCodeValue === value);
    setScanResult(product || { error: 'Product not found for this QR code' });
    return product;
  };

  const summary = useMemo(() => {
    const totalStock = products.reduce((total, item) => total + item.stockQuantity, 0);
    const lowStock = products.filter((item) => item.stockQuantity <= item.minStockLevel).length;
    const totalSales = transactions.filter((item) => item.type === 'sale').reduce((sum, item) => sum + item.amount, 0);
    const totalCost = transactions.filter((item) => item.type === 'stock_in').reduce((sum, item) => sum + item.amount, 0);
    const profit = totalSales - totalCost;
    const today = new Date();
    const todayTransactions = transactions.filter((item) => new Date(item.date).toDateString() === today.toDateString());
    return { totalStock, lowStock, totalSales, profit, totalCost, todayTransactions };
  }, [products, transactions]);

  const value = {
    user,
    login,
    logout,
    products,
    transactions,
    messages,
    scanResult,
    addProduct,
    updateProduct,
    deleteProduct,
    addTransaction,
    recordInventoryMovement,
    addMessage,
    scanProductByQr,
    summary,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
