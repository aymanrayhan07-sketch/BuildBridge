'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
  Upload,
  MessageSquare,
  Bot,
  Loader2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { PLANNER_MODELS, BUILDER_MODELS } from '@/lib/constants';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [ideaText, setIdeaText] = useState('');
  const [url, setUrl] = useState('');
  const [plannerModel, setPlannerModel] = useState('google/gemini-2.5-flash');
  const [builderModel, setBuilderModel] = useState('deepseek/deepseek-chat');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          idea_text: ideaText.trim() || undefined,
          reference_url: url.trim() || undefined,
          planner_model: plannerModel,
          builder_model: builderModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      router.push(`/projects/${data.project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating project');
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#28221c] flex flex-col font-sans selection:bg-[#7d4732]/25 selection:text-[#7d4732]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 md:px-12 py-10 space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="p-2.5 rounded-full bg-[#e8e1d3] border border-[#d6cec0] text-[#5e5348] hover:text-[#28221c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7d4732] block mb-0.5">
              Initiate Idea
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-normal text-[#28221c]">
              Create New Project
            </h1>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#e8e1d3] border border-[#d6cec0] rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
            {/* Project Name */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#5e5348]">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Waiting Room App, SaaS Analytics Dashboard"
                className="w-full bg-[#f5efe6] border border-[#d0c7b6] rounded-2xl px-4 py-3 text-sm text-[#28221c] placeholder:text-[#9e9485] focus:outline-hidden focus:border-[#7d4732] transition-colors"
              />
            </div>

            {/* What do you want to build? */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#5e5348]">
                What do you want to build?
              </label>
              <textarea
                rows={5}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="Explain your vision in plain English. For example: A waiting room ticket queue where patients receive a sequential number and staff call the next person..."
                className="w-full bg-[#f5efe6] border border-[#d0c7b6] rounded-2xl p-4 text-sm text-[#28221c] placeholder:text-[#9e9485] focus:outline-hidden focus:border-[#7d4732] transition-colors resize-y"
              />
            </div>

            {/* Reference URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#5e5348]">
                <LinkIcon className="w-3.5 h-3.5 text-[#7d4732]" />
                <span>Reference URL (Optional)</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/... or https://docs..."
                className="w-full bg-[#f5efe6] border border-[#d0c7b6] rounded-2xl px-4 py-2.5 text-sm text-[#28221c] placeholder:text-[#9e9485] focus:outline-hidden focus:border-[#7d4732] transition-colors"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#5e5348]">
                <Upload className="w-3.5 h-3.5 text-[#7d4732]" />
                <span>Attach Mockup or Specs (Optional)</span>
              </label>
              <div className="border border-dashed border-[#cfc5b3] rounded-2xl p-4 text-center bg-[#f5efe6]/70 hover:bg-[#f5efe6] transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-xs text-[#5e5348]">
                  {fileName ? (
                    <strong className="text-[#7d4732]">{fileName}</strong>
                  ) : (
                    'Click to upload reference documentation, wireframes, or images'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Model Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#e8e1d3] border border-[#d6cec0] rounded-3xl p-5 space-y-2 shadow-xs">
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#5e5348]">
                <MessageSquare className="w-3.5 h-3.5 text-[#7d4732]" />
                <span>Planner Model</span>
              </label>
              <select
                value={plannerModel}
                onChange={(e) => setPlannerModel(e.target.value)}
                className="w-full bg-[#f5efe6] border border-[#d0c7b6] rounded-xl px-3 py-2 text-xs text-[#28221c] focus:outline-hidden focus:border-[#7d4732]"
              >
                {PLANNER_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.badge})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#e8e1d3] border border-[#d6cec0] rounded-3xl p-5 space-y-2 shadow-xs">
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#5e5348]">
                <Bot className="w-3.5 h-3.5 text-[#7d4732]" />
                <span>Builder Model</span>
              </label>
              <select
                value={builderModel}
                onChange={(e) => setBuilderModel(e.target.value)}
                className="w-full bg-[#f5efe6] border border-[#d0c7b6] rounded-xl px-3 py-2 text-xs text-[#28221c] focus:outline-hidden focus:border-[#7d4732]"
              >
                {BUILDER_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/projects"
              className="px-5 py-2.5 text-xs font-semibold text-[#5e5348] hover:text-[#28221c] rounded-full"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-6 py-3 bg-[#7d4732] hover:bg-[#643725] disabled:opacity-50 text-[#f5efe6] rounded-full text-xs font-semibold uppercase tracking-wider shadow-md shadow-[#7d4732]/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Workspace...</span>
                </>
              ) : (
                <>
                  <span>Start with Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
