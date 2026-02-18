# 🚀 Deploying RepoLens to Render

Deploying to Render is simple because it natively supports Node.js applications.

## Prerequisites
- A **GitHub** account.
- A **Render** account (sign up via GitHub).
- Your project pushed to a GitHub repository.

---

## Step 1: Push Code to GitHub
Ensure you have committed and pushed your latest changes:
```bash
git add .
git commit -m "Initial release for Render"
git push origin main
```

## Step 2: Create Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/).
2. Click **"New"** -> **"Web Service"**.
3. Connect your **GitHub** account and select the **Repolens** repository.
4. Render will detect the `render.yaml` file (Blueprint).

## Step 3: Configure Environment Variables
Inside the Render dashboard, add the following Environment Variables:

- `DATABASE_URL` (Use the **Transaction Pooler URL** from Supabase)
- `GEMINI_API_KEY`
- `GITHUB_TOKEN`
- `SESSION_SECRET`

## Step 4: Deploy
Click **"Create Web Service"**. Once live, you will get a URL like `repolens.onrender.com`.
