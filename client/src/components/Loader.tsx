import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white';
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
  };

  return (
    <div className="flex justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          border-2
          border-gray-200
          border-t-${colorClasses[color]}
          rounded-full
          animate-spin
        `}
      />
    </div>
  );
};

export default Loader;
