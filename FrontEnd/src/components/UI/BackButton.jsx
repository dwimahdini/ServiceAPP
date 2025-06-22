import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ 
  to = null, 
  label = "Kembali", 
  className = "", 
  variant = "default",
  showIcon = true 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // Different button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md";
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700`;
      case 'secondary':
        return `${baseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200`;
      case 'outline':
        return `${baseStyles} border border-gray-300 text-gray-700 hover:bg-gray-50`;
      case 'minimal':
        return `${baseStyles} text-gray-600 hover:text-gray-800 hover:bg-gray-100`;
      case 'white':
        return `${baseStyles} bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200`;
      default:
        return `${baseStyles} bg-gray-600 text-white hover:bg-gray-700`;
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`${getButtonStyles()} ${className}`}
      type="button"
    >
      {showIcon && (
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      )}
      {label}
    </button>
  );
};

export default BackButton;
