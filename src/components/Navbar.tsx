'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  FolderGit2,
  Columns,
  Maximize2,
} from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { StatusBadge } from './StatusBadge';
import { ProjectStatus } from '@/types';

interface NavbarProps {
  projectName?: string;
  projectStatus?: ProjectStatus | string;
  userEmail?: string;
  memoryCount?: number;
  activeLayout?: 'split' | 'planner' | 'builder';
  onLayoutChange?: (layout: 'split' | 'planner' | 'builder') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  projectStatus,
  userEmail,
  memoryCount,
  activeLayout,
  onLayoutChange,
}) => {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="h-14 border-b border-[#2e2722] bg-[#1a1613]/95 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between select-none">
        {/* Left: Branding & Current Project */}
        <div className="flex items-center gap-3">
          <Link href="/projects" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#7d4732] text-[#f5efe6] flex items-center justify-center font-serif text-lg font-bold shadow-md shadow-[#7d4732]/30 group-hover:scale-105 transition-transform">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base tracking-tight font-semibold text-[#f5efe6]">
                BuildBridge
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#c29c87] font-semibold -mt-1 hidden sm:inline">
                Studio
              </span>
            </div>
          </Link>

          {projectName && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#a89d8f]">
              <ChevronRight className="w-3.5 h-3.5 text-[#5e5348]" />
              <span className="font-serif text-sm font-medium text-[#f5efe6]">{projectName}</span>
              {projectStatus && <StatusBadge status={projectStatus} size="sm" />}
            </div>
          )}
        </div>

        {/* Center: Layout Controls (Moved from redundant row as requested) */}
        {activeLayout && onLayoutChange && (
          <div className="flex items-center gap-2">
            {typeof memoryCount === 'number' && (
              <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-[#29221d] text-[#c29c87] border border-[#3e342c]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{memoryCount} Memory Synced</span>
              </span>
            )}

            <div className="flex items-center bg-[#241d18] p-0.5 rounded-full border border-[#3e342c] shadow-xs">
              <button
                type="button"
                onClick={() => onLayoutChange('split')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayout === 'split'
                    ? 'bg-[#7d4732] text-[#f5efe6] shadow-sm font-semibold'
                    : 'text-[#a89d8f] hover:text-[#f5efe6]'
                }`}
                title="Side-by-side Dual Split View"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Dual Split</span>
              </button>

              <button
                type="button"
                onClick={() => onLayoutChange('planner')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayout === 'planner'
                    ? 'bg-[#7d4732] text-[#f5efe6] shadow-sm font-semibold'
                    : 'text-[#a89d8f] hover:text-[#f5efe6]'
                }`}
                title="Focus on Planner AI"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Planner Only</span>
              </button>

              <button
                type="button"
                onClick={() => onLayoutChange('builder')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayout === 'builder'
                    ? 'bg-[#7d4732] text-[#f5efe6] shadow-sm font-semibold'
                    : 'text-[#a89d8f] hover:text-[#f5efe6]'
                }`}
                title="Focus on Builder Agent"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Builder Only</span>
              </button>
            </div>
          </div>
        )}

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-2">
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs text-[#d5ccba] hover:text-[#f5efe6] bg-[#29221d] hover:bg-[#342c26] rounded-full border border-[#3e342c] transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-[#c29c87]" />
            <span>Projects</span>
          </Link>

          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-[#d5ccba] hover:text-[#f5efe6] bg-[#29221d] hover:bg-[#342c26] rounded-full border border-[#3e342c] transition-colors cursor-pointer"
            title="Configure API Keys"
          >
            <Settings className="w-3.5 h-3.5 text-[#c29c87]" />
            <span className="hidden md:inline">API Keys</span>
          </button>

          {userEmail && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-xs text-[#a89d8f] bg-[#221c18] border border-[#332a23] rounded-full">
              <Sparkles className="w-3 h-3 text-[#c29c87]" />
              <span>{userEmail}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-1.5 text-[#a89d8f] hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
