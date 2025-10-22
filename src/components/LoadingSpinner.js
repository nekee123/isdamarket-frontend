import React from 'react';
import { colors } from '../styles/theme';

const LoadingSpinner = ({ size = 'md', color = colors.primary.main, fullScreen = false }) => {
  const sizes = {
    sm: 20,
    md: 40,
    lg: 60,
  };

  const spinnerSize = sizes[size] || sizes.md;

  const spinnerStyle = {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: `3px solid ${colors.neutral.light}`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  };

  const textStyle = {
    marginTop: '1rem',
    color: colors.neutral.dark,
    fontSize: '14px',
    fontWeight: '500',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div>
          <div style={spinnerStyle}></div>
          {fullScreen && (
            <div style={{ ...textStyle, animation: 'pulse 1.5s ease-in-out infinite' }}>
              Loading...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
