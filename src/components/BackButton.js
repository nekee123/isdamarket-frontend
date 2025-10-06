import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleBack} style={styles.backButton}>
      ← Back
    </button>
  );
};

const styles = {
  backButton: {
    position: "fixed",
    top: "20px",
    left: "20px",
    background: "#bd8ab1ff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
};

export default BackButton;
