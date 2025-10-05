import React, { useEffect, useState } from "react";
import "../App.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const seller_uid = localStorage.getItem("seller_uid");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders/seller/${seller_uid}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [seller_uid]);

  const handleAcceptOrder = async (orderUid) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderUid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
        alert(`Failed to confirm order: ${errorData.detail || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Error confirming order: ${err.message}`);
    }
  };

  const handleCancelOrder = async (orderUid) => {
    if (!window.confirm("Are you sure you want to cancel/delete this order?")) return;

    try {
      const res = await fetch(`${BASE_URL}/orders/${orderUid}`, { method: "DELETE" });
      if (res.ok) fetchOrders();
    } catch (err) {
      alert(`Error cancelling order: ${err.message}`);
    }
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      cancelled_by_buyer: "Cancelled by Buyer",
      cancelled_by_seller: "Cancelled by You",
    };
    return texts[status] || status;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🛒 Customer Orders</h1>
      <p className="dashboard-subtitle">Manage orders from your customers</p>

      {orders.length === 0 ? (
        <p style={{ color: "#999", fontSize: "1.1rem" }}>No orders yet 🐠</p>
      ) : (
        <div className="dashboard-cards">
          {orders.map((order) => (
            <div key={order.uid} className="card">
              <h3>{order.fish_product_name}</h3>
              <p style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "1rem" }}>
                Order ID: {order.uid.substring(0, 8)}...
              </p>

              <div style={{ textAlign: "left", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.3rem" }}>
                  <strong>👤 Buyer:</strong> {order.buyer_name}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.3rem" }}>
                  <strong>📱 Contact:</strong> {order.buyer_contact}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.3rem" }}>
                  <strong>📦 Quantity:</strong> {order.quantity} pcs
                </p>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
                  <strong>💰 Total:</strong> 
                  <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#4caf50" }}>
                    ₱{order.total_price}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    background:
                      order.status === "pending"
                        ? "#fff3cd"
                        : order.status === "confirmed"
                        ? "#d4edda"
                        : order.status === "cancelled"
                        ? "#f8d7da"
                        : "#e2e3e5",
                    color:
                      order.status === "pending"
                        ? "#856404"
                        : order.status === "confirmed"
                        ? "#155724"
                        : order.status === "cancelled"
                        ? "#721c24"
                        : "#383d41",
                  }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              {order.status === "pending" && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleAcceptOrder(order.uid)} style={{ flex: 1, padding: "0.6rem", background: "#4caf50", color: "white", border: "none", borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}>
                    ✓ Confirm
                  </button>
                  <button onClick={() => handleCancelOrder(order.uid)} style={{ flex: 1, padding: "0.6rem", background: "#f44336", color: "white", border: "none", borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}>
                    ✗ Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerOrders;
