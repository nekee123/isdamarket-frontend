import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function ViewProfile() {
  const { id } = useParams(); // user id from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Try fetching as seller first, then buyer
    const fetchProfile = async () => {
      try {
        // Try seller endpoint
        let res = await fetch(`${BASE_URL}/sellers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUserType("Seller");
          return;
        }

        // Try buyer endpoint
        res = await fetch(`${BASE_URL}/buyers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUserType("Buyer");
          return;
        }

        throw new Error("User not found");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser({ error: true, message: "Failed to load profile" });
      }
    };

    fetchProfile();
  }, [id]);

  if (!user) {
    return <p style={{ padding: "20px" }}>Loading profile...</p>;
  }

  if (user.error) {
    return (
      <div style={styles.container}>
        <BackButton />
        <p style={{ color: "red" }}>{user.message}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.card}>
        {user.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt={user.name}
            style={styles.profileImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{
          ...styles.avatar,
          display: user.profile_picture ? 'none' : 'flex'
        }}>
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <h2 style={styles.name}>{user.name}</h2>
        <p style={styles.userType}>{userType}</p>
        <p><strong>Location:</strong> {user.location || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Contact:</strong> {user.contact_number || "N/A"}</p>
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
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "0 auto",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#0077b6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "bold",
    margin: "0 auto 15px",
  },
  name: {
    color: "#0077b6",
    marginBottom: "5px",
  },
  userType: {
    color: "#666",
    fontSize: "14px",
    fontStyle: "italic",
    marginTop: "0",
    marginBottom: "15px",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 15px",
    display: "block",
  },
};

export default ViewProfile;
