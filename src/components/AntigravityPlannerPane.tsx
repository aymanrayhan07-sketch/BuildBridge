'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  Sparkles,
  Plus,
  Mic,
  ArrowUp,
  FileText,
  Wand2,
  CheckCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Sidebar as SidebarIcon,
  Brain,
  PanelRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { Message, ProjectMemory, ReviewResult, PlannerChat } from '@/types';
import { ModelSelectorModal, PLANNER_MODEL_OPTIONS } from './ModelSelectorModal';
import { AntigravityContextMenu } from './ContextPopovers';
import { AntigravityInspector } from './AntigravityInspector';
import { AntigravityHistoryDrawer } from './AntigravityHistoryDrawer';

interface AntigravityPlannerPaneProps {
  projectId: string;
  projectName: string;
  currentChatId: string;
  chats: PlannerChat[];
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  memory: ProjectMemory[];
  artifacts: any[];
  currentModel: string;
  onModelChange: (model: string) => void;
  onPromptGenerated?: () => void;
  onPlanCreated?: () => void;
  onReviewCompleted?: (review: ReviewResult) => void;
  agentOutputToReview?: string;
  onOpenSettings: () => void;
}

export const AntigravityPlannerPane: React.FC<AntigravityPlannerPaneProps> = ({
  projectId,
  projectName,
  currentChatId,
  chats,
  onSelectChat,
  onCreateChat,
  memory,
  artifacts,
  currentModel,
  onModelChange,
  onPromptGenerated,
  onPlanCreated,
  onReviewCompleted,
  agentOutputToReview,
  onOpenSettings,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    const fetchChatMessages = async () => {
      if (!currentChatId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/messages?chatId=${currentChatId}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setMessages(data.messages || []);
          }
        }
      } catch {
        if (!isCancelled) setError('Could not load messages');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchChatMessages();
    return () => {
      isCancelled = true;
    };
  }, [currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAction]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loadingAction) return;

    const userText = input.trim();
    setInput('');
    setError(null);
    setLoadingAction('Thinking...');

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      chat_id: currentChatId,
      chat_type: 'planner',
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/planner/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chatId: currentChatId,
          message: userText,
          model: currentModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        data.userMessage,
        data.assistantMessage,
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreatePlan = async () => {
    setError(null);
    setLoadingAction('Architecting Project Plan...');
    try {
      const res = await fetch('/api/planner/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chatId: currentChatId,
          model: currentModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create plan');

      setMessages((prev) => [...prev, data.message]);
      onPlanCreated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating plan');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateNextPrompt = async () => {
    setError(null);
    setLoadingAction('Architecting Builder Agent Prompt...');
    try {
      const res = await fetch('/api/planner/next-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chatId: currentChatId,
          agentChatId: currentChatId,
          model: currentModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate prompt');

      setMessages((prev) => [...prev, data.message]);
      onPromptGenerated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error generating prompt');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReviewOutput = async () => {
    setError(null);
    const content = agentOutputToReview || 'Review current project implementation state.';
    setLoadingAction('Reviewing Builder Agent Output...');
    try {
      const res = await fetch('/api/planner/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chatId: currentChatId,
          agentOutput: content,
          model: currentModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to review output');

      setMessages((prev) => [...prev, data.message]);
      onReviewCompleted?.(data.review);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error reviewing output');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentModelName =
    PLANNER_MODEL_OPTIONS.find((m) => m.id === currentModel)?.name || 'Gemini 3.8 Flash High';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#121215] border-r border-[#242429] relative overflow-hidden select-text">
      {/* Top Header */}
      <div className="h-11 px-3 border-b border-[#242429] bg-[#141418] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          {/* History drawer button */}
          <button
            onClick={() => setHistoryDrawerOpen(!historyDrawerOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#202026] transition-colors"
            title="Toggle Conversations History"
          >
            <SidebarIcon className="w-4 h-4" />
          </button>

          {/* Planner AI Badge (Moved from redundant top menu bar) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
            <span className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">
              P
            </span>
            <span className="text-xs font-semibold text-slate-100">Planner AI</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <ArrowLeft className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
            <ArrowRight className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          </div>

          <span className="text-xs font-medium text-slate-400 truncate ml-1 hidden sm:inline">
            {projectName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Inspector Drawer Toggle */}
          <button
            onClick={() => setInspectorOpen(!inspectorOpen)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              inspectorOpen ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-[#202026]'
            }`}
            title="Toggle Project Inspector (Files Changed, Memory, Artifacts)"
          >
            <PanelRight className="w-4 h-4" />
            <span className="hidden sm:inline">Inspector</span>
          </button>
        </div>
      </div>

      {/* Middle Layout: Drawers + Main Chat Feed */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left History Drawer */}
        <AntigravityHistoryDrawer
          isOpen={historyDrawerOpen}
          onClose={() => setHistoryDrawerOpen(false)}
          chats={chats}
          selectedChatId={currentChatId}
          onSelectChat={(id) => {
            onSelectChat(id);
            setHistoryDrawerOpen(false);
          }}
          onCreateChat={() => {
            onCreateChat();
            setHistoryDrawerOpen(false);
          }}
          onOpenSettings={onOpenSettings}
        />

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#121215]">

          {error && (
            <div className="mx-3 mt-2 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="max-w-md mx-auto py-12 text-center text-slate-500 space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#1d1d23] border border-[#2b2b34] flex items-center justify-center mx-auto text-blue-400">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">Planner Research & Architecture Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discuss project goals, explore API contracts, or click <strong>Create Project Plan</strong> above to formulate your build roadmap.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    {/* User speech bubble: rounded dark pill */}
                    {isUser ? (
                      <div className="max-w-[85%] bg-[#24242a] text-slate-100 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs shadow-md border border-[#2e2e36] whitespace-pre-wrap leading-relaxed">
                        {m.content}
                      </div>
                    ) : (
                      /* Assistant response: clean markdown */
                      <div className="max-w-full text-xs text-slate-200 space-y-2 group">
                        <div className="bg-[#18181d] border border-[#24242a] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap">
                          {m.content}
                        </div>

                        {/* Action buttons below assistant message */}
                        <div className="flex items-center gap-1 text-slate-500 pl-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(m.content, m.id)}
                            className="p-1 hover:text-slate-300 rounded hover:bg-[#202026]"
                            title="Copy message"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedId === m.id && (
                            <span className="text-[10px] text-emerald-400">Copied</span>
                          )}
                          <button className="p-1 hover:text-slate-300 rounded hover:bg-[#202026]" title="Good response">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-300 rounded hover:bg-[#202026]" title="Bad response">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          {m.model_used && (
                            <span className="text-[10px] text-slate-500 font-mono ml-2">
                              {m.model_used}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {loadingAction && (
              <div className="flex items-center gap-2 p-3 bg-[#18181d] border border-[#24242a] rounded-xl text-blue-300 text-xs w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>{loadingAction}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3. Floating Bottom Input Bar (matching Image 1 & 5) */}
          <div className="p-3 bg-[#121215] border-t border-[#1f1f24] relative">
            <AntigravityContextMenu
              isOpen={contextMenuOpen}
              onClose={() => setContextMenuOpen(false)}
              onSelectAction={(action) => {
                if (action === 'media') {
                  setInput((prev) => `${prev} [Attached screenshot analysis]`);
                }
              }}
            />

            <form
              onSubmit={handleSendMessage}
              className="bg-[#1c1c21] border border-[#2e2e36] rounded-2xl p-2.5 shadow-xl flex flex-col gap-2 focus-within:border-blue-500/80 transition-colors"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything, @ to mention, / for actions"
                rows={2}
                className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 resize-none focus:outline-hidden leading-relaxed px-1"
                disabled={Boolean(loadingAction)}
              />

              <div className="flex items-center justify-between pt-1 border-t border-[#26262d]">
                <div className="flex items-center gap-1.5">
                  {/* Plus context button */}
                  <button
                    type="button"
                    onClick={() => setContextMenuOpen(!contextMenuOpen)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#282830] transition-colors"
                    title="Add context"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Model Selector Pill */}
                  <button
                    type="button"
                    onClick={() => setModelModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#24242c] hover:bg-[#2c2c36] text-[11px] text-slate-300 font-medium border border-[#30303a] transition-colors"
                  >
                    <span>{currentModelName}</span>
                    <span className="text-slate-500 text-[10px]">^</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#282830]"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={!input.trim() || Boolean(loadingAction)}
                    className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Inspector Drawer (Files Changed, Artifacts, Project Memory) */}
        <AntigravityInspector
          memory={memory}
          artifacts={artifacts}
          isOpen={inspectorOpen}
          onClose={() => setInspectorOpen(false)}
        />
      </div>

      {/* Model Selector Modal */}
      <ModelSelectorModal
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        selectedModel={currentModel}
        onSelectModel={onModelChange}
        options={PLANNER_MODEL_OPTIONS}
        title="Planner Model"
      />
    </div>
  );
};
