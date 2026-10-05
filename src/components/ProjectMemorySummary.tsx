'use client';

import React, { useState } from 'react';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Target,
  FileCheck,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ProjectMemory } from '@/types';

interface ProjectMemorySummaryProps {
  memory: ProjectMemory[];
  onRefresh?: () => void;
}

export const ProjectMemorySummary: React.FC<ProjectMemorySummaryProps> = ({
  memory,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Target className="w-3.5 h-3.5 text-blue-400" />;
      case 'decision':
        return <FileCheck className="w-3.5 h-3.5 text-violet-400" />;
      case 'issue':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'progress':
        return <Clock className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Critical</span>;
      case 'high':
        return <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">High</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              Shared Project Memory
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {memory.length} items
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Persistent bridge connecting Planner & Builder workflows
            </div>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 max-h-60 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pb-1">
            <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
              <Sparkles className="w-3 h-3" /> Project memory loaded
            </span>
            <span>Grounds all prompts & reviews</span>
          </div>

          {memory.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
              No project memory entries recorded yet. Chat with the Planner or import agent outputs to bridge context.
            </div>
          ) : (
            memory.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-slate-900/80 border border-slate-800/90 rounded-lg hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {getMemoryIcon(item.memory_type)}
                    <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getImportanceBadge(item.importance)}
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {item.memory_type}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {item.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
