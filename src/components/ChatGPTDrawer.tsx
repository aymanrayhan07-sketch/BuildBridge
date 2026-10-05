'use client';

import React from 'react';
import {
  PenSquare,
  Search,
  Image,
  BookOpen,
  Calendar,
  AtSign,
  FolderKanban,
  Code2,
  MoreHorizontal,
  Pin,
  Sparkles,
  X,
  Plus,
} from 'lucide-react';
import { AgentChat } from '@/types';

interface ChatGPTDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chats: AgentChat[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
}

export const ChatGPTDrawer: React.FC<ChatGPTDrawerProps> = ({
  isOpen,
  onClose,
  chats,
  selectedChatId,
  onSelectChat,
  onCreateChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-64 bg-[#171717] border-r border-[#2c2c2c] flex flex-col h-full select-none text-xs text-slate-300 shrink-0">
      {/* Top search & close */}
      <div className="p-2 border-b border-[#2c2c2c] flex items-center justify-between gap-1">
        <button
          onClick={onCreateChat}
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#242424] hover:bg-[#2d2d2d] text-white font-medium transition-colors text-left"
        >
          <PenSquare className="w-3.5 h-3.5 text-slate-300" />
          <span>New chat</span>
        </button>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#212121] border border-[#2f2f2f] rounded-xl text-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {/* Navigation shortcuts */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] cursor-pointer">
            <Image className="w-3.5 h-3.5" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Library</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] cursor-pointer">
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] cursor-pointer">
            <AtSign className="w-3.5 h-3.5" />
            <span>@ Plugins</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] cursor-pointer">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projects</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] cursor-pointer">
            <Code2 className="w-3.5 h-3.5" />
            <span>Codex</span>
          </div>
        </div>

        {/* Pinned agent chats */}
        <div className="pt-2 border-t border-[#262626]">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Pinned</span>
            <button onClick={onCreateChat} className="p-0.5 hover:text-white">
              <Plus className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            {chats.map((chat) => {
              const isSelected = chat.id === selectedChatId;
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors truncate ${
                    isSelected ? 'bg-[#282828] text-white font-medium' : 'text-slate-300 hover:bg-[#212121]'
                  }`}
                >
                  <Pin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate flex-1">{chat.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User profile at bottom */}
      <div className="p-2 border-t border-[#2c2c2c] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white">
            AM
          </div>
          <div className="truncate">
            <div className="text-xs font-medium text-slate-200 truncate">Ayman Rayhan</div>
            <div className="text-[10px] text-slate-500">Free Tier</div>
          </div>
        </div>
        <button className="px-2.5 py-1 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] text-[11px] font-semibold text-white">
          Upgrade
        </button>
      </div>
    </div>
  );
};
