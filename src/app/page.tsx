import React from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowRight,
  Brain,
  Sparkles,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Cpu,
  Workflow,
  ArrowUpRight,
  FolderGit2,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#28221c] flex flex-col font-sans selection:bg-[#7d4732]/25 selection:text-[#7d4732]">
      {/* Top Navigation Bar */}
      <header className="h-18 px-6 md:px-12 border-b border-[#e5decfa0] bg-[#f5efe6]/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#7d4732] text-[#f5efe6] flex items-center justify-center font-serif text-xl font-bold shadow-md shadow-[#7d4732]/20">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-tight font-semibold text-[#28221c]">
              BuildBridge
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#7d4732] font-semibold">
              Studio Workspace
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-[#5e5348]">
          <a href="#services" className="hover:text-[#7d4732] transition-colors">
            Services
          </a>
          <a href="#our-work" className="hover:text-[#7d4732] transition-colors">
            Our Work
          </a>
          <a href="#faqs" className="hover:text-[#7d4732] transition-colors">
            FAQs
          </a>
          <a href="#reviews" className="hover:text-[#7d4732] transition-colors">
            Reviews
          </a>
          <a href="#contact" className="hover:text-[#7d4732] transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#5e5348] hover:text-[#28221c] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/projects/11111111-1111-1111-1111-111111111111"
            className="px-5 py-2.5 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] rounded-full text-xs font-semibold tracking-wider uppercase shadow-md shadow-[#7d4732]/25 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ================= PAGE 1: HERO & OUR WORK ================= */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Studio Title & Introduction */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#7d4732]">
                STUDIO BUILDBRIDGE • AI ARCHITECTURE
              </span>

              <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-[#28221c] leading-[1.05]">
                Branding &<br />
                Design Work
              </h1>

              <p className="text-sm md:text-base text-[#5e5348] max-w-lg leading-relaxed pt-2">
                Unifying software planning, architectural blueprints, and autonomous AI coding agents with a shared Project Memory bridge.
              </p>

              <div className="pt-2">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#28221c] border-b-2 border-[#7d4732] pb-1 hover:text-[#7d4732] transition-colors group"
                >
                  <span>Explore Projects Dashboard</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Aesthetic sculpture / visual container */}
            <div className="bg-[#e8e1d3] border border-[#d6cec0] rounded-3xl p-6 relative overflow-hidden flex items-center justify-between min-h-[220px] shadow-sm">
              <div className="space-y-2 z-10 max-w-[260px]">
                <div className="w-8 h-8 rounded-full bg-[#7d4732]/10 text-[#7d4732] flex items-center justify-center mb-3">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#28221c]">
                  Context Continuity
                </h3>
                <p className="text-xs text-[#5e5348] leading-relaxed">
                  Never re-explain your idea to Cline, Codex, Antigravity, or Claude Code again.
                </p>
              </div>

              {/* Decorative 3D artistic emblem (matching Canva desk sculpture) */}
              <div className="w-32 h-32 rounded-full bg-[#7d4732]/15 border border-[#7d4732]/30 flex items-center justify-center text-[#7d4732] shadow-inner shrink-0">
                <Workflow className="w-16 h-16 stroke-[1.2]" />
              </div>
            </div>
          </div>

          {/* Right Column: Phone Showcase & Terracotta "Our Work" Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Phone Mockup Window (matching Canva phone in hands) */}
            <div className="bg-[#1e1c1a] text-[#f5efe6] rounded-3xl p-6 shadow-xl relative overflow-hidden border border-[#38332e] flex flex-col justify-between min-h-[240px]">
              <div className="flex items-center justify-between text-[11px] text-[#a89d8f] pb-3 border-b border-[#36302a]">
                <span className="font-mono">BuildBridge Dual Workspace</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="py-4 space-y-2">
                <div className="bg-[#2c2722] p-3 rounded-xl border border-[#3e3831] text-xs">
                  <span className="text-[#a89d8f] block text-[10px] uppercase font-mono mb-1">
                    Planner AI Prompt
                  </span>
                  &quot;Generate sequential token state machine & public queue board.&quot;
                </div>
                <div className="bg-[#7d4732]/30 p-2.5 rounded-xl border border-[#7d4732]/40 text-xs text-[#e8e1d3]">
                  &quot;Builder Agent completed components/QueueDisplay.tsx&quot;
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#a89d8f]">Synced with Memory</span>
                <Link
                  href="/projects/11111111-1111-1111-1111-111111111111"
                  className="text-xs font-semibold text-[#f5efe6] hover:text-[#dfd7c8] flex items-center gap-1"
                >
                  Live Demo &rarr;
                </Link>
              </div>
            </div>

            {/* The Terracotta Card: "Our work" (matching Canva Page 1 card) */}
            <div
              id="our-work"
              className="bg-[#7d4732] text-[#f5efe6] rounded-3xl p-7 shadow-lg relative overflow-hidden space-y-4"
            >
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[#f5efe6]">
                Our work
              </h2>
              <p className="text-xs md:text-sm leading-relaxed text-[#ede6dc]/95 font-light">
                Since our founding in the AI era, BuildBridge has set the standard for coordinating complex software development. We separate high-level architectural reasoning from relentless coding execution, bridging the gap with shared Project Memory so every cycle produces tangible results.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[#945741] text-xs text-[#ede6dc]">
                <span>Architect & Builder Synergy</span>
                <span className="font-serif italic">Est. 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PAGE 2: SERVICES ================= */}
      <section id="services" className="bg-[#e8e1d3] border-y border-[#d8d0bf] py-20">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12">
          <div className="mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#7d4732] block mb-2">
              Capabilities
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-normal text-[#28221c]">
              Services
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: 3 Rounded Service Pills (matching Canva Page 2) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Service 1: Brand Kit / System Architecture */}
              <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl p-5 hover:bg-[#d5ccba] transition-all group shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7d4732] text-[#f5efe6] flex items-center justify-center shrink-0 shadow-sm">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#28221c] group-hover:text-[#7d4732] transition-colors">
                      Architectural Blueprint
                    </h3>
                    <p className="text-xs text-[#5e5348] mt-1 leading-relaxed">
                      Evaluate technical stacks, build order, and database schema with our Perplexity-style research assistant before executing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service 2: Creative Support / Prompt Engine */}
              <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl p-5 hover:bg-[#d5ccba] transition-all group shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7d4732] text-[#f5efe6] flex items-center justify-center shrink-0 shadow-sm">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#28221c] group-hover:text-[#7d4732] transition-colors">
                      Precision Prompt Engine
                    </h3>
                    <p className="text-xs text-[#5e5348] mt-1 leading-relaxed">
                      Synthesize scoped prompts ready for Cline, Codex, Antigravity, or Claude Code with strict file targets and acceptance criteria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service 3: Digital Design / Artifact Verification */}
              <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl p-5 hover:bg-[#d5ccba] transition-all group shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7d4732] text-[#f5efe6] flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#28221c] group-hover:text-[#7d4732] transition-colors">
                      Artifact & Proof Review
                    </h3>
                    <p className="text-xs text-[#5e5348] mt-1 leading-relaxed">
                      Import screenshots, diffs, and terminal outputs. The Planner verifies evidence before marking milestones as complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tablet Preview Mockup */}
            <div className="lg:col-span-6 bg-[#f5efe6] border border-[#d8d0bf] rounded-3xl p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e5decfa0]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7d4732]" />
                  <span className="font-serif font-bold text-sm text-[#28221c]">
                    Live Split-Screen Architecture
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#7d4732] font-semibold bg-[#7d4732]/10 px-2.5 py-1 rounded-full">
                  Continuous Loop
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#e8e1d3] p-4 rounded-xl border border-[#d6cec0] space-y-1.5">
                  <span className="font-serif font-bold text-sm block text-[#28221c]">
                    Planner AI
                  </span>
                  <p className="text-[11px] text-[#5e5348] leading-tight">
                    Researches, teaches, scopes tasks, and verifies proofs.
                  </p>
                </div>
                <div className="bg-[#e8e1d3] p-4 rounded-xl border border-[#d6cec0] space-y-1.5">
                  <span className="font-serif font-bold text-sm block text-[#28221c]">
                    Builder Agent
                  </span>
                  <p className="text-[11px] text-[#5e5348] leading-tight">
                    Copies prompts, imports outputs, and logs artifacts.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#ded7c9] rounded-xl text-center space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#5e5348] font-semibold block">
                  Shared Project Memory
                </span>
                <p className="text-xs text-[#28221c]">
                  Goals • Decisions • Milestones • Known Issues • Verified Artifacts
                </p>
              </div>

              <Link
                href="/projects/11111111-1111-1111-1111-111111111111"
                className="w-full py-3 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Open Dual Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PAGE 3: FAQS & EARLY REVIEWS ================= */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 py-20 space-y-20">
        {/* Top: The Framed FAQ Container (matching Canva Page 3 top box) */}
        <div
          id="faqs"
          className="bg-[#e8e1d3] border-2 border-[#7d4732] rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#28221c] text-center mb-10">
            FAQs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* FAQ 1 */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-medium text-[#28221c]">
                Why should I separate Planner & Builder?
              </h3>
              <p className="text-xs text-[#5e5348] leading-relaxed">
                A strong software architect clarifies requirements and creates plans without coding fatigue. Builder agents, meanwhile, write accurate code when given tight, bounded constraints. Separating them eliminates hallucinations.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-medium text-[#28221c]">
                Can you work with my existing AI agent?
              </h3>
              <p className="text-xs text-[#5e5348] leading-relaxed">
                Yes. BuildBridge generates copy-ready prompts for any agent — including Cline, Codex, Antigravity, and Claude Code. You paste their response or screenshot back into BuildBridge to log verified progress.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-medium text-[#28221c]">
                How does the Project Memory bridge work?
              </h3>
              <p className="text-xs text-[#5e5348] leading-relaxed">
                Whenever an agent finishes a task, its output is distilled into shared Project Memory. Every new Planner or Builder chat loads this memory automatically, so you never re-explain the project history.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Early Reviews (matching Canva Page 3 bottom section) */}
        <div id="reviews" className="space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#7d4732] block mb-2">
              Testimonials
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#28221c]">
              Early Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Tablet Graphic Showcase */}
            <div className="lg:col-span-5 bg-[#e8e1d3] border border-[#d6cec0] rounded-3xl p-8 flex flex-col justify-between shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#7d4732] text-[#f5efe6] flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                “
              </div>
              <div className="space-y-3 my-8">
                <span className="font-serif text-2xl md:text-3xl font-normal text-[#28221c] block leading-snug">
                  Designed for developers who value clarity over chaos.
                </span>
                <p className="text-xs text-[#5e5348] leading-relaxed">
                  Trusted by independent builders, startup founders, and technical leads navigating the AI coding revolution.
                </p>
              </div>
              <div className="pt-4 border-t border-[#d6cec0] flex items-center justify-between text-xs text-[#7d4732] font-semibold uppercase tracking-wider">
                <span>Verified Feedback</span>
                <span>★★★★★</span>
              </div>
            </div>

            {/* Right: Rounded Sand Quote Cards (matching Canva Page 3 & 4) */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              {/* Review 1: Irena */}
              <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl p-5 shadow-xs">
                <p className="text-xs md:text-sm text-[#28221c] leading-relaxed italic font-light">
                  &quot;The dual-window workflow was exactly what we needed — clean, resilient, and perfectly synchronized. It captured our architectural vision better than we imagined.&quot;
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#28221c]">
                    Irena
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#7d4732] font-semibold">
                    Lead Solutions Architect
                  </span>
                </div>
              </div>

              {/* Review 2: Leopold */}
              <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl p-5 shadow-xs">
                <p className="text-xs md:text-sm text-[#28221c] leading-relaxed italic font-light">
                  &quot;From initial project plan to terminal execution, everything feels consistent. Our developers noticed the difference right away and love having a shared memory bridge.&quot;
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#28221c]">
                    Leopold
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#7d4732] font-semibold">
                    Startup Founder
                  </span>
                </div>
              </div>

              {/* Review 3: Solana & James */}
              <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl p-5 shadow-xs">
                <p className="text-xs md:text-sm text-[#28221c] leading-relaxed italic font-light">
                  &quot;Turned our vague idea into a running prototype in hours. No more copy-paste fatigue or explaining the same context in twelve separate ChatGPT windows.&quot;
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#28221c]">
                    Solana & James
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#7d4732] font-semibold">
                    Full-Stack Builders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PAGE 4: CONTACT US & LAUNCH ================= */}
      <section id="contact" className="bg-[#e8e1d3] border-t border-[#d8d0bf] py-20">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Contact Pill Cards (matching Canva Page 4) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#7d4732] block mb-2">
                  Get in touch
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#28221c]">
                  Contact Us
                </h2>
              </div>

              <div className="space-y-3">
                {/* Phone Pill */}
                <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl px-5 py-4 flex items-center justify-between shadow-xs hover:bg-[#d5ccba] transition-colors">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#7d4732]" />
                    <span className="font-serif text-sm font-medium text-[#28221c]">
                      Phone
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#5e5348]">
                    (123) 456-7890
                  </span>
                </div>

                {/* Email Pill */}
                <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl px-5 py-4 flex items-center justify-between shadow-xs hover:bg-[#d5ccba] transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#7d4732]" />
                    <span className="font-serif text-sm font-medium text-[#28221c]">
                      Email
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#5e5348]">
                    hello@buildbridge.dev
                  </span>
                </div>

                {/* Social Pill */}
                <div className="bg-[#ded7c9] border border-[#cfc6b4] rounded-2xl px-5 py-4 flex items-center justify-between shadow-xs hover:bg-[#d5ccba] transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#7d4732]" />
                    <span className="font-serif text-sm font-medium text-[#28221c]">
                      Social
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#5e5348]">
                    @buildbridge_studio
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects"
                  className="w-full py-4 bg-[#7d4732] hover:bg-[#643725] text-[#f5efe6] rounded-2xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Start New Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Desk Scene & Direct Prototype Link */}
            <div className="lg:col-span-6 bg-[#f5efe6] border border-[#d8d0bf] rounded-3xl p-8 md:p-10 shadow-lg space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7d4732]/10 text-[#7d4732] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#28221c]">
                  Ready to test the prototype?
                </h3>
                <p className="text-xs md:text-sm text-[#5e5348] leading-relaxed">
                  Open the pre-configured Waiting Room App dual-screen workspace. Test the Perplexity-style Planner AI, copy scoped prompts, send instructions with physical Enter or Send button, and resize the central split divider.
                </p>
              </div>

              <div className="pt-4 border-t border-[#e5decfa0] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/projects/11111111-1111-1111-1111-111111111111"
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-[#28221c] hover:bg-[#1a1613] text-[#f5efe6] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <span>Open Prototype Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects/new"
                  className="w-full sm:w-auto py-3.5 px-6 bg-[#e8e1d3] hover:bg-[#ded7c9] text-[#28221c] border border-[#d0c7b6] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-all"
                >
                  Create Custom
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 bg-[#28221c] text-[#f5efe6] border-t border-[#3a322b]">
        <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a89d8f]">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#f5efe6]">BuildBridge</span>
            <span>• Studio Promotion & Workspace</span>
          </div>
          <p>© 2026 BuildBridge AI. Designed with Canva aesthetic.</p>
        </div>
      </footer>
    </div>
  );
}
