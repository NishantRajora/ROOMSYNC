import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  college?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  college = 'Verified Student',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium bg-[#fef9c3] text-[#854d0e] border border-[#fde047] rounded-full shadow-2xs ${sizeClasses}`}
      title={`Verified student at ${college}`}
    >
      <ShieldCheck size={iconSize} className="text-[#ca8a04] fill-[#fef08a]" />
      {showText && <span>{college}</span>}
    </span>
  );
};
