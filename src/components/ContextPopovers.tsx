'use client';

import React from 'react';
import {
  Image,
  AtSign,
  Play,
  Globe,
  Camera,
  FileCode,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
} from 'lucide-react';

interface AntigravityContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const AntigravityContextMenu: React.FC<AntigravityContextMenuProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-14 left-2 z-50 w-44 bg-[#1f1f23] border border-[#2e2e34] rounded-2xl shadow-2xl p-1.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100">
        <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Add Context
        </div>
        <button
          onClick={() => {
            onSelectAction('media');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#2a2a30] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Image className="w-3.5 h-3.5 text-blue-400" />
          <span>Media & Screenshot</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('mentions');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#2a2a30] text-slate-300 hover:text-white transition-colors text-left"
        >
          <AtSign className="w-3.5 h-3.5 text-violet-400" />
          <span>Mentions & Files</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('actions');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#2a2a30] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" />
          <span>Actions & Tasks</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('browser');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#2a2a30] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Browser Context</span>
        </button>
      </div>
    </>
  );
};

interface ChatGPTAttachMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const ChatGPTAttachMenu: React.FC<ChatGPTAttachMenuProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-14 left-2 z-50 w-52 bg-[#212121] border border-[#333333] rounded-2xl shadow-2xl p-1.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100">
        <button
          onClick={() => {
            onSelectAction('upload');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2f2f2f] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Image className="w-4 h-4 text-slate-400" />
          <span>Add photos & files</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('screenshot');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2f2f2f] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Camera className="w-4 h-4 text-slate-400" />
          <span>Take screenshot</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('code');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2f2f2f] text-slate-300 hover:text-white transition-colors text-left"
        >
          <FileCode className="w-4 h-4 text-slate-400" />
          <span>Paste code or logs</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('thinking');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2f2f2f] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Sparkles className="w-4 h-4 text-slate-400" />
          <span>Thinking mode</span>
        </button>

        <button
          onClick={() => {
            onSelectAction('web');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2f2f2f] text-slate-300 hover:text-white transition-colors text-left"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span>Web search</span>
        </button>
      </div>
    </>
  );
};
