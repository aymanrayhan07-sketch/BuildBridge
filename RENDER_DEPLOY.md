# 🚀 Deploying BuildBridge to Render

This project is fully configured for 1-click deployment on [Render](https://render.com) via **Render Blueprints** (`render.yaml`).

---

## Step 1: Push to GitHub

Render builds apps directly from a GitHub repository.

1. Create a new empty repository on GitHub:
   👉 **[https://github.com/new](https://github.com/new)**
   - Repository name: `buildbridge`
   - Leave it public or private (your choice).
   - Do NOT check "Add a README" or ".gitignore" (these already exist in your local code).

2. Open PowerShell in `C:\Users\DELL\.gemini\antigravity\scratch\buildbridge` and run:
   ```powershell
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/buildbridge.git
   git branch -M main
   git push -u origin main
   ```
   *(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username).*

---

## Step 2: Deploy on Render (1-Click Blueprint)

1. Go to your Render Dashboard:
   👉 **[https://dashboard.render.com](https://dashboard.render.com)**

2. Click **New +** (top right) → **Blueprint**.

3. Connect your GitHub account and select the **`buildbridge`** repository.

4. Render will automatically read the included `render.yaml` file:
   - **Service Name**: `buildbridge`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (configured with `-H 0.0.0.0`)
   - **Plan**: `Free`

5. Click **Apply** or **Create Web Service**.

---

## Step 3: Your Live Web App

Render will begin building your project. Within 2–3 minutes, your prototype will be live on the web at:
👉 **`https://buildbridge.onrender.com`** (or your chosen service name).

---

## Optional: Manual Web Service Setup (Alternative)

If you prefer setting it up manually instead of using Blueprints:
1. On Render, click **New +** → **Web Service**.
2. Connect your `buildbridge` GitHub repo.
3. Choose the **Free** instance type.
4. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Deploy Web Service**.
