import React from 'react';
import StarRating from './StarRating';
import { FiUser } from 'react-icons/fi';
import { colors, shadows, borderRadius, typography } from '../styles/theme';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const styles = {
    card: {
      background: colors.neutral.white,
      padding: '1.5rem',
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.neutral.light}`,
      boxShadow: shadows.sm,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: borderRadius.full,
      background: colors.primary.lighter,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.primary.dark,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.darkest,
      marginBottom: '0.25rem',
    },
    date: {
      fontSize: typography.fontSize.xs,
      color: colors.neutral.medium,
    },
    reviewText: {
      fontSize: typography.fontSize.sm,
      color: colors.neutral.dark,
      lineHeight: '1.6',
      marginTop: '0.75rem',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          <FiUser size={24} />
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{review.buyer_name || 'Anonymous'}</div>
          <div style={styles.date}>{formatDate(review.created_at || new Date())}</div>
        </div>
        <StarRating rating={review.rating} showNumber={false} size={16} />
      </div>
      {review.comment && (
        <p style={styles.reviewText}>{review.comment}</p>
      )}
    </div>
  );
};

export default ReviewCard;
