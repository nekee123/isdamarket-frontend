import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function BuyerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch("http://127.0.0.1:8000/buyers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Login failed" }));
        alert(`Login failed: ${errorData.detail || "Check your credentials"}`);
        console.error("Login error:", errorData);
        return;
      }

      const data = await res.json();
      localStorage.setItem("buyer_uid", data.uid);
      localStorage.setItem("buyer_name", data.name);
      navigate("/buyer-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Cannot connect to server. Check console for errors.");
    }
  };

  // ---------------- SIGNUP ----------------
  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const contact_number = form.contact.value;
    const password = form.password.value;

    try {
      const res = await fetch("http://127.0.0.1:8000/buyers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contact_number, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Sign up failed" }));
        alert(`Sign up failed: ${errorData.detail || "Unknown error"}`);
        console.error("Sign up error:", errorData);
        return;
      }

      const data = await res.json();
      localStorage.setItem("buyer_uid", data.uid);
      localStorage.setItem("buyer_name", data.name);
      navigate("/buyer-dashboard");
    } catch (err) {
      console.error("Sign up error:", err);
      alert("Sign up failed. Cannot connect to server. Check console for errors.");
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fddde6, #d4f1f9)', padding: '2rem'}}>
      <div style={{background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '3rem', width: '100%', maxWidth: '450px'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🛒</div>
          <h2 style={{fontSize: '2rem', color: '#ff69b4', marginBottom: '0.5rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>Buyer {isLogin ? "Login" : "Sign Up"}</h2>
          <p style={{color: '#888', fontSize: '0.95rem'}}>Welcome back! Please enter your details</p>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.8rem',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isLogin ? '#ffb6c1' : '#f0f0f0',
              color: '#fff'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.8rem',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: !isLogin ? '#ffb6c1' : '#f0f0f0',
              color: '#fff'
            }}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              required 
              style={{padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              onFocus={(e) => e.target.style.borderColor = '#ffb6c1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required 
              style={{padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              onFocus={(e) => e.target.style.borderColor = '#ffb6c1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <button 
              type="submit" 
              style={{padding: '1rem', border: 'none', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', background: '#ffb6c1', color: '#fff', marginTop: '0.5rem'}}
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              required 
              style={{padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              onFocus={(e) => e.target.style.borderColor = '#ffb6c1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              required 
              style={{padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              onFocus={(e) => e.target.style.borderColor = '#ffb6c1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <input 
              type="text" 
              name="contact" 
              placeholder="Contact Number" 
              required 
              style={{padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              onFocus={(e) => e.target.style.borderColor = '#ffb6c1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required 
              style={{padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s'}}
              onFocus={(e) => e.target.style.borderColor = '#ffb6c1'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <button 
              type="submit" 
              style={{padding: '1rem', border: 'none', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', background: '#ffb6c1', color: '#fff', marginTop: '0.5rem'}}
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BuyerLogin;
