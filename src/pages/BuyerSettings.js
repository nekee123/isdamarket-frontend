import React, { useState, useEffect } from "react";
import "../App.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function BuyerSettings() {
  const [buyer, setBuyer] = useState({ name: "", email: "", contact_number: "", profile_picture: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const buyer_uid = localStorage.getItem("buyer_uid");

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const res = await fetch(`${BASE_URL}/buyers/${buyer_uid}`);
        const data = await res.json();
        setBuyer({ 
          name: data.name, 
          email: data.email, 
          contact_number: data.contact_number,
          profile_picture: data.profile_picture || ""
        });
        if (data.profile_picture) {
          setImagePreview(data.profile_picture);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBuyer();
  }, [buyer_uid]);

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
          setBuyer({...buyer, profile_picture: compressedImage});
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/buyers/${buyer_uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyer),
      });
      if (res.ok) alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">⚙️ Profile Settings</h1>
      <p className="dashboard-subtitle">Manage your buyer account information</p>
      
      <form onSubmit={handleUpdate} style={{maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}>
        {/* Profile Picture Section */}
        <div style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{marginBottom: '1.5rem'}}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile" 
                style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #667eea', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'}}
              />
            ) : (
              <div style={{width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '4rem', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'}}>
                {buyer.name ? buyer.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <label style={{cursor: 'pointer', padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderRadius: '25px', fontWeight: 'bold', transition: 'transform 0.2s', border: 'none'}}>
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
              value={buyer.name} 
              onChange={e => setBuyer({...buyer, name:e.target.value})} 
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
              value={buyer.email} 
              onChange={e => setBuyer({...buyer, email:e.target.value})} 
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
              value={buyer.contact_number} 
              onChange={e => setBuyer({...buyer, contact_number:e.target.value})} 
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

export default BuyerSettings;
