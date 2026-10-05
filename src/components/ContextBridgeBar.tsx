'use client';

import React from 'react';
import {
  Brain,
  ArrowRightLeft,
  Columns,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { ProjectMemory } from '@/types';

interface ContextBridgeBarProps {
  memory: ProjectMemory[];
  activeLayout: 'split' | 'planner' | 'builder';
  onLayoutChange: (layout: 'split' | 'planner' | 'builder') => void;
  onReviewShortcut?: () => void;
}

export const ContextBridgeBar: React.FC<ContextBridgeBarProps> = ({
  memory,
  activeLayout,
  onLayoutChange,
  onReviewShortcut,
}) => {
  return (
    <div className="h-8 bg-[#1e1915] border-b border-[#2e2621] px-3 flex items-center justify-between text-[11px] select-none text-[#a89d8f]">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-[#d5ccba] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-serif tracking-wide text-xs">Shared Memory Bridge</span>
        </span>
        <span className="text-[#4e433a]">|</span>
        <span className="text-[#a89d8f] font-mono text-[10px]">
          {memory.length} context items synchronized
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onReviewShortcut && (
          <button
            onClick={onReviewShortcut}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7d4732]/20 hover:bg-[#7d4732]/35 text-[#e8e1d3] transition-colors border border-[#7d4732]/40 cursor-pointer"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#c29c87]" />
            <span className="hidden sm:inline text-[10px] font-medium">Bridge & Review Output</span>
          </button>
        )}

        {/* View mode buttons */}
        <div className="flex items-center bg-[#29221d] p-0.5 rounded-full border border-[#3e342c]">
          <button
            onClick={() => onLayoutChange('split')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              activeLayout === 'split'
                ? 'bg-[#7d4732] text-[#f5efe6] shadow-xs'
                : 'text-[#a89d8f] hover:text-[#f5efe6]'
            }`}
            title="Side-by-side Dual Split View (Planner + Builder)"
          >
            <Columns className="w-3 h-3" />
            <span className="hidden md:inline">Dual Split</span>
          </button>

          <button
            onClick={() => onLayoutChange('planner')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              activeLayout === 'planner'
                ? 'bg-[#7d4732] text-[#f5efe6] shadow-xs'
                : 'text-[#a89d8f] hover:text-[#f5efe6]'
            }`}
            title="Focus on Planner AI"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden md:inline">Planner Only</span>
          </button>

          <button
            onClick={() => onLayoutChange('builder')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              activeLayout === 'builder'
                ? 'bg-[#7d4732] text-[#f5efe6] shadow-xs'
                : 'text-[#a89d8f] hover:text-[#f5efe6]'
            }`}
            title="Focus on Builder Agent"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden md:inline">Builder Only</span>
          </button>
        </div>
      </div>
    </div>
  );
};
