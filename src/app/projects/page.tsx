'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Layers,
  Clock,
  Trash2,
  ExternalLink,
  Bot,
  MessageSquare,
  AlertTriangle,
  Loader2,
  FolderGit2,
  ArrowRight,
} from 'lucide-react';
import { Project } from '@/types';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        throw new Error('Failed to load projects');
      }
    } catch {
      setError('Could not retrieve projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      setDeletingId(projectToDelete.id);
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        setProjectToDelete(null);
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting project');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#28221c] flex flex-col font-sans selection:bg-[#7d4732]/25 selection:text-[#7d4732]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Top Header (Canva Editorial Style) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d8d0bf] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7d4732] block mb-1">
              Workspace Registry
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-normal text-[#28221c] flex items-center gap-2.5">
              <span>Projects Dashboard</span>
            </h1>
            <p className="text-xs text-[#5e5348] mt-1">
              Manage architectural plans, scoped agent prompts, and shared Project Memory sessions.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="px-5 py-2.5 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] rounded-full text-xs font-semibold tracking-wider uppercase shadow-md shadow-[#7d4732]/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs rounded-2xl">
            {error}
          </div>
        )}

        {/* Project Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5e5348] space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#7d4732]" />
            <span className="text-xs">Loading projects registry...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#d8d0bf] rounded-3xl bg-[#e8e1d3]/60 max-w-md mx-auto p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#7d4732]/10 text-[#7d4732] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#28221c]">No Projects Found</h3>
            <p className="text-xs text-[#5e5348] leading-relaxed">
              Create your first project to draft architecture plans and generate prompts for external AI coding agents.
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] text-xs font-semibold rounded-full"
            >
              <Plus className="w-4 h-4" /> Start New Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#e8e1d3] border border-[#d6cec0] hover:border-[#7d4732] rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between group transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-serif text-xl font-medium text-[#28221c] group-hover:text-[#7d4732] transition-colors line-clamp-1">
                      {project.name}
                    </h2>
                    <StatusBadge status={project.status} size="sm" />
                  </div>

                  {project.idea_text && (
                    <p className="text-xs text-[#5e5348] line-clamp-2 leading-relaxed">
                      {project.idea_text}
                    </p>
                  )}

                  <div className="space-y-1.5 pt-3 border-t border-[#d8d0bf] text-[11px] text-[#5e5348]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[#5e5348]">
                        <MessageSquare className="w-3 h-3 text-[#7d4732]" /> Planner:
                      </span>
                      <span className="font-mono text-[#28221c] truncate max-w-[140px] font-medium">
                        {project.planner_model?.split('/')[1] || project.planner_model}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[#5e5348]">
                        <Bot className="w-3 h-3 text-[#7d4732]" /> Builder:
                      </span>
                      <span className="font-mono text-[#28221c] truncate max-w-[140px] font-medium">
                        {project.builder_model?.split('/')[1] || project.builder_model}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 text-[#5e5348]">
                        <Clock className="w-3 h-3" /> Updated:
                      </span>
                      <span className="text-[#5e5348]">
                        {new Date(project.updated_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#d8d0bf] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="p-2 text-[#7d4732]/70 hover:text-rose-600 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/projects/${project.id}`}
                    className="px-4 py-2 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#f5efe6] border border-[#d8d0bf] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-medium text-[#28221c]">
                Delete &quot;{projectToDelete.name}&quot;?
              </h3>
              <p className="text-xs text-[#5e5348] mt-1 leading-relaxed">
                This will permanently delete this project, all Planner chats, Builder chats, and associated Project Memory.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#5e5348] hover:text-[#28221c] rounded-full cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === projectToDelete.id}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer"
              >
                {deletingId === projectToDelete.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
