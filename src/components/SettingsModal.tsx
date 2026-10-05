'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Trash2, Plus, ShieldCheck, Lock } from 'lucide-react';
import { ApiKeyItem } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch {
      setError('Could not load keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchKeys();
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    try {
      setError(null);
      setSuccess(null);
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'openrouter',
          key: newKey.trim(),
          label: keyLabel.trim() || 'OpenRouter Key',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save key');
      }

      setSuccess('API key saved securely! Only masked representation is displayed.');
      setNewKey('');
      setKeyLabel('');
      fetchKeys();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error adding key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        setSuccess('Key removed successfully');
      } else {
        throw new Error('Failed to delete key');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error deleting key');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 selection:bg-[#7d4732]/25 selection:text-[#7d4732]">
      <div className="bg-[#f5efe6] border border-[#d8d0bf] rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative text-[#28221c] animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#5e5348] hover:text-[#28221c] hover:bg-[#e8e1d3] transition-colors p-1.5 rounded-full cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full bg-[#7d4732]/10 text-[#7d4732] flex items-center justify-center border border-[#7d4732]/20">
            <Key className="w-4 h-4" />
          </div>
          <h2 className="text-2xl font-serif font-normal text-[#28221c]">API Key Settings</h2>
        </div>
        <p className="text-xs text-[#5e5348] mb-6 leading-relaxed">
          Configure your personal OpenRouter credentials. Your keys are encrypted on the server and never sent to the browser.
        </p>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAddKey} className="space-y-3 mb-6 bg-[#e8e1d3] p-5 rounded-2xl border border-[#d6cec0] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d4732] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Add OpenRouter Key</span>
          </div>
          <div>
            <input
              type="password"
              placeholder="sk-or-v1-..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f5efe6] border border-[#d0c7b6] rounded-xl text-xs text-[#28221c] placeholder:text-[#9e9485] focus:outline-hidden focus:border-[#7d4732] transition-colors font-mono"
              required
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Label (optional, e.g. Work Key)"
              value={keyLabel}
              onChange={(e) => setKeyLabel(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#f5efe6] border border-[#d0c7b6] rounded-xl text-xs text-[#28221c] placeholder:text-[#9e9485] focus:outline-hidden focus:border-[#7d4732] transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" /> Save Key
            </button>
          </div>
          <div className="text-[11px] text-[#5e5348] leading-tight pt-1">
            If no key is configured, BuildBridge uses the backend environment key or built-in intelligent demo simulation.
          </div>
        </form>

        <div className="space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5348]">
            Configured Keys
          </div>
          {loading ? (
            <div className="text-xs text-[#5e5348] py-4 text-center">Loading keys...</div>
          ) : keys.length === 0 ? (
            <div className="text-xs text-[#5e5348] p-4 border border-dashed border-[#d8d0bf] rounded-2xl text-center bg-[#f5efe6]">
              No custom keys added yet. System fallback is active.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between p-3.5 bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl shadow-xs"
                >
                  <div>
                    <div className="text-xs font-serif font-semibold text-[#28221c]">{k.label || 'OpenRouter'}</div>
                    <div className="text-[11px] font-mono text-[#5e5348]">{k.masked_key}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(k.id)}
                    className="p-1.5 text-[#5e5348] hover:text-rose-600 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer"
                    title="Delete key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#d8d0bf] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#28221c] hover:bg-[#1a1613] text-[#f5efe6] rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
