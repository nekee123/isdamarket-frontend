import React, { useEffect, useState } from "react";
import "../App.css";
import BackButton from "../components/BackButton";

const BASE_URL = process.env.REACT_APP_API_URL;


function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", type: "", price: "", quantity: "", description: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const seller_uid = localStorage.getItem("seller_uid");
  const seller_name = localStorage.getItem("seller_name");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/`);
        const data = await res.json();
        // Filter only products of this seller
        const myProducts = data.filter(p => p.seller_uid === seller_uid);
        setProducts(myProducts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [seller_uid]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 400; // ID card size
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          setImagePreview(compressedImage);
          setNewProduct({...newProduct, image: compressedImage});
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
  const res = await fetch(`${BASE_URL}/products/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newProduct, seller_uid, seller_name }),
  });
      if (res.ok) {
        const product = await res.json();
        setProducts([...products, product]);
        setNewProduct({ name: "", type: "", price: "", quantity: "", description: "", image: "" });
        setImagePreview(null);
        alert("Product added successfully!");
      } else {
        alert("Failed to add product");
      }
    } catch (err) { 
      console.error(err);
      alert("Error adding product");
    }
  };

  const handleDeleteProduct = async (productUid) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/products/${productUid}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product deleted successfully!");
        setProducts(products.filter(p => p.uid !== productUid));
      } else {
        const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Delete product error:", errorData);
        alert(`Failed to delete product: ${errorData.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Delete product exception:", err);
      alert(`Error deleting product: ${err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <BackButton to="/seller-dashboard" />
      <h1 className="dashboard-title">📦 My Products</h1>
      <p className="dashboard-subtitle">Manage your fish products</p>

      <form onSubmit={handleAddProduct} style={{maxWidth: '600px', margin: '0 auto 3rem', background: '#fff', padding: '2rem', borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'}}>
        <h2 style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center'}}>Add New Product</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <input 
            style={{border: '1px solid #ddd', padding: '0.7rem', borderRadius: '8px', fontSize: '1rem'}}
            placeholder="Product Name" 
            value={newProduct.name} 
            onChange={e => setNewProduct({...newProduct, name:e.target.value})} 
            required 
          />
          <input 
            style={{border: '1px solid #ddd', padding: '0.7rem', borderRadius: '8px', fontSize: '1rem'}}
            placeholder="Type (e.g., Fresh, Frozen)" 
            value={newProduct.type} 
            onChange={e => setNewProduct({...newProduct, type:e.target.value})} 
            required 
          />
          <input 
            style={{border: '1px solid #ddd', padding: '0.7rem', borderRadius: '8px', fontSize: '1rem'}}
            placeholder="Price" 
            type="number" 
            value={newProduct.price} 
            onChange={e => setNewProduct({...newProduct, price:e.target.value})} 
            required 
          />
          <input 
            style={{border: '1px solid #ddd', padding: '0.7rem', borderRadius: '8px', fontSize: '1rem'}}
            placeholder="Quantity" 
            type="number" 
            value={newProduct.quantity} 
            onChange={e => setNewProduct({...newProduct, quantity:e.target.value})} 
            required 
          />
          <textarea 
            style={{border: '1px solid #ddd', padding: '0.7rem', borderRadius: '8px', fontSize: '1rem'}}
            placeholder="Description" 
            value={newProduct.description} 
            onChange={e => setNewProduct({...newProduct, description:e.target.value})} 
            rows="3"
            required 
          />
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555'}}>Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{border: '1px solid #ddd', padding: '0.7rem', borderRadius: '8px', width: '100%'}}
            />
            {imagePreview && (
              <div style={{marginTop: '1rem', textAlign: 'center'}}>
                <img src={imagePreview} alt="Preview" style={{width: '160px', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ddd'}} />
              </div>
            )}
          </div>
          <button type="submit" className="card-btn" style={{width: '100%', marginTop: '0.5rem'}}>
            Add Product
          </button>
        </div>
      </form>

      <div className="dashboard-cards">
        {products.map(p => (
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
              onClick={() => handleDeleteProduct(p.uid)}
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
              Delete Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerProducts;
