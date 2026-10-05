'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Layers,
  Sparkles,
  Terminal,
  Upload,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import { ProjectMemory, AgentArtifact } from '@/types';

interface AntigravityInspectorProps {
  memory: ProjectMemory[];
  artifacts: AgentArtifact[];
  isOpen: boolean;
  onClose: () => void;
}

export const AntigravityInspector: React.FC<AntigravityInspectorProps> = ({
  memory,
  artifacts,
  isOpen,
  onClose,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('files');

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const CHANGED_FILES = [
    { name: 'schema.sql', path: 'supabase/schema.sql', ext: 'sql', color: 'text-rose-400' },
    { name: '.env.example', path: '.env.example', ext: 'env', color: 'text-amber-400' },
    { name: 'index.ts', path: 'src/lib/db/index.ts', ext: 'TS', color: 'text-blue-400' },
    { name: 'logger.ts', path: 'src/lib/logger.ts', ext: 'TS', color: 'text-blue-400' },
    { name: 'crypto.ts', path: 'src/lib/crypto.ts', ext: 'TS', color: 'text-blue-400' },
    { name: 'openrouter.ts', path: 'src/lib/ai/openrouter.ts', ext: 'TS', color: 'text-blue-400' },
    { name: 'storage.ts', path: 'src/lib/db/storage.ts', ext: 'TS', color: 'text-blue-400' },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-72 bg-[#121215] border-l border-[#242429] flex flex-col h-full select-none text-xs text-slate-300 shrink-0">
      {/* Top Header Icons */}
      <div className="h-11 px-3 border-b border-[#242429] flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 text-xs">Project Inspector</span>
        </div>
        <button onClick={onClose} className="p-1 hover:text-white rounded hover:bg-[#1f1f24]">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Section: Subagents */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button
            onClick={() => toggleSection('subagents')}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Subagents</span>
              <span className="text-[10px] text-slate-500 font-mono">0</span>
            </span>
            {openSection === 'subagents' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Section: Files Changed */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button
            onClick={() => toggleSection('files')}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Files Changed</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">53</span>
            </span>
            {openSection === 'files' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSection === 'files' && (
            <div className="p-2 space-y-1 border-t border-[#232328] bg-[#141417]">
              {CHANGED_FILES.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-[#1d1d22] group cursor-pointer">
                  <span className={`text-[10px] font-bold font-mono px-1 rounded bg-[#202026] ${file.color}`}>
                    {file.ext}
                  </span>
                  <div className="truncate flex-1">
                    <span className="text-slate-200 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{file.path}</span>
                  </div>
                </div>
              ))}
              <div className="text-[10px] text-blue-400 hover:underline pt-1 px-1.5 cursor-pointer">
                See all (53)
              </div>
            </div>
          )}
        </div>

        {/* Section: Shared Project Memory */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button
            onClick={() => toggleSection('memory')}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium text-slate-300">Project Memory</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                {memory.length}
              </span>
            </span>
            {openSection === 'memory' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSection === 'memory' && (
            <div className="p-2 space-y-1.5 border-t border-[#232328] bg-[#141417] max-h-48 overflow-y-auto">
              {memory.map((m) => (
                <div key={m.id} className="p-2 bg-[#1b1b20] border border-[#26262d] rounded-lg">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-[11px] text-slate-200 truncate">{m.title}</span>
                    <span className="text-[9px] uppercase font-mono text-slate-500">{m.memory_type}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Artifacts */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button
            onClick={() => toggleSection('artifacts')}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Artifacts</span>
              <span className="text-[10px] text-slate-500 font-mono">{artifacts.length}</span>
            </span>
            {openSection === 'artifacts' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSection === 'artifacts' && (
            <div className="p-2 space-y-1.5 border-t border-[#232328] bg-[#141417]">
              {artifacts.length === 0 ? (
                <div className="text-[11px] text-slate-500 p-2 text-center">No artifacts yet</div>
              ) : (
                artifacts.map((a) => (
                  <div key={a.id} className="p-1.5 bg-[#1b1b20] rounded border border-[#26262d] text-[11px]">
                    <span className="uppercase font-mono text-[9px] text-amber-400">{a.artifact_type}</span>
                    <div className="text-slate-300 truncate mt-0.5">{a.content?.slice(0, 50)}...</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Section: Uploads */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white">
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Uploads</span>
              <span className="text-[10px] text-slate-500 font-mono">0</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section: Background Tasks */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white">
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Background Tasks</span>
              <span className="text-[10px] text-slate-500 font-mono">0</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section: Skills Used */}
        <div className="border border-[#1f1f24] rounded-xl overflow-hidden bg-[#18181c]">
          <button
            onClick={() => toggleSection('skills')}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Skills Used</span>
              <span className="text-[10px] text-emerald-400 font-mono">1</span>
            </span>
            {openSection === 'skills' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSection === 'skills' && (
            <div className="p-2 border-t border-[#232328] bg-[#141417]">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>modern-web-guidance</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
