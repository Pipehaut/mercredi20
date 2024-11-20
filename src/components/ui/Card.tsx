import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-lg shadow-md overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}