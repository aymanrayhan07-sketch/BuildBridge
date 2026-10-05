'use client';

import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  Edit3,
  Save,
  Upload,
  Image,
  FileCode,
  Sparkles,
  Bot,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { AgentPrompt, AgentArtifact, ProjectMemory, ReviewResult } from '@/types';
import { BUILDER_MODELS } from '@/lib/constants';
import { ProjectMemorySummary } from './ProjectMemorySummary';
import { ApprovalBanner } from './ApprovalBanner';

interface BuilderAgentViewProps {
  projectId: string;
  agentChatId: string;
  agentChatTitle: string;
  currentModel: string;
  onModelChange: (model: string) => void;
  prompts: AgentPrompt[];
  artifacts: AgentArtifact[];
  memory: ProjectMemory[];
  onOutputImported?: (content: string) => void;
  onScreenshotUploaded?: () => void;
  onPromptUpdated?: (newPrompt: AgentPrompt) => void;
}

export const BuilderAgentView: React.FC<BuilderAgentViewProps> = ({
  projectId,
  agentChatId,
  agentChatTitle,
  currentModel,
  onModelChange,
  prompts,
  artifacts,
  memory,
  onOutputImported,
  onScreenshotUploaded,
  onPromptUpdated,
}) => {
  const latestPrompt = prompts[0];
  const [copied, setCopied] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPromptText, setEditedPromptText] = useState(latestPrompt?.prompt_text || '');

  // Agent output import
  const [outputInput, setOutputInput] = useState('');
  const [artifactType, setArtifactType] = useState<'output' | 'log' | 'file_list'>('output');
  const [importingOutput, setImportingOutput] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Screenshot upload
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotCaption, setScreenshotCaption] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy prompt helper
  const handleCopyPrompt = () => {
    const textToCopy = isEditingPrompt ? editedPromptText : latestPrompt?.prompt_text || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save edited prompt
  const handleSavePrompt = async () => {
    if (!latestPrompt) return;
    setIsEditingPrompt(false);
    onPromptUpdated?.({
      ...latestPrompt,
      prompt_text: editedPromptText,
    });
  };

  // Import agent output
  const handleImportOutput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outputInput.trim()) return;

    try {
      setImportingOutput(true);
      setImportSuccess(null);
      const res = await fetch('/api/agent/output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          agentChatId,
          content: outputInput.trim(),
          artifactType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import output');

      onOutputImported?.(outputInput.trim());
      setOutputInput('');
      setImportSuccess('Agent output imported and Project Memory synced!');
      setTimeout(() => setImportSuccess(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error importing output');
    } finally {
      setImportingOutput(false);
    }
  };

  // Upload screenshot
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
    if (!screenshotPreview) return;
    try {
      setUploadingScreenshot(true);
      const res = await fetch('/api/agent/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          agentChatId,
          fileUrl: screenshotPreview,
          caption: screenshotCaption.trim() || 'Visual proof of build',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed uploading screenshot');

      setScreenshotPreview(null);
      setScreenshotCaption('');
      onScreenshotUploaded?.();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error uploading screenshot');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  return (
    <div className="w-full lg:w-[460px] xl:w-[500px] bg-[#090d16] flex flex-col h-full border-l border-slate-800">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-[#070a12] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{agentChatTitle || 'Builder Agent Workspace'}</h2>
            <div className="text-[11px] text-slate-400">External Coding Agent Bridge</div>
          </div>
        </div>

        {/* Builder Model Selector */}
        <div className="flex items-center gap-1.5">
          <select
            value={currentModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="px-2.5 py-1 text-xs bg-[#0f172a] border border-violet-500/40 text-violet-300 rounded-lg focus:outline-hidden focus:border-violet-400"
          >
            {BUILDER_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Scrollable Workspace Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Permission-style Approval UI */}
        <ApprovalBanner />

        {/* Current Agent Prompt Box */}
        <div className="bg-[#0f172a] border border-violet-500/30 rounded-xl overflow-hidden shadow-lg shadow-violet-500/5">
          <div className="p-3 bg-violet-950/30 border-b border-violet-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Current Agent Prompt
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {latestPrompt && (
                <>
                  <button
                    onClick={() => {
                      if (!isEditingPrompt) {
                        setEditedPromptText(latestPrompt.prompt_text);
                        setIsEditingPrompt(true);
                      } else {
                        handleSavePrompt();
                      }
                    }}
                    className="px-2 py-1 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    {isEditingPrompt ? (
                      <>
                        <Save className="w-3 h-3" /> Save
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3 h-3" /> Edit
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyPrompt}
                    className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Prompt
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-3">
            {isEditingPrompt ? (
              <textarea
                value={editedPromptText}
                onChange={(e) => setEditedPromptText(e.target.value)}
                rows={7}
                className="w-full bg-[#090d16] border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-violet-500"
              />
            ) : latestPrompt ? (
              <div className="bg-[#090d16]/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {latestPrompt.prompt_text}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                No active prompt generated yet. Click &quot;Generate Agent Prompt&quot; in the Planner column.
              </div>
            )}

            {/* Instruction Callout */}
            <div className="mt-2.5 p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
              <ExternalLink className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Next step:</strong> Paste this prompt into <strong>Cline</strong>, <strong>Codex</strong>, <strong>Antigravity</strong>, or <strong>Claude Code</strong>. Then paste the agent&apos;s output below.
              </span>
            </div>
          </div>
        </div>

        {/* Agent Output Import Area */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              Import Agent Output
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Type:</span>
              <select
                value={artifactType}
                onChange={(e) => setArtifactType(e.target.value as 'output' | 'log' | 'file_list')}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 text-[11px]"
              >
                <option value="output">Output</option>
                <option value="log">Log</option>
                <option value="file_list">File List</option>
              </select>
            </div>
          </div>

          {importSuccess && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          <form onSubmit={handleImportOutput} className="space-y-2.5">
            <textarea
              value={outputInput}
              onChange={(e) => setOutputInput(e.target.value)}
              placeholder="Paste terminal logs, completed file diffs, or agent response here..."
              rows={4}
              className="w-full bg-[#090d16] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-500 font-mono focus:outline-hidden focus:border-blue-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={importingOutput || !outputInput.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{importingOutput ? 'Importing...' : 'Save Agent Output & Update Memory'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Screenshot Upload Area */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-violet-400" />
            Upload Agent Screenshot Evidence
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleScreenshotSelect}
            accept="image/*"
            className="hidden"
          />

          {screenshotPreview ? (
            <div className="space-y-2">
              <div className="relative border border-slate-700 rounded-lg overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotPreview}
                  alt="Upload preview"
                  className="w-full max-h-48 object-contain"
                />
              </div>
              <input
                type="text"
                placeholder="Caption (e.g., Queue public screen rendered)"
                value={screenshotCaption}
                onChange={(e) => setScreenshotCaption(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScreenshotPreview(null)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadScreenshot}
                  disabled={uploadingScreenshot}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingScreenshot ? 'Uploading...' : 'Save Screenshot Artifact'}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-slate-700 hover:border-violet-500/60 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/40"
            >
              <Upload className="w-5 h-5 text-violet-400" />
              <span className="font-medium">Click to upload screenshot or drag and drop</span>
              <span className="text-[10px] text-slate-500">PNG, JPG, or WebP</span>
            </button>
          )}
        </div>

        {/* Agent Artifacts List */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              Agent Artifacts ({artifacts.length})
            </span>
          </div>

          {artifacts.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
              No artifacts recorded yet. Import agent responses or screenshots to build verification evidence.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {artifacts.map((a) => (
                <div
                  key={a.id}
                  className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="uppercase font-mono font-semibold text-amber-400">
                      {a.artifact_type}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {a.artifact_type === 'screenshot' && a.file_url ? (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.file_url}
                        alt="Artifact"
                        className="w-full max-h-32 object-contain rounded border border-slate-800 my-1 bg-black/30"
                      />
                      <div className="text-[11px] text-slate-300">{a.content}</div>
                    </div>
                  ) : (
                    <div className="text-slate-300 font-mono text-[11px] line-clamp-3 bg-black/30 p-1.5 rounded border border-slate-800/80">
                      {a.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Memory Summary */}
        <ProjectMemorySummary memory={memory} />
      </div>
    </div>
  );
};
