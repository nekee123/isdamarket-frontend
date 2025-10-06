import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewProfile() {
  const { id } = useParams(); // user id from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch profile data from backend
    fetch(`https://your-backend-url/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [id]);

  if (!user) {
    return <p style={{ padding: "20px" }}>Loading profile...</p>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      <div style={styles.card}>
        <img
          src={user.profilePicture || "https://via.placeholder.com/100"}
          alt="Profile"
          style={styles.image}
        />
        <h2 style={styles.name}>{user.name}</h2>
        <p><strong>Location:</strong> {user.location || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Role:</strong> {user.role || "Unknown"}</p>
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
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },
  name: {
    color: "#0077b6",
  },
};

export default ViewProfile;
