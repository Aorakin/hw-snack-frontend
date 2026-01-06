import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full px-4 py-3
          border-2 border-gray-200 rounded-xl
          bg-gray-50 hover:bg-white
          transition-all

          focus:outline-none
          focus:border-slate-0
          focus:ring-0

          ${error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
