import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', style }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100 ${className}`} style={style}>
      {title && <h2 className="text-2xl font-bold mb-6 gradient-text">{title}</h2>}
      {children}
    </div>
  );
};
