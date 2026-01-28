import React, { useState, useEffect } from "react";

const ASSETS = ["BTC", "ETH", "SOL"];
const STORAGE_KEY = "crypto_portfolio_v1";

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState("ETH");

  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { BTC: [], ETH: [], SOL: [] };
  });

  const [prices, setPrices] = useState({ BTC: "", ETH: "", SOL: "" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ amount: "", price: "", date: today });

  const addPurchase = () => {
    if (!form.amount || !form.price || !form.date) return;

    setPortfolio({
      ...portfolio,
      [selectedAsset]: [
        ...portfolio[selectedAsset],
        { id: Date.now(), ...form, amount: Number(form.amount), price: Number(form.price) }
      ]
    });

    setForm({ amount: "", price: "", date: today });
  };

  const deletePurchase = (id) => {
    setPortfolio({
      ...portfolio,
      [selectedAsset]: portfolio[selectedAsset].filter(p => p.id !== id)
    });
  };

  const updatePurchase = (id, field, value) => {
    setPortfolio({
      ...portfolio,
      [selectedAsset]: portfolio[selectedAsset].map(p =>
        p.id === id ? { ...p, [field]: field === "date" ? value : Number(value) } : p
      )
    });
  };

  const calcStats = (purchases, currentPrice) => {
    const totalAmount = purchases.reduce((s, p) => s + p.amount, 0);
    const totalCost = purchases.reduce((s, p) => s + p.amount * p.price, 0);
    const avgPrice = totalAmount ? totalCost / totalAmount : 0;
    const currentValue = currentPrice ? totalAmount * currentPrice : 0;
    const pnl = currentValue - totalCost;
    const pnlPct = totalCost ? (pnl / totalCost) * 100 : 0;

    return { totalAmount, totalCost, avgPrice, currentValue, pnl, pnlPct };
  };

  // حساب بيانات الجدول + ترتيب
  const tableData = ASSETS.map((asset) => {
    const stats = calcStats(portfolio[asset], Number(prices[asset]));
    return { asset, ...stats, price: prices[asset] };
  }).sort((a, b) => b.currentValue - a.currentValue);

  // ملخص المحفظة الكامل
  const portfolioSummary = tableData.reduce(
    (acc, row) => {
      acc.totalInvested += row.totalCost;
      acc.currentValue += row.currentValue;
      return acc;
    },
    { totalInvested: 0, currentValue: 0 }
  );

  const portfolioPnL = portfolioSummary.currentValue - portfolioSummary.totalInvested;
  const portfolioPnLPct = portfolioSummary.totalInvested
    ? (portfolioPnL / portfolioSummary.totalInvested) * 100
    : 0;

  const pnlColor = (value) => {
    if (value > 10) return "green";
    if (value > -10) return "orange";
    return "red";
  };

  const tableData = ASSETS.map((asset) => {
    const stats = calcStats(portfolio[asset], Number(prices[asset]));
    return { asset, ...stats, price: prices[asset] };
  }).sort((a, b) => b.currentValue - a.currentValue);

  const purchases = portfolio[selectedAsset];
  const stats = calcStats(purchases, Number(prices[selectedAsset]));

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>💼 Crypto Portfolio Tracker</h1>

      {/* جدول ترتيب العملات */}
      <section style={{ marginTop: 30 }}>
        <h2>📋 ملخص المحفظة (مرتّب حسب المبلغ الحالي)</h2>

        <div style={{ marginBottom: 20, padding: 15, border: "1px solid #ccc" }}>
          <h3>📌 إجمالي Portfolio</h3>
          <p>إجمالي المستثمر: {portfolioSummary.totalInvested.toFixed(2)}</p>
          <p>القيمة الحالية: {portfolioSummary.currentValue.toFixed(2)}</p>
          <p style={{ color: pnlColor(portfolioPnLPct) }}>
            الربح / الخسارة: {portfolioPnL.toFixed(2)} ({portfolioPnLPct.toFixed(2)}%)
          </p>
        </div>
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>العملة</th>
              <th>متوسط الشراء</th>
              <th>إجمالي المستثمر</th>
              <th>السعر الحالي</th>
              <th>المبلغ الحالي</th>
              <th>الربح / الخسارة</th>
              <th>% الربح</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(row => (
              <tr key={row.asset}>
                <td>{row.asset}</td>
                <td>{row.avgPrice.toFixed(2)}</td>
                <td>{row.totalCost.toFixed(2)}</td>
                <td>
                  <input
                    style={{ width: 80 }}
                    value={prices[row.asset]}
                    onChange={(e) => setPrices({ ...prices, [row.asset]: e.target.value })}
                  />
                </td>
                <td>{row.currentValue.toFixed(2)}</td>
                <td style={{ color: row.pnl >= 0 ? "green" : "red" }}>
                  {row.pnl.toFixed(2)}
                </td>
                <td style={{ color: row.pnl >= 0 ? "green" : "red" }}>
                  {row.pnlPct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* اختيار عملة */}
      <section style={{ marginTop: 30 }}>
        <h2>🪙 اختيار العملة</h2>
        <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}>
          {ASSETS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </section>

      {/* إضافة شراء */}
      <section style={{ marginTop: 30 }}>
        <h2>➕ إضافة عملية شراء ({selectedAsset})</h2>
        <input
          placeholder="الكمية"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />{" "}
        <input
          placeholder="سعر الشراء"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />{" "}
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />{" "}
        <button onClick={addPurchase}>إضافة</button>
      </section>

      {/* تفاصيل العملة المختارة */}
      <section style={{ marginTop: 30 }}>
        <h2>📊 تفاصيل — {selectedAsset}</h2>
        <p>إجمالي الكمية: {stats.totalAmount}</p>
        <p>إجمالي المستثمر: {stats.totalCost.toFixed(2)}</p>
        <p>متوسط الشراء: {stats.avgPrice.toFixed(2)}</p>
        <p>المبلغ الحالي: {stats.currentValue.toFixed(2)}</p>
        <p style={{ color: stats.pnl >= 0 ? "green" : "red" }}>
          الربح / الخسارة: {stats.pnl.toFixed(2)} ({stats.pnlPct.toFixed(2)}%)
        </p>

        <h3>🧾 سجل المشتريات</h3>
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id}>
                <td>{p.date}</td>
                <td>{p.amount}</td>
                <td>{p.price}</td>
                <td>
                  <button onClick={() => deletePurchase(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p style={{ marginTop: 40, color: "green" }}>
        ✔ يتم حفظ البيانات تلقائيًا على هذا الجهاز
      </p>
    </div>
  );
}
