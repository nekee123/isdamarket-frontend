import React from 'react';
import { FiStar } from 'react-icons/fi';
import { colors, typography } from '../styles/theme';

const StarRating = ({ rating = 0, maxStars = 5, size = 20, showNumber = true, interactive = false, onRate = null }) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const [selectedRating, setSelectedRating] = React.useState(rating);

  const handleClick = (value) => {
    if (interactive && onRate) {
      setSelectedRating(value);
      onRate(value);
    }
  };

  const displayRating = interactive ? (hoverRating || selectedRating) : rating;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    starsContainer: {
      display: 'flex',
      gap: '0.25rem',
    },
    star: {
      cursor: interactive ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
    },
    ratingText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      color: colors.neutral.dark,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.starsContainer}>
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          
          return (
            <div
              key={index}
              style={styles.star}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
            >
              <FiStar
                size={size}
                fill={isFilled ? colors.warning : 'none'}
                color={isFilled ? colors.warning : colors.neutral.medium}
                style={{ transition: 'all 0.2s ease' }}
              />
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span style={styles.ratingText}>
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
