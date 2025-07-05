import type { ButtonHTMLAttributes } from 'react';
import type { Icon } from '@phosphor-icons/react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: Icon;
  variant?: 'default' | 'primary' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-stone-700 hover:bg-stone-600',
  primary: 'bg-stone-800 hover:bg-stone-700',
  success: 'bg-emerald-800 hover:bg-emerald-700',
} as const;

const sizeStyles = {
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-3',
} as const;

const iconSizes = {
  sm: 16,
  md: 18,
  lg: 24,
} as const;

export function IconButton({
  icon: Icon,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`border border-stone-400 text-white rounded-sm transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
}