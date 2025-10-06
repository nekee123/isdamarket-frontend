import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function SellerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${BASE_URL}/sellers/login`, {
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

      // Save token and user info
      localStorage.setItem("seller_token", data.token); // <--- token
      localStorage.setItem("seller_uid", data.uid);
      localStorage.setItem("seller_name", data.name);

      navigate("/seller-dashboard");
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
      const res = await fetch(`${BASE_URL}/sellers/`, {
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

      // Save token and user info
      localStorage.setItem("seller_token", data.token); // <--- token
      localStorage.setItem("seller_uid", data.uid);
      localStorage.setItem("seller_name", data.name);

      navigate("/seller-dashboard");
    } catch (err) {
      console.error("Sign up error:", err);
      alert("Sign up failed. Cannot connect to server. Check console for errors.");
    }
  };

  const inputStyle = {
    padding: "1rem", border: "2px solid #100707ff", borderRadius: "10px",
    fontSize: "1rem", outline: "none", transition: "border 0.3s", marginBottom: "0.5rem"
  };

  const submitStyle = {
    padding: "1rem", border: "none", borderRadius: "25px", fontSize: "1.1rem",
    fontWeight: "bold", cursor: "pointer", background: "c07b94ff", color: "#111010ff"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fddde6, #d4f1f9)", padding: "2rem" }}>
      <div style={{ background: "#e0cdcdff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "3rem", width: "100%", maxWidth: "450px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐟</div>
          <h2 style={{ fontSize: "2rem", color: "#c07b94ff", marginBottom: "0.5rem", fontWeight: "bold", textShadow: "1px 1px 2px rgba(20, 19, 19, 0.8)" }}>
            Seller {isLogin ? "Login" : "Sign Up"}
          </h2>
          <p style={{ color: "#060505ff", fontSize: "0.95rem" }}>Manage your fish market business</p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={() => setIsLogin(true)} style={{
            flex: 1, padding: "0.8rem", border: "none", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold",
            cursor: "pointer", transition: "all 0.3s", background: isLogin ? "#c07b94ff" : "#ccbebeff", color: "#f7f7f7ff"
          }}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} style={{
            flex: 1, padding: "0.8rem", border: "none", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold",
            cursor: "pointer", transition: "all 0.3s", background: !isLogin ? "#c07b94ff" : "#cdbac1ff", color: "#fff"
          }}>
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <input type="email" name="email" placeholder="Email" required style={inputStyle} />
            <input type="password" name="password" placeholder="Password" required style={inputStyle} />
            <button type="submit" style={submitStyle}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <input type="text" name="name" placeholder="Name" required style={inputStyle} />
            <input type="email" name="email" placeholder="Email" required style={inputStyle} />
            <input type="text" name="contact" placeholder="Contact Number" required style={inputStyle} />
            <input type="password" name="password" placeholder="Password" required style={inputStyle} />
            <button type="submit" style={submitStyle}>Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
}


export default SellerLogin;
