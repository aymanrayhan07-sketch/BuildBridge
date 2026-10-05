'use client';

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Project,
  PlannerChat,
  AgentChat,
  ProjectMemory,
  AgentPrompt,
  AgentArtifact,
  ReviewResult,
} from '@/types';
import { Navbar } from '@/components/Navbar';
import { AntigravityPlannerPane } from '@/components/AntigravityPlannerPane';
import { ChatGPTBuilderPane } from '@/components/ChatGPTBuilderPane';
import { SettingsModal } from '@/components/SettingsModal';

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [plannerChats, setPlannerChats] = useState<PlannerChat[]>([]);
  const [agentChats, setAgentChats] = useState<AgentChat[]>([]);
  const [selectedPlannerChatId, setSelectedPlannerChatId] = useState<string>('');
  const [selectedAgentChatId, setSelectedAgentChatId] = useState<string>('');
  const [memory, setMemory] = useState<ProjectMemory[]>([]);
  const [prompts, setPrompts] = useState<AgentPrompt[]>([]);
  const [artifacts, setArtifacts] = useState<AgentArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout view: 'split' | 'planner' | 'builder'
  const [activeLayout, setActiveLayout] = useState<'split' | 'planner' | 'builder'>('split');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Model selections
  const [plannerModel, setPlannerModel] = useState<string>('google/gemini-2.5-flash');
  const [builderModel, setBuilderModel] = useState<string>('deepseek/deepseek-chat');

  // Adjustable / Resizable Split Divider state
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newPercent = (offsetX / rect.width) * 100;
      // Allow flexible adjustment clamped between 20% and 80%
      const clamped = Math.max(20, Math.min(80, newPercent));
      setSplitPercent(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Load project details
  const fetchProjectData = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push('/projects');
          return;
        }
        throw new Error('Failed to load project');
      }

      const data = await res.json();
      setProject(data.project);
      setPlannerChats(data.plannerChats || []);
      setAgentChats(data.agentChats || []);
      setMemory(data.memory || []);
      setPrompts(data.prompts || []);
      setArtifacts(data.artifacts || []);

      if (data.project.planner_model) {
        setPlannerModel(data.project.planner_model);
      }
      if (data.project.builder_model) {
        setBuilderModel(data.project.builder_model);
      }

      if (data.plannerChats?.length > 0 && !selectedPlannerChatId) {
        setSelectedPlannerChatId(data.plannerChats[0].id);
      }
      if (data.agentChats?.length > 0 && !selectedAgentChatId) {
        setSelectedAgentChatId(data.agentChats[0].id);
      }
    } catch {
      setError('Could not load workspace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  // Create new Planner Chat
  const handleCreatePlannerChat = async () => {
    const title = prompt('New Planner Session Name:', `Planner Session #${plannerChats.length + 1}`);
    if (!title || !title.trim()) return;

    try {
      const res = await fetch('/api/planner/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, title: title.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlannerChats((prev) => [...prev, data.chat]);
        setSelectedPlannerChatId(data.chat.id);
        const memRes = await fetch(`/api/projects/${projectId}/memory`);
        if (memRes.ok) {
          const memData = await memRes.json();
          setMemory(memData.memory || []);
        }
      }
    } catch {
      alert('Failed to create planner chat');
    }
  };

  // Create new Agent Chat
  const handleCreateAgentChat = async () => {
    const title = prompt('New Agent Session Name:', `Build Run #${agentChats.length + 1}`);
    if (!title || !title.trim()) return;

    try {
      const res = await fetch('/api/agent/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, title: title.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setAgentChats((prev) => [...prev, data.chat]);
        setSelectedAgentChatId(data.chat.id);
        const memRes = await fetch(`/api/projects/${projectId}/memory`);
        if (memRes.ok) {
          const memData = await memRes.json();
          setMemory(memData.memory || []);
        }
      }
    } catch {
      alert('Failed to create agent chat');
    }
  };

  const handlePlannerModelChange = async (model: string) => {
    setPlannerModel(model);
    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planner_model: model }),
    });
  };

  const handleBuilderModelChange = async (model: string) => {
    setBuilderModel(model);
    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ builder_model: model }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
        <span className="text-sm">Loading BuildBridge Dual Workspace...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
        Project not found.
      </div>
    );
  }

  const latestArtifactOutput = artifacts.find((a) => a.artifact_type === 'output')?.content || '';

  return (
    <div className="h-screen flex flex-col bg-[#14110f] text-[#f5efe6] overflow-hidden font-sans">
      {/* Top Navbar with Central Layout Controls & Memory Badge */}
      <Navbar
        projectName={project.name}
        projectStatus={project.status}
        memoryCount={memory.length}
        activeLayout={activeLayout}
        onLayoutChange={setActiveLayout}
      />

      {error && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 text-rose-400 px-4 py-1.5 text-xs">
          {error}
        </div>
      )}

      {/* Main Dual-Screen Side-by-Side Workspace */}
      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden relative ${
          isDragging ? 'select-none cursor-col-resize' : ''
        }`}
      >
        {/* Left Half: Planner AI Pane */}
        {(activeLayout === 'split' || activeLayout === 'planner') && (
          <div
            style={{
              width: activeLayout === 'split' ? `${splitPercent}%` : '100%',
            }}
            className={`h-full flex flex-col shrink-0 min-w-0 ${
              isDragging ? 'pointer-events-none' : ''
            }`}
          >
            {selectedPlannerChatId ? (
              <AntigravityPlannerPane
                projectId={project.id}
                projectName={project.name}
                currentChatId={selectedPlannerChatId}
                chats={plannerChats}
                onSelectChat={setSelectedPlannerChatId}
                onCreateChat={handleCreatePlannerChat}
                memory={memory}
                artifacts={artifacts}
                currentModel={plannerModel}
                onModelChange={handlePlannerModelChange}
                onPromptGenerated={fetchProjectData}
                onPlanCreated={fetchProjectData}
                onReviewCompleted={fetchProjectData}
                agentOutputToReview={latestArtifactOutput}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-[#a89d8f] bg-[#1a1614]">
                No Planner Session Selected
              </div>
            )}
          </div>
        )}

        {/* Resizable / Adjustable Split Divider (shown in split view) */}
        {activeLayout === 'split' && (
          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={() => setSplitPercent(50)}
            className={`relative w-2 group cursor-col-resize select-none flex items-center justify-center z-30 transition-colors shrink-0 ${
              isDragging
                ? 'bg-[#7d4732] shadow-lg shadow-[#7d4732]/50'
                : 'bg-[#241d18] hover:bg-[#7d4732] border-x border-[#382d24]'
            }`}
            title="Drag to adjust tab sizes • Double click to center (50/50)"
          >
            {/* Visual drag handle grip indicator */}
            <div
              className={`w-0.5 h-7 rounded-full transition-colors ${
                isDragging ? 'bg-[#f5efe6]' : 'bg-[#6b5b4f] group-hover:bg-[#f5efe6]'
              }`}
            />
            {/* Extended click/drag hot-zone for easy grabbing */}
            <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
          </div>
        )}

        {/* Right Half: Builder Agent Pane */}
        {(activeLayout === 'split' || activeLayout === 'builder') && (
          <div
            style={{
              width: activeLayout === 'split' ? `${100 - splitPercent}%` : '100%',
            }}
            className={`h-full flex flex-col shrink-0 min-w-0 ${
              isDragging ? 'pointer-events-none' : ''
            }`}
          >
            {selectedAgentChatId ? (
              <ChatGPTBuilderPane
                projectId={project.id}
                currentChatId={selectedAgentChatId}
                chats={agentChats}
                onSelectChat={setSelectedAgentChatId}
                onCreateChat={handleCreateAgentChat}
                prompts={prompts}
                artifacts={artifacts}
                memory={memory}
                currentModel={builderModel}
                onModelChange={handleBuilderModelChange}
                onOutputImported={fetchProjectData}
                onScreenshotUploaded={fetchProjectData}
                onReviewRequested={fetchProjectData}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500 bg-[#181818]">
                No Agent Session Selected
              </div>
            )}
          </div>
        )}
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
