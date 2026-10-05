'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bot,
  Plus,
  ArrowLeft,
  Settings,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PlannerChat, AgentChat, ProjectStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { SettingsModal } from './SettingsModal';

interface SidebarProps {
  projectId: string;
  projectName: string;
  projectStatus: ProjectStatus | string;
  plannerChats: PlannerChat[];
  agentChats: AgentChat[];
  selectedPlannerChatId: string;
  selectedAgentChatId: string;
  onSelectPlannerChat: (id: string) => void;
  onSelectAgentChat: (id: string) => void;
  onCreatePlannerChat: () => void;
  onCreateAgentChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projectName,
  projectStatus,
  plannerChats,
  agentChats,
  selectedPlannerChatId,
  selectedAgentChatId,
  onSelectPlannerChat,
  onSelectAgentChat,
  onCreatePlannerChat,
  onCreateAgentChat,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <aside className="w-full md:w-64 bg-[#090d16] border-r border-slate-800 flex flex-col h-full select-none">
        {/* Project Header */}
        <div className="p-3.5 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] text-slate-400">Synced</span>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-sm text-slate-100 truncate flex items-center gap-1.5" title={projectName}>
              <Layers className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{projectName}</span>
            </h1>
            <div className="mt-1.5 flex items-center gap-2">
              <StatusBadge status={projectStatus} size="sm" />
            </div>
          </div>
        </div>

        {/* Chats Sections Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Planner Chats Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Planner Chats</span>
              </div>
              <button
                onClick={onCreatePlannerChat}
                className="p-1 rounded-md text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                title="New Planner Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {plannerChats.map((chat) => {
                const isSelected = chat.id === selectedPlannerChatId;
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectPlannerChat(chat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    <span className="truncate">{chat.title}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={onCreatePlannerChat}
                className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-blue-400 hover:bg-blue-500/5 border border-dashed border-slate-800/80 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                <span>+ New Planner Chat</span>
              </button>
            </div>
          </div>

          {/* Builder Agent Chats Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400 uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" />
                <span>Agent Chats</span>
              </div>
              <button
                onClick={onCreateAgentChat}
                className="p-1 rounded-md text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                title="New Agent Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {agentChats.map((chat) => {
                const isSelected = chat.id === selectedAgentChatId;
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectAgentChat(chat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-violet-600/20 text-violet-300 font-medium border border-violet-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    <span className="truncate">{chat.title}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={onCreateAgentChat}
                className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-violet-400 hover:bg-violet-500/5 border border-dashed border-slate-800/80 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                <span>+ New Agent Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer & Settings Link */}
        <div className="p-3 border-t border-slate-800 bg-[#070a12] space-y-1.5">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span>Settings & API Keys</span>
          </button>
          <div className="px-2.5 py-1 text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Project Memory Active</span>
          </div>
        </div>
      </aside>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
