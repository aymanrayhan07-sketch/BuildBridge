# 🚀 BuildBridge Deployment Guide

This guide explains how to deploy your complete **BuildBridge** prototype to the web (Vercel, Netlify, or GitHub).

---

## 1. Local Prototype Links (Currently Running)

Your local development server is active at:

- **Landing Page (Canva UI Design)**: [http://localhost:3000](http://localhost:3000)
- **Projects Dashboard**: [http://localhost:3000/projects](http://localhost:3000/projects)
- **New Project Form**: [http://localhost:3000/projects/new](http://localhost:3000/projects/new)
- **Waiting Room App Dual Workspace**: [http://localhost:3000/projects/11111111-1111-1111-1111-111111111111](http://localhost:3000/projects/11111111-1111-1111-1111-111111111111)

---

## 2. Deploy to Vercel (Recommended — Free & 1-Click)

Next.js 15 with App Router is natively built by Vercel and deploys seamlessly.

### Method A: Deploy via GitHub & Vercel Dashboard (Easiest)

1. **Create a new repository on GitHub**:
   - Go to [https://github.com/new](https://github.com/new).
   - Name it `buildbridge` and leave it empty (do not add README or .gitignore).

2. **Push your code to GitHub**:
   Open PowerShell or Terminal inside `C:\Users\DELL\.gemini\antigravity\scratch\buildbridge` and run:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/buildbridge.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new).
   - Connect your GitHub account and click **Import** next to your `buildbridge` repository.
   - Click **Deploy**!
   - In less than 60 seconds, your site will be live at `https://buildbridge.vercel.app` (or your custom domain).

---

### Method B: Deploy Directly via Terminal (No GitHub Required)

You can deploy directly from your machine using the Vercel CLI:

1. Open PowerShell in `C:\Users\DELL\.gemini\antigravity\scratch\buildbridge`:
   ```powershell
   npx vercel
   ```
2. Follow the quick prompts in your terminal:
   - Log in to your Vercel account.
   - Accept default settings (`y` to link project, default project settings).
3. For production deployment:
   ```powershell
   npx vercel --prod
   ```
4. Vercel will immediately output your live URL (e.g. `https://buildbridge-xxx.vercel.app`).

---

## 3. Environment Variables (Optional Production Configuration)

In your Vercel Project Settings under **Environment Variables**, you can add:

| Variable | Description | Default |
|---|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter master API key (optional — users can also add keys in UI) | Fallback simulator |
| `OPENROUTER_DEFAULT_PLANNER_MODEL` | Default model for Planner AI | `google/gemini-2.5-flash` |
| `OPENROUTER_DEFAULT_BUILDER_MODEL` | Default model for Builder Agent | `deepseek/deepseek-chat` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (optional) | Built-in JSON DB adapter |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key (optional) | Built-in JSON DB adapter |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (optional) | Built-in JSON DB adapter |

> **Note**: BuildBridge has an integrated zero-config storage adapter and AI simulator, which means **the prototype will work out of the box on Vercel even without setting up database or API keys**!

---

## 4. Deploy to Netlify

1. Push your repository to GitHub.
2. Go to [https://app.netlify.com](https://app.netlify.com) and click **Add new site** → **Import an existing project**.
3. Select your GitHub repository.
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Click **Deploy**.
