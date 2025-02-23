import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-purple-600 text-white hover:bg-purple-700',
          variant === 'outline' && 'border border-gray-200 bg-white hover:bg-gray-100',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'lg' && 'h-12 px-8',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button }; 