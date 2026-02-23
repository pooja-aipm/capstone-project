import React from 'react';
import { cn } from './Button';

export function Card({ className, children, ...props }) {
    return (
        <div className={cn('card', className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn('px-6 py-5 border-b border-slate-100', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={cn('text-lg font-semibold text-slate-900', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={cn('px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl', className)} {...props}>
            {children}
        </div>
    );
}
