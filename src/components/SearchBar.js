import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ defaultType, userType }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(defaultType); // "products" or "sellers"/"buyers"
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const fetchData = async (query) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/search?query=${query}&search_type=${searchType}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
    } else {
      const delayDebounce = setTimeout(() => {
        fetchData(searchTerm);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, searchType]);

  const options =
    userType === "buyer"
      ? [
          { value: "products", label: "Products" },
          { value: "sellers", label: "Sellers" },
        ]
      : [
          { value: "products", label: "Products" },
          { value: "buyers", label: "Buyers" },
        ];

  const handleClick = (item) => {
    if (searchType === "products") {
      navigate(`/product/${item.id}`);
    } else {
      navigate(`/profile/${item.id}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <FiSearch size={18} color="#0077b6" />
        <select
          style={styles.select}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={`Search ${searchType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
      </div>

      {results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map((item, index) => (
            <div
              key={index}
              style={styles.resultItem}
              onClick={() => handleClick(item)}
            >
              <strong>{item.name}</strong>
              {item.price && <p style={styles.subText}>₱{item.price}</p>}
              {item.location && <p style={styles.subText}>{item.location}</p>}
              <button
                style={styles.viewBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(item);
                }}
              >
                {searchType === "products" ? "View Product" : "View Profile"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "320px",
    marginLeft: "20px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#be92aeff",
    borderRadius: "25px",
    padding: "8px 12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  select: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#091217ff",
    fontWeight: "600",
    marginRight: "8px",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: "14px",
  },
  dropdown: {
    position: "absolute",
    top: "45px",
    left: 0,
    width: "100%",
    background: "#dbadc1ff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(155, 79, 104, 0.1)",
    zIndex: 10,
    maxHeight: "250px",
    overflowY: "auto",
  },
  resultItem: {
    padding: "8px 12px",
    borderBottom: "1px solid #0f0e0eff",
    textAlign: "left",
    cursor: "pointer",
  },
  subText: {
    fontSize: "12px",
    color: "#c44f4fff",
    margin: 0,
  },
  viewBtn: {
    background: "#1e2a30ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "4px 8px",
    fontSize: "12px",
    marginTop: "5px",
    cursor: "pointer",
  },
};

export default SearchBar;
