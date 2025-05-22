import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button',
  size = 'medium',
  icon = null
}) => {

  const variants = {
    primary: 'bg-[#A0D995] hover:bg-opacity-80 text-gray-800',
    secondary: 'bg-[#2E7D32] hover:bg-opacity-80 text-white',
    neutral: 'bg-[#E0E0E0] hover:bg-opacity-80 text-gray-800',
    danger: 'bg-[#DC3545] hover:bg-opacity-80 text-white',
    success: 'bg-[#4CAF50] hover:bg-opacity-80 text-white',
    edit: 'bg-[#2D9CDB] hover:bg-opacity-80 text-white'
  };


  const sizes = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };

  const baseClasses = 'font-medium rounded-md shadow-md transition-all duration-300';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.medium;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={disabled ? null : onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className} flex items-center justify-center`}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;