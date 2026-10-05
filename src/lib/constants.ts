export const PLANNER_MODELS = [
  { id: 'google/gemini-2.5-flash', name: 'Google Gemini 2.5 Flash', badge: 'Fast & Versatile' },
  { id: 'google/gemini-2.5-pro', name: 'Google Gemini 2.5 Pro', badge: 'Deep Reasoning' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', badge: 'State of the Art' },
  { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o', badge: 'High Capability' },
  { id: 'openai/gpt-4o-mini', name: 'OpenAI GPT-4o Mini', badge: 'Lightweight' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat V3', badge: 'Cost Efficient' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', badge: 'Open Weights' },
];

export const BUILDER_MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat (Coding)', badge: 'Recommended' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', badge: 'Top Coding' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', badge: 'Robust Coding' },
  { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o', badge: 'Code & Logic' },
  { id: 'google/gemini-2.5-flash', name: 'Google Gemini 2.5 Flash', badge: 'High Speed' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', badge: 'Specialized' },
];

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  idea: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  planned: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'prompt ready': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  building: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  'needs review': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'needs fix': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};
