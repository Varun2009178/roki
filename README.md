# róki Backend

Backend API for the róki iOS app.

## Quick Deploy to Vercel

1. **Push to GitHub** (or GitLab/Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Click "Deploy"

3. **Add Environment Variable**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add: `OPENROUTER_API_KEY` = `your-actual-api-key-here`
   - Redeploy

4. **Get Your Backend URL**
   - Vercel will give you a URL like: `https://roki-backend.vercel.app`
   - Copy this URL

5. **Update iOS App**
   - Open `APIService.swift` in Xcode
   - Change `baseURL` to: `https://roki-backend.vercel.app/api`
   - Uncomment AI code in `AIService.swift`

## Local Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoint

`POST /api/ai/generate-message`

See `BACKEND_AI_API.md` for full documentation.

