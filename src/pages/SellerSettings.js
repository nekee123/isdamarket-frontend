import React, { useState, useEffect } from "react";
import "../App.css";
import BackButton from "../components/BackButton";

const BASE_URL = process.env.REACT_APP_API_URL;

function SellerSettings() {
  const [seller, setSeller] = useState({ name: "", email: "", contact_number: "", profile_picture: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const seller_uid = localStorage.getItem("seller_uid");

  useEffect(() => {
    const fetchSeller = async () => {
     try {
  const res = await fetch(`${BASE_URL}/sellers/${seller_uid}`);
  if (!res.ok) throw new Error("Failed to fetch seller");
  const data = await res.json();
  setSeller({ 
    name: data.name, 
    email: data.email, 
    contact_number: data.contact_number,
    profile_picture: data.profile_picture || ""
  });
        if (data.profile_picture) {
          setImagePreview(data.profile_picture);
        }
      } catch (err) { console.error(err); }
    };
    fetchSeller();
  }, [seller_uid]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300; // ID card size for profile
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
          setSeller({...seller, profile_picture: compressedImage});
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/sellers/${seller_uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seller),
      });
      if (res.ok) alert("Profile updated successfully!");
    } catch (err) { 
      console.error(err); 
    }
  };

  return (
    <div className="dashboard-container">
      <BackButton to="/seller-dashboard" />
      <h1 className="dashboard-title">⚙️ Seller Settings</h1>
      <p className="dashboard-subtitle">Manage your seller account information</p>
      
      <form onSubmit={handleUpdate} style={{maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}>
        {/* Profile Picture Section */}
        <div style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Profile" 
              style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #667eea', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'}}
            />
          ) : (
            <div style={{width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '4rem', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'}}>
              {seller.name ? seller.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <label style={{cursor: 'pointer', padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderRadius: '25px', fontWeight: 'bold', transition: 'transform 0.2s', border: 'none', marginTop: '1rem'}}>
            <span>📷 Change Profile Picture</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{display: 'none'}}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#555', marginBottom: '0.5rem'}}>👤 Name</label>
            <input 
              style={{width: '100%', border: '2px solid #e0e0e0', padding: '1rem', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              value={seller.name} 
              onChange={e => setSeller({...seller, name:e.target.value})} 
              placeholder="Your Name" 
              required 
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div>
            <label style={{display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#555', marginBottom: '0.5rem'}}>✉️ Email</label>
            <input 
              style={{width: '100%', border: '2px solid #e0e0e0', padding: '1rem', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              value={seller.email} 
              onChange={e => setSeller({...seller, email:e.target.value})} 
              placeholder="your.email@example.com" 
              type="email"
              required 
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div>
            <label style={{display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#555', marginBottom: '0.5rem'}}>📞 Contact Number</label>
            <input 
              style={{width: '100%', border: '2px solid #e0e0e0', padding: '1rem', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              value={seller.contact_number} 
              onChange={e => setSeller({...seller, contact_number:e.target.value})} 
              placeholder="+63 912 345 6789" 
              required 
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
        </div>

        <button 
          type="submit" 
          style={{marginTop: '2rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', transition: 'transform 0.2s'}}
        >
          ✔ Update Profile
        </button>
      </form>
    </div>
  );
}

export default SellerSettings;
