'use client';

import React from 'react';
import {
  Plus,
  History,
  Calendar,
  FolderKanban,
  Settings,
  ChevronRight,
  MessageSquare,
  X,
} from 'lucide-react';
import { PlannerChat } from '@/types';

interface AntigravityHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chats: PlannerChat[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  onOpenSettings: () => void;
}

export const AntigravityHistoryDrawer: React.FC<AntigravityHistoryDrawerProps> = ({
  isOpen,
  onClose,
  chats,
  selectedChatId,
  onSelectChat,
  onCreateChat,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  const RELATIVE_TIMES = ['12h', '13h', '3d', '8d', '10d', '1mo'];

  return (
    <div className="w-64 bg-[#121215] border-r border-[#242429] flex flex-col h-full select-none text-xs text-slate-300 shrink-0">
      <div className="p-2 border-b border-[#242429] flex items-center justify-between">
        <button
          onClick={onCreateChat}
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#202026] hover:bg-[#282830] text-white font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          <span>New Conversation</span>
        </button>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white ml-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Quick Links */}
        <div className="space-y-0.5">
          <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b1b20] transition-colors text-left">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Conversation History</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b1b20] transition-colors text-left">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Scheduled Tasks</span>
          </button>
        </div>

        {/* Projects header */}
        <div className="pt-2 border-t border-[#242429]">
          <div className="flex items-center justify-between px-3 py-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
              <span>Projects</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Conversations</span>
            <button onClick={onCreateChat} className="p-0.5 hover:text-white">
              <Plus className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          <div className="space-y-0.5">
            {chats.map((chat, idx) => {
              const isSelected = chat.id === selectedChatId;
              const relTime = RELATIVE_TIMES[idx % RELATIVE_TIMES.length];
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left group ${
                    isSelected
                      ? 'bg-[#24242c] text-white font-medium'
                      : 'text-slate-300 hover:bg-[#1a1a20]'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{chat.title}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400 shrink-0 font-mono">
                    {relTime}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings at bottom */}
      <div className="p-2 border-t border-[#242429] bg-[#0f0f12]">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1b1b20] transition-colors text-left"
        >
          <Settings className="w-3.5 h-3.5 text-blue-400" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
