import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { FiMessageCircle } from "react-icons/fi";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function ViewProduct() {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product data from backend using the id
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Error fetching product:", err);
        setProduct({ error: true, message: "Failed to load product" });
      });
  }, [id]);

  const handleMessageSeller = async () => {
    const buyer_uid = localStorage.getItem("buyer_uid");

    if (!buyer_uid) {
      alert("Please log in as a buyer to message the seller.");
      navigate("/buyer-login");
      return;
    }

    if (!product.seller_uid) {
      alert("Seller information not available for this product.");
      return;
    }

    // Create or navigate to conversation with seller
    try {
      const messageData = {
        sender_uid: buyer_uid,
        sender_type: "buyer",
        recipient_uid: product.seller_uid,
        recipient_type: "seller",
        message: `Hi! I'm interested in your product: ${product.name}`,
      };
      
      console.log('Sending message data:', messageData);
      console.log('Backend URL:', `${BASE_URL}/messages/`);
      
      const res = await fetch(`${BASE_URL}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Backend error:', errorData);
        
        // Handle array of errors from FastAPI validation
        let errorMessage = 'Failed to send message';
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          }
        }
        
        alert(`Error: ${errorMessage}`);
        return;
      }

      const responseData = await res.json();
      console.log('Message sent successfully:', responseData);
      
      // Navigate to messages page with a flag to force refresh
      navigate("/buyer-dashboard/messages", { state: { newMessage: true } });
    } catch (err) {
      console.error("Error starting conversation:", err);
      alert(`Failed to send message: ${err.message}`);
    }
  };

  const handleBuyNow = async () => {
    const buyer_uid = localStorage.getItem("buyer_uid");
    const buyer_name = localStorage.getItem("buyer_name");

    if (!buyer_uid) {
      alert("Please log in as a buyer first.");
      navigate("/buyer-login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_uid,
          buyer_name,
          seller_uid: product.seller_uid,
          seller_name: product.seller_name,
          fish_product_uid: product.uid,
          fish_product_name: product.name,
          quantity: 1,
          total_price: product.price,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      alert(`✅ Order placed for ${data.fish_product_name}!`);
      navigate("/buyer-dashboard/orders");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  if (!product) {
    return <p style={{ padding: "20px" }}>Loading product details...</p>;
  }

  if (product.error) {
    return (
      <div style={styles.container}>
        <BackButton />
        <p style={{ color: "red" }}>{product.message}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.card}>
        <h2 style={styles.title}>{product.name}</h2>
        {product.image && <img src={product.image} alt={product.name} style={styles.image} />}
        <p style={styles.price}>₱{product.price}</p>
        <p><strong>Type:</strong> {product.type || "N/A"}</p>
        <p><strong>Quantity Available:</strong> {product.quantity || 0}</p>
        <p><strong>Description:</strong> {product.description || "No description available"}</p>
        <p><strong>Seller:</strong> {product.seller_name || "Unknown"}</p>
        
        <div style={styles.buttonGroup}>
          <button onClick={handleBuyNow} style={styles.buyButton}>
            🛒 Buy Now
          </button>
          <button onClick={handleMessageSeller} style={styles.messageButton}>
            <FiMessageCircle size={20} />
            Message Seller
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    paddingTop: "70px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "0 auto",
  },
  title: {
    color: "#0077b6",
    marginBottom: "15px",
  },
  price: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#4caf50",
    margin: "15px 0",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  buyButton: {
    flex: 1,
    padding: "15px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  messageButton: {
    flex: 1,
    padding: "15px",
    background: "#fff",
    color: "#0891b2",
    border: "2px solid #0891b2",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

export default ViewProduct;
