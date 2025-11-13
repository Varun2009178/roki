# Deploy róki Backend to Vercel - Step by Step

## Step 1: Push to GitHub

```bash
cd roki-backend
git init
git add .
git commit -m "Initial róki backend"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository (`roki-backend`)
4. Click **"Deploy"** (don't worry about env vars yet)

## Step 3: Add OpenRouter API Key

1. After deployment, go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `sk-or-v1-your-actual-key-here` (get from openrouter.ai/keys)
4. Click **Save**
5. Go to **Deployments** tab
6. Click the **3 dots** on latest deployment → **Redeploy**

## Step 4: Get Your Backend URL

After redeploy, Vercel will show you a URL like:
- `https://roki-backend-abc123.vercel.app`

Copy this URL!

## Step 5: Update iOS App

1. Open `APIService.swift` in Xcode
2. Find this line:
   ```swift
   private let baseURL = "https://YOUR-VERCEL-URL.vercel.app/api"
   ```
3. Replace with your actual Vercel URL:
   ```swift
   private let baseURL = "https://roki-backend-abc123.vercel.app/api"
   ```
4. Build and run!

## Step 6: Test It

1. Create a task in the app
2. Wait for notifications (escalation level 2+)
3. You should see AI-generated messages! 🎉

## Troubleshooting

- **404 errors**: Make sure URL ends with `/api`
- **500 errors**: Check Vercel logs (Deployments → Click deployment → Logs)
- **API key errors**: Make sure env var is set and redeployed

## That's It!

Your backend is live and the iOS app will use AI for notifications! 🚀

