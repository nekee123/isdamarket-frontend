import React, { useEffect, useState } from "react";
import "../App.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function BrowseFish() {
  const [products, setProducts] = useState([]);
  const [sellerGroups, setSellerGroups] = useState({});

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/`);
        const data = await res.json();
        console.log("Fetched products:", data);
        setProducts(data);
        
        // Group products by seller
        const grouped = data.reduce((acc, product) => {
          const sellerKey = product.seller_uid;
          if (!acc[sellerKey]) {
            acc[sellerKey] = {
              seller_name: product.seller_name,
              seller_uid: product.seller_uid,
              products: []
            };
          }
          acc[sellerKey].products.push(product);
          return acc;
        }, {});
        
        setSellerGroups(grouped);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleBuyNow = async (product) => {
    const buyer_uid = localStorage.getItem("buyer_uid");
    const buyer_name = localStorage.getItem("buyer_name");

    if (!buyer_uid) {
      alert("Please log in as a buyer first.");
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
      alert(`✅ Order placed for ${data.fish_product_name}`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🐟 Browse Fresh Fish</h1>
      <p className="dashboard-subtitle">Browse available fish products from our sellers</p>
      
      {Object.keys(sellerGroups).length === 0 ? (
        <p style={{color: '#999', fontSize: '1.1rem'}}>No fish available yet 🐠</p>
      ) : (
        <>
          {Object.values(sellerGroups).map((seller) => (
            <div key={seller.seller_uid} style={{marginBottom: '3rem'}}>
              <h2 className="dashboard-title" style={{fontSize: '2rem'}}>
                🏪 {seller.seller_name}'s Shop
              </h2>
              <p className="dashboard-subtitle">
                {seller.products.length} product(s) available
              </p>
              
              <div className="dashboard-cards">
                {seller.products.map((p) => (
                  <div key={p.uid} className="card">
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem'}} />
                    ) : (
                      <div style={{width: '100%', height: '150px', background: 'linear-gradient(135deg, #e0f7ff, #b3e5fc)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
                        <span style={{fontSize: '3rem'}}>🐟</span>
                      </div>
                    )}
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50', margin: '0.5rem 0'}}>₱{p.price}</p>
                    <p style={{fontSize: '0.85rem', color: '#999', marginBottom: '1rem'}}>Stock: {p.quantity}</p>
                    <button 
                      onClick={() => handleBuyNow(p)}
                      className="card-btn"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default BrowseFish;
