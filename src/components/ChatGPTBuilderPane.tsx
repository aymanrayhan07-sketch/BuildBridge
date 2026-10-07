'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Sparkles,
  PenSquare,
  MoreHorizontal,
  Plus,
  Mic,
  Volume2,
  Copy,
  Check,
  Share2,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Image as ImageIcon,
  FileCode,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { AgentChat, AgentPrompt, AgentArtifact, ProjectMemory } from '@/types';
import { ModelSelectorModal, BUILDER_MODEL_OPTIONS } from './ModelSelectorModal';
import { ChatGPTAttachMenu } from './ContextPopovers';
import { ChatGPTDrawer } from './ChatGPTDrawer';
import { ApprovalBanner } from './ApprovalBanner';

interface ChatGPTBuilderPaneProps {
  projectId: string;
  currentChatId: string;
  chats: AgentChat[];
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  prompts: AgentPrompt[];
  artifacts: AgentArtifact[];
  memory: ProjectMemory[];
  currentModel: string;
  onModelChange: (model: string) => void;
  onOutputImported?: (content: string) => void;
  onScreenshotUploaded?: () => void;
  onReviewRequested?: () => void;
}

export const ChatGPTBuilderPane: React.FC<ChatGPTBuilderPaneProps> = ({
  projectId,
  currentChatId,
  chats,
  onSelectChat,
  onCreateChat,
  prompts,
  artifacts,
  memory,
  currentModel,
  onModelChange,
  onOutputImported,
  onScreenshotUploaded,
  onReviewRequested,
}) => {
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Agent output import
  const [outputInput, setOutputInput] = useState('');
  const [importingOutput, setImportingOutput] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Screenshot upload
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat messages
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Fetch agent messages
  useEffect(() => {
    let isCancelled = false;
    const fetchChatMessages = async () => {
      if (!currentChatId) return;
      try {
        const res = await fetch(`/api/messages?chatId=${currentChatId}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setMessages(data.messages || []);
          }
        }
      } catch {
        // ignore
      }
    };
    fetchChatMessages();
    return () => {
      isCancelled = true;
    };
  }, [currentChatId]);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;

    const userText = chatInput.trim();
    setChatInput('');
    setSendingChat(true);

    const tempUserMsg = {
      id: `agent-user-${Date.now()}`,
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chatId: currentChatId,
          message: userText,
          model: currentModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.assistantMessage) {
          setMessages((prev) => [...prev, data.assistantMessage]);
        }
      } else {
        // Fallback: save to messages directly
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: currentChatId,
            chat_type: 'agent',
            role: 'user',
            content: userText,
          }),
        });
      }
    } catch {
      // ignore
    } finally {
      setSendingChat(false);
    }
  };

  const handleImportOutput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outputInput.trim() || importingOutput) return;

    try {
      setImportingOutput(true);
      setImportSuccess(null);
      const res = await fetch('/api/agent/output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          agentChatId: currentChatId,
          content: outputInput.trim(),
          artifactType: 'output',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import output');

      onOutputImported?.(outputInput.trim());
      setOutputInput('');
      setImportSuccess('Output saved to artifacts and bridged to Project Memory!');
      setTimeout(() => setImportSuccess(null), 4000);

      // refresh local messages
      setMessages((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          role: 'user',
          content: `[Imported Agent Output]:\n\n${outputInput.trim()}`,
        },
      ]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error importing output');
    } finally {
      setImportingOutput(false);
    }
  };

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadScreenshot = async () => {
    if (!screenshotPreview || uploadingScreenshot) return;
    try {
      setUploadingScreenshot(true);
      const res = await fetch('/api/agent/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          agentChatId: currentChatId,
          fileUrl: screenshotPreview,
          caption: 'Visual proof from Builder Agent session',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed uploading screenshot');

      setScreenshotPreview(null);
      onScreenshotUploaded?.();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error uploading screenshot');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const currentModelName =
    BUILDER_MODEL_OPTIONS.find((m) => m.id === currentModel)?.name || 'DeepSeek Coder V3';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] relative overflow-hidden select-text">
      {/* Top Header */}
      <div className="h-11 px-3 border-b border-[#282828] bg-[#1a1a1a] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#252525] transition-colors"
            title="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Builder Agent Badge (Moved from redundant top menu bar) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <span className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
              B
            </span>
            <span className="text-xs font-semibold text-slate-100">Builder Agent</span>
          </div>

          {/* Model Selector pill */}
          <button
            onClick={() => setModelModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#242424] hover:bg-[#2c2c2c] text-xs font-semibold text-slate-200 transition-colors"
          >
            <span>{currentModelName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">

          <button
            onClick={onCreateChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#252525]"
            title="New Chat"
          >
            <PenSquare className="w-4 h-4" />
          </button>

          <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#252525]">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout: Drawer + Feed */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left ChatGPT Drawer */}
        <ChatGPTDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          chats={chats}
          selectedChatId={currentChatId}
          onSelectChat={(id) => {
            onSelectChat(id);
            setDrawerOpen(false);
          }}
          onCreateChat={() => {
            onCreateChat();
            setDrawerOpen(false);
          }}
        />

        {/* Feed Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#181818]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Permission banner */}
            <ApprovalBanner />

            {/* Agent Output Importer Area */}
            <div className="bg-[#212121] border border-[#2d2d2d] rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>Import External Agent Output</span>
              </div>

              {importSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              <form onSubmit={handleImportOutput} className="space-y-2">
                <textarea
                  value={outputInput}
                  onChange={(e) => setOutputInput(e.target.value)}
                  placeholder="Paste terminal logs, completed file diffs, or agent response here..."
                  rows={3}
                  className="w-full bg-[#181818] border border-[#333333] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 font-mono focus:outline-hidden focus:border-blue-500 resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleScreenshotSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#282828] hover:bg-[#323232] text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                    <span>Upload Screenshot</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!outputInput.trim() || importingOutput}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    {importingOutput ? 'Importing...' : 'Save Output & Sync Memory'}
                  </button>
                </div>
              </form>

              {/* Screenshot preview if uploaded */}
              {screenshotPreview && (
                <div className="p-2 bg-[#181818] border border-[#333] rounded-xl space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={screenshotPreview} alt="Screenshot" className="w-full max-h-40 object-contain rounded-lg" />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setScreenshotPreview(null)}
                      className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUploadScreenshot}
                      disabled={uploadingScreenshot}
                      className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium"
                    >
                      {uploadingScreenshot ? 'Saving...' : 'Confirm Upload'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Messages (Classic ChatGPT bubbles from Image 1) */}
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
                  {/* User Bubble: Blue rounded pill container (matching Image 1 right window!) */}
                  {isUser ? (
                    <div className="max-w-[85%] bg-[#1a3860] text-white rounded-2xl rounded-tr-xs px-4 py-3 text-xs leading-relaxed shadow-md whitespace-pre-wrap">
                      {m.content}
                    </div>
                  ) : (
                    /* Assistant text: clean left-aligned text */
                    <div className="max-w-full text-xs text-slate-200 space-y-2 group">
                      <div className="bg-[#212121] border border-[#2d2d2d] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </div>

                      {/* Action buttons below assistant message (Image 1) */}
                      <div className="flex items-center gap-1.5 text-slate-500 pl-1">
                        <button className="p-1 hover:text-slate-300 rounded hover:bg-[#252525]">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-300 rounded hover:bg-[#252525]">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-300 rounded hover:bg-[#252525]">
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-300 rounded hover:bg-[#252525]">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-300 rounded hover:bg-[#252525]">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3. Floating Bottom Input Bar (matching Image 1 & 5 right window) */}
          <div className="p-3 bg-[#181818] border-t border-[#262626] relative">
            <ChatGPTAttachMenu
              isOpen={attachMenuOpen}
              onClose={() => setAttachMenuOpen(false)}
              onSelectAction={(action) => {
                if (action === 'upload' || action === 'screenshot') {
                  fileInputRef.current?.click();
                } else if (action === 'code') {
                  setOutputInput('// Paste code diff here');
                }
              }}
            />

            <form
              onSubmit={handleSendChatMessage}
              className="bg-[#212121] border border-[#2f2f2f] rounded-3xl px-3 py-2 flex items-center gap-2 shadow-lg focus-within:border-slate-500 transition-colors"
            >
              <button
                type="button"
                onClick={() => setAttachMenuOpen(!attachMenuOpen)}
                className="w-7 h-7 rounded-full bg-[#2c2c2c] hover:bg-[#363636] text-slate-300 flex items-center justify-center transition-colors shrink-0"
                title="Add photos & files"
              >
                <Plus className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage(e);
                  }
                }}
                placeholder="Ask anything or enter instruction..."
                className="flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden"
              />

              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-white transition-colors shrink-0"
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!chatInput.trim() || sendingChat}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0 ${
                  chatInput.trim() && !sendingChat
                    ? 'bg-white text-black hover:bg-slate-200 cursor-pointer scale-100'
                    : 'bg-[#333333] text-slate-500 cursor-not-allowed opacity-60'
                }`}
                title="Send message (Enter)"
              >
                {sendingChat ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Model Selector Modal */}
      <ModelSelectorModal
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        selectedModel={currentModel}
        onSelectModel={onModelChange}
        options={BUILDER_MODEL_OPTIONS}
        title="Builder Agent Model"
      />
    </div>
  );
};
