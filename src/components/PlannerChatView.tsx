'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  X,
  Loader2,
  FileText,
  Wand2,
  CheckCircle,
  ArrowRight,
  Brain,
  Layers,
} from 'lucide-react';
import { Message, ProjectMemory, ReviewResult } from '@/types';
import { PLANNER_MODELS } from '@/lib/constants';

interface PlannerChatViewProps {
  projectId: string;
  chatId: string;
  chatTitle: string;
  currentModel: string;
  onModelChange: (model: string) => void;
  activeAgentSessionIndex?: number;
  memoryCount: number;
  onPromptGenerated?: () => void;
  onPlanCreated?: () => void;
  onReviewCompleted?: (review: ReviewResult) => void;
  agentOutputToReview?: string;
}

export const PlannerChatView: React.FC<PlannerChatViewProps> = ({
  projectId,
  chatId,
  chatTitle,
  currentModel,
  onModelChange,
  activeAgentSessionIndex = 1,
  memoryCount,
  onPromptGenerated,
  onPlanCreated,
  onReviewCompleted,
  agentOutputToReview,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when chatId changes
  useEffect(() => {
    let isCancelled = false;
    const fetchChatMessages = async () => {
      if (!chatId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/messages?chatId=${chatId}`);
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
  }, [chatId]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAction]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !screenshotData) return;
    if (loadingAction) return;

    const userText = input.trim();
    const currentScreenshot = screenshotData;
    setInput('');
    setScreenshotData(null);
    setError(null);
    setLoadingAction('Generating response...');

    // Optimistic user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      chat_type: 'planner',
      role: 'user',
      content: currentScreenshot
        ? `${userText || 'Analyze attached screenshot'}\n\n[Attached Screenshot]`
        : userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/planner/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chatId,
          message: userText || 'Analyze attached screenshot',
          model: currentModel,
          screenshotUrl: currentScreenshot || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

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
          chatId,
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
          chatId,
          agentChatId: chatId, // will be mapped by server
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
          chatId,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b101d] border-r border-slate-800">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800 bg-[#090d16]/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
            P
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{chatTitle || 'Planner Chat'}</span>
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                <Brain className="w-3 h-3" /> Project memory loaded ({memoryCount} items)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-300 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                <Layers className="w-3 h-3" /> Sharing: Agent Session #{activeAgentSessionIndex}
              </span>
            </div>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Model:</label>
          <select
            value={currentModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="px-2.5 py-1 text-xs bg-[#0f172a] border border-blue-500/40 text-blue-300 rounded-lg focus:outline-hidden focus:border-blue-400"
          >
            {PLANNER_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="px-3 py-2 bg-[#090d16]/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={handleCreatePlan}
          disabled={Boolean(loadingAction)}
          className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Create Project Plan</span>
        </button>

        <button
          onClick={handleGenerateNextPrompt}
          disabled={Boolean(loadingAction)}
          className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Generate Agent Prompt</span>
        </button>

        <button
          onClick={handleReviewOutput}
          disabled={Boolean(loadingAction)}
          className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Review Agent Output</span>
        </button>

        <button
          onClick={handleGenerateNextPrompt}
          disabled={Boolean(loadingAction)}
          className="px-2.5 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors disabled:opacity-50"
        >
          <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
          <span>Generate Next Prompt</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-500 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading planner chat...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 max-w-md mx-auto space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">Planner Research & Architecture Assistant</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Ask questions to explore ideas, research stacks, or click <strong className="text-blue-300">Create Project Plan</strong> to kickstart the external agent pipeline.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="text-[10px] text-slate-500 px-1 flex items-center gap-1.5">
                  <span>{isUser ? 'You' : 'Planner AI'}</span>
                  {m.model_used && (
                    <span className="font-mono text-blue-400/80 bg-blue-500/10 px-1 py-0.2 rounded border border-blue-500/20">
                      {m.model_used}
                    </span>
                  )}
                  {m.tokens_out ? (
                    <span>• {m.tokens_out} tokens</span>
                  ) : null}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/10'
                      : 'bg-[#0f172a] text-slate-200 border border-slate-800 rounded-bl-xs shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            );
          })
        )}

        {loadingAction && (
          <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>{loadingAction}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Screenshot Preview */}
      {screenshotData && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotData}
              alt="Screenshot preview"
              className="w-16 h-12 object-cover rounded-md border border-slate-700"
            />
            <button
              onClick={() => setScreenshotData(null)}
              className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-0.5 rounded-full hover:bg-rose-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-slate-400">Screenshot attached for Planner review</span>
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-[#090d16]">
        <div className="relative flex items-center bg-[#0f172a] border border-slate-700/80 rounded-xl focus-within:border-blue-500 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-blue-400 transition-colors"
            title="Attach screenshot for Planner analysis"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask questions, refine idea, or explore technical concepts..."
            className="flex-1 bg-transparent py-2.5 px-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden"
            disabled={Boolean(loadingAction)}
          />

          <button
            type="submit"
            disabled={Boolean(loadingAction) || (!input.trim() && !screenshotData)}
            className="p-2 mr-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
