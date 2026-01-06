import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium ' +
    'transition-transform transition-colors duration-200 ' +
    'hover:scale-[1.02] active:scale-[0.98] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ' +
    'disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default:
      'bg-slate-900 text-white hover:bg-slate-800',

    outline:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',

    destructive:
      'bg-rose-600 text-white hover:bg-rose-700',

    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100',

    link:
      'bg-transparent text-slate-700 underline-offset-4 hover:underline hover:scale-100',

    gradient:
      'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
