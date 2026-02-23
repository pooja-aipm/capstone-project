import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Button({
    children,
    variant = 'primary',
    className,
    ...props
}) {
    return (
        <button
            className={cn(
                variant === 'primary' && 'btn-primary',
                variant === 'secondary' && 'btn-secondary',
                variant === 'ghost' && 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-md font-medium transition-colors',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
