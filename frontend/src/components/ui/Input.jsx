import React, { forwardRef } from 'react';
import { cn } from './Button';

export const Input = forwardRef(({ className, label, error, icon, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={cn(
                        'input-field',
                        error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
                        icon && 'pr-10',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {icon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
