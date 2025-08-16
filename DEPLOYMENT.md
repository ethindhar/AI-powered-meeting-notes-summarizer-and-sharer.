# 🚀 Deployment Guide for AI Meeting Notes Summarizer

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)
- Your `.env` file with all environment variables

## 🎯 Deployment Strategy

This is a **full-stack application** with:
- **Backend**: Node.js/Express server (deploy to Railway)
- **Frontend**: React app (deploy to Vercel)

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Setup Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 1.2 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
HF_API_KEY=your-hugging-face-api-key
PORT=5000
```

### 1.3 Deploy
1. Railway will automatically detect it's a Node.js app
2. It will run `npm install` and start the server
3. Note the **deployed URL** (e.g., `https://your-app.railway.app`)

## 🚀 Step 2: Deploy Frontend to Vercel

### 2.1 Setup Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your repository

### 2.2 Configure Build Settings
- **Framework Preset**: Create React App
- **Root Directory**: `./` (leave as default)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm run install-all`

### 2.3 Add Environment Variable
Add this environment variable in Vercel:
- **Name**: `REACT_APP_API_URL`
- **Value**: Your Railway backend URL (e.g., `https://your-app.railway.app`)

### 2.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your React app
3. You'll get a URL like `https://your-app.vercel.app`

## 🔧 Step 3: Update Configuration

### 3.1 Update Frontend Config
In `client/src/config.js`, update the production API URL:
```javascript
production: {
  apiUrl: process.env.REACT_APP_API_URL || 'https://your-actual-railway-url.railway.app'
}
```

### 3.2 Redeploy Frontend
After updating the config, redeploy to Vercel.

## 🌐 Step 4: Test Your Deployed App

1. **Test Backend**: Visit `https://your-app.railway.app/api/health`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Full Flow**: Upload transcript, generate summary, share via email

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Your backend already has CORS configured for all origins.

### Issue: Environment Variables Not Working
**Solution**: Make sure you've added them in Railway dashboard.

### Issue: Frontend Can't Connect to Backend
**Solution**: Check that `REACT_APP_API_URL` is set correctly in Vercel.

### Issue: Email Not Working
**Solution**: Verify your Gmail app password in Railway environment variables.

## 📱 Custom Domain (Optional)

### Vercel (Frontend)
1. Go to your project settings
2. Add custom domain
3. Update DNS records as instructed

### Railway (Backend)
1. Go to your project settings
2. Add custom domain
3. Update DNS records as instructed

## 🔄 Updating Your App

### Backend Updates
1. Push changes to GitHub
2. Railway automatically redeploys

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically redeploys

## 💰 Cost Breakdown

- **Vercel**: Free tier (unlimited deployments)
- **Railway**: Free tier (500 hours/month)
- **Total**: $0/month for basic usage

## 🎉 You're Done!

Your AI Meeting Notes Summarizer is now live on the internet! 🚀

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Check your repository for deployment issues
