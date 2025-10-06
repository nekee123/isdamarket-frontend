import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function ViewProduct() {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product data from backend using the id
    fetch(`http://127.0.0.1:8000/products/${id}`)
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

  const handleBuyNow = async () => {
    const buyer_uid = localStorage.getItem("buyer_uid");
    const buyer_name = localStorage.getItem("buyer_name");

    if (!buyer_uid) {
      alert("Please log in as a buyer first.");
      navigate("/buyer-login");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/orders/`, {
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
        
        <button onClick={handleBuyNow} style={styles.buyButton}>
          🛒 Buy Now
        </button>
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
  buyButton: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
};

export default ViewProduct;
