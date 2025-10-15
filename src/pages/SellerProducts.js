import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import { FiPlus, FiTrash2, FiEdit, FiImage, FiPackage, FiDollarSign } from "react-icons/fi";
import { colors, gradients, shadows, borderRadius, typography } from "../styles/theme";

const BASE_URL = process.env.REACT_APP_API_URL;

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", type: "", price: "", quantity: "", description: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { sellerAuth } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (sellerAuth.isAuthenticated) {
      fetchProducts();
    }
  }, [sellerAuth.uid]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/products/`);
      const data = await res.json();
      const myProducts = data.filter(p => p.seller_uid === sellerAuth.uid);
      setProducts(myProducts);
    } catch (err) {
      console.error(err);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

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
        body: JSON.stringify({ 
          ...newProduct, 
          seller_uid: sellerAuth.uid, 
          seller_name: sellerAuth.name 
        }),
      });
      if (res.ok) {
        const product = await res.json();
        setProducts([...products, product]);
        setNewProduct({ name: "", type: "", price: "", quantity: "", description: "", image: "" });
        setImagePreview(null);
        setShowAddForm(false);
        showToast("Product added successfully!", "success");
      } else {
        showToast("Failed to add product", "error");
      }
    } catch (err) { 
      console.error(err);
      showToast("Error adding product", "error");
    }
  };

  const handleDeleteProduct = async (productUid) => {
    try {
      const res = await fetch(`${BASE_URL}/products/${productUid}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Product deleted successfully!", "success");
        setProducts(products.filter(p => p.uid !== productUid));
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch (err) {
      console.error("Delete product exception:", err);
      showToast("Error deleting product", "error");
    }
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar userType="seller" showSearch={false} />
        <LoadingSpinner fullScreen={false} />
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <Navbar userType="seller" showSearch={false} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Products</h1>
            <p style={styles.subtitle}>Manage your fish market inventory</p>
          </div>
          <button 
            style={styles.addButton}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FiPlus size={20} />
            <span>{showAddForm ? 'Cancel' : 'Add Product'}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddProduct} style={styles.addForm}>
            <h2 style={styles.formTitle}>Add New Fish Product</h2>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Product Name *</label>
                <input 
                  style={styles.input}
                  placeholder="e.g., Fresh Tuna" 
                  value={newProduct.name} 
                  onChange={e => setNewProduct({...newProduct, name:e.target.value})} 
                  required 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Type *</label>
                <input 
                  style={styles.input}
                  placeholder="e.g., Fresh, Frozen, Dried" 
                  value={newProduct.type} 
                  onChange={e => setNewProduct({...newProduct, type:e.target.value})} 
                  required 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Price (₱) *</label>
                <div style={styles.inputWithIcon}>
                  <FiDollarSign size={18} style={styles.inputIcon} />
                  <input 
                    style={{...styles.input, paddingLeft: '2.5rem'}}
                    placeholder="0.00" 
                    type="number" 
                    step="0.01"
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price:e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Stock Quantity *</label>
                <div style={styles.inputWithIcon}>
                  <FiPackage size={18} style={styles.inputIcon} />
                  <input 
                    style={{...styles.input, paddingLeft: '2.5rem'}}
                    placeholder="0" 
                    type="number" 
                    value={newProduct.quantity} 
                    onChange={e => setNewProduct({...newProduct, quantity:e.target.value})} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description *</label>
              <textarea 
                style={styles.textarea}
                placeholder="Describe your fish product..." 
                value={newProduct.description} 
                onChange={e => setNewProduct({...newProduct, description:e.target.value})} 
                rows="3"
                required 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Product Image</label>
              <div style={styles.imageUpload}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={styles.fileInput}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={styles.fileLabel}>
                  <FiImage size={24} />
                  <span>Choose Image</span>
                </label>
                {imagePreview && (
                  <div style={styles.imagePreviewContainer}>
                    <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              <FiPlus size={18} />
              <span>Add Product</span>
            </button>
          </form>
        )}

        {products.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🐟</span>
            <p style={styles.emptyText}>No products yet</p>
            <p style={styles.emptySubtext}>Start adding fish products to your inventory</p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map(p => (
              <div key={p.uid} style={styles.productCard}>
                <div style={styles.imageContainer}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={styles.productImage} />
                  ) : (
                    <div style={styles.placeholderImage}>
                      <span style={styles.placeholderIcon}>🐟</span>
                    </div>
                  )}
                </div>

                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{p.name}</h3>
                  <span style={styles.productType}>{p.type}</span>
                  <p style={styles.productDesc}>{p.description}</p>
                  
                  <div style={styles.productFooter}>
                    <div>
                      <div style={styles.price}>₱{p.price}</div>
                      <div style={styles.stock}>Stock: {p.quantity}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p.uid)}
                      style={styles.deleteBtn}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: colors.neutral.lightest,
    fontFamily: typography.fontFamily.primary,
  },
  container: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.dark,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
  },
  addForm: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
  },
  formTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '1.5rem',
    fontFamily: typography.fontFamily.heading,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
  },
  input: {
    padding: '0.75rem 1rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    color: colors.neutral.darkest,
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.neutral.medium,
  },
  textarea: {
    padding: '0.75rem 1rem',
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    color: colors.neutral.darkest,
    transition: 'all 0.2s ease',
    outline: 'none',
    resize: 'vertical',
    fontFamily: typography.fontFamily.primary,
  },
  imageUpload: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1rem',
    border: `2px dashed ${colors.neutral.light}`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: colors.neutral.dark,
    fontWeight: typography.fontWeight.medium,
  },
  imagePreviewContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: borderRadius.lg,
    border: `2px solid ${colors.neutral.light}`,
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    background: gradients.ocean,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.md,
    marginTop: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
  },
  emptyIcon: {
    fontSize: '5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.darkest,
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.medium,
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  productCard: {
    background: colors.neutral.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: shadows.card,
    border: `1px solid ${colors.neutral.light}`,
    transition: 'all 0.2s ease',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    background: gradients.oceanLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: '4rem',
  },
  productInfo: {
    padding: '1.25rem',
  },
  productName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.darkest,
    marginBottom: '0.25rem',
  },
  productType: {
    display: 'inline-block',
    fontSize: typography.fontSize.xs,
    color: colors.primary.main,
    background: `${colors.primary.main}15`,
    padding: '0.25rem 0.75rem',
    borderRadius: borderRadius.full,
    marginBottom: '0.75rem',
    fontWeight: typography.fontWeight.medium,
  },
  productDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.dark,
    lineHeight: '1.5',
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '1rem',
    borderTop: `1px solid ${colors.neutral.light}`,
  },
  price: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    fontFamily: typography.fontFamily.heading,
  },
  stock: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
    marginTop: '0.25rem',
  },
  deleteBtn: {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.full,
    border: 'none',
    background: `${colors.error}15`,
    color: colors.error,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
};

export default SellerProducts;
