import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewProduct() {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product data from your backend using the id
    fetch(`https://your-backend-url/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) {
    return <p style={{ padding: "20px" }}>Loading product details...</p>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      <div style={styles.card}>
        <h2 style={styles.title}>{product.name}</h2>
        <p><strong>Price:</strong> ₱{product.price}</p>
        <p><strong>Category:</strong> {product.category || "N/A"}</p>
        <p><strong>Description:</strong> {product.description || "No description available"}</p>
        <p><strong>Seller:</strong> {product.sellerName || "Unknown"}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#0077b6",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "15px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "0 auto",
  },
  title: {
    color: "#0077b6",
  },
};

export default ViewProduct;
