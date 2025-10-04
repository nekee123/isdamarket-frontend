import React, { useEffect, useState } from "react";
import "../App.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const buyer_uid = localStorage.getItem("buyer_uid");
    const res = await fetch(`http://127.0.0.1:8000/orders/buyer/${buyer_uid}`);
    const data = await res.json();
    // Ensure it's always an array
    setOrders(Array.isArray(data) ? data : [data]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderUid) => {
    if (!window.confirm("Are you sure you want to cancel/delete this order?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/orders/${orderUid}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Order cancelled successfully!");
        fetchOrders(); // Refresh orders
      } else {
        const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Cancel order error:", errorData);
        alert(`Failed to cancel order: ${errorData.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Cancel order exception:", err);
      alert(`Error cancelling order: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-teal-100 text-teal-800",
      cancelled: "bg-red-100 text-red-800",
      cancelled_by_buyer: "bg-red-100 text-red-800",
      cancelled_by_seller: "bg-orange-100 text-orange-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      cancelled_by_buyer: "Cancelled by You",
      cancelled_by_seller: "Cancelled by Seller",
    };
    return statusTexts[status] || status;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🛒 My Orders</h1>
      <p className="dashboard-subtitle">View and manage your orders</p>
      
      {orders.length === 0 ? (
        <p style={{color: '#999', fontSize: '1.1rem'}}>No orders yet. Start shopping! 🐟</p>
      ) : (
        <div className="dashboard-cards">
          {orders.map((order) => (
            <div key={order.uid} className="card">
              <h3>{order.fish_product_name}</h3>
              <p style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '1rem'}}>Order ID: {order.uid.substring(0, 8)}...</p>
              
              <div style={{textAlign: 'left', marginBottom: '1rem'}}>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem'}}>
                  <strong>🏪 Seller:</strong> {order.seller_name}
                </p>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem'}}>
                  <strong>📦 Quantity:</strong> {order.quantity} pcs
                </p>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem'}}>
                  <strong>💰 Total:</strong> <span style={{fontSize: '1.3rem', fontWeight: 'bold', color: '#4caf50'}}>₱{order.total_price}</span>
                </p>
              </div>

              <div style={{marginBottom: '1rem'}}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  background: order.status === 'pending' ? '#fff3cd' : 
                             order.status === 'confirmed' ? '#d4edda' : 
                             order.status === 'cancelled' ? '#f8d7da' : '#e2e3e5',
                  color: order.status === 'pending' ? '#856404' : 
                         order.status === 'confirmed' ? '#155724' : 
                         order.status === 'cancelled' ? '#721c24' : '#383d41'
                }}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {order.status === "pending" && (
                <button
                  onClick={() => handleCancelOrder(order.uid)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
