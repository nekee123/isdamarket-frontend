import React, { useState } from 'react';
import StarRating from './StarRating';
import { FiX } from 'react-icons/fi';
import { colors, shadows, borderRadius, typography, gradients } from '../styles/theme';

const ReviewModal = ({ isOpen, onClose, onSubmit, sellerName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    await onSubmit({ rating, comment });
    setIsSubmitting(false);
    setRating(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem',
    },
    modal: {
      background: colors.neutral.white,
      borderRadius: borderRadius.xl,
      boxShadow: shadows['2xl'],
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    header: {
      padding: '1.5rem',
      borderBottom: `1px solid ${colors.neutral.light}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.darkest,
      fontFamily: typography.fontFamily.heading,
      margin: 0,
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      color: colors.neutral.medium,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      transition: 'all 0.2s ease',
    },
    body: {
      padding: '1.5rem',
    },
    section: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.darkest,
      marginBottom: '0.75rem',
    },
    sellerName: {
      fontSize: typography.fontSize.base,
      color: colors.neutral.dark,
      marginBottom: '1rem',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '0.75rem',
      border: `2px solid ${colors.neutral.light}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.primary,
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    footer: {
      padding: '1.5rem',
      borderTop: `1px solid ${colors.neutral.light}`,
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
    },
    cancelBtn: {
      padding: '0.75rem 1.5rem',
      background: 'transparent',
      color: colors.neutral.dark,
      border: `2px solid ${colors.neutral.light}`,
      borderRadius: borderRadius.full,
      fontWeight: typography.fontWeight.semibold,
      fontSize: typography.fontSize.sm,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submitBtn: {
      padding: '0.75rem 2rem',
      background: gradients.ocean,
      color: colors.neutral.white,
      border: 'none',
      borderRadius: borderRadius.full,
      fontWeight: typography.fontWeight.semibold,
      fontSize: typography.fontSize.sm,
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: shadows.sm,
      opacity: isSubmitting ? 0.6 : 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Rate & Review</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.body}>
            <p style={styles.sellerName}>
              How was your experience with <strong>{sellerName}</strong>?
            </p>
            
            <div style={styles.section}>
              <label style={styles.label}>Your Rating *</label>
              <StarRating
                rating={rating}
                interactive={true}
                onRate={setRating}
                size={32}
                showNumber={false}
              />
            </div>
            
            <div style={styles.section}>
              <label style={styles.label}>Your Review (Optional)</label>
              <textarea
                style={styles.textarea}
                placeholder="Share your experience with this seller..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral.medium, marginTop: '0.5rem' }}>
                {comment.length}/500 characters
              </div>
            </div>
          </div>
          
          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
