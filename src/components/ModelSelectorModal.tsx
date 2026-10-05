'use client';

import React from 'react';
import { Check, ChevronRight, Sparkles, X } from 'lucide-react';

export interface ModelOption {
  id: string;
  name: string;
  tier: string;
  isNotice?: boolean;
}

export const PLANNER_MODEL_OPTIONS: ModelOption[] = [
  { id: 'google/gemini-2.5-flash', name: 'Gemini 3.8 Flash', tier: 'High' },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 3.7 Flash', tier: 'Medium' },
  { id: 'google/gemini-flash-lite', name: 'Gemini 3.6 Flash', tier: 'Medium' },
  { id: 'google/gemini-pro', name: 'Gemini 3.1 Pro', tier: 'Low' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude Sonnet 4.6 (Thinking)', tier: 'Notice', isNotice: true },
  { id: 'anthropic/claude-3-opus', name: 'Claude Opus 4.6 (Thinking)', tier: 'Notice', isNotice: true },
  { id: 'openai/gpt-4o', name: 'GPT-4o (Reasoning)', tier: 'High' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (Chat)', tier: 'Medium' },
];

export const BUILDER_MODEL_OPTIONS: ModelOption[] = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Coder V3', tier: 'Recommended' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet (Coding)', tier: 'Top Coding' },
  { id: 'openai/gpt-4o', name: 'GPT-4o (Agent Engine)', tier: 'High' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', tier: 'Specialized' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', tier: 'High Speed' },
];

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  options?: ModelOption[];
  title?: string;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  options = PLANNER_MODEL_OPTIONS,
  title = 'Model',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-0">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs" onClick={onClose} />
      <div className="relative w-full max-w-xs bg-[#1f1f23] text-slate-100 border border-[#2e2e34] rounded-2xl shadow-2xl p-2 z-10 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d33] mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-0.5 max-h-80 overflow-y-auto pr-1">
          {options.map((m) => {
            const isSelected = m.id === selectedModel;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectModel(m.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                  isSelected ? 'bg-[#2b2b31] text-white font-medium' : 'text-slate-300 hover:bg-[#28282e]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{m.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded ${
                      m.isNotice
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : isSelected
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {m.tier}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-[#2d2d33] mt-1 pt-1">
          <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer rounded-xl hover:bg-[#28282e]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Token Usage & Context</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
