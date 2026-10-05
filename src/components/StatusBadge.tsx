import React from 'react';
import { ProjectStatus } from '@/types';
import { STATUS_COLORS } from '@/lib/constants';

interface StatusBadgeProps {
  status: ProjectStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || 'idea').toLowerCase();
  const theme = STATUS_COLORS[normalized] || STATUS_COLORS.idea;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${
        theme.bg
      } ${theme.text} ${theme.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span className="capitalize">{status}</span>
    </span>
  );
};
