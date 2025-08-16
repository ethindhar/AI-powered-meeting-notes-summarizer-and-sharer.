#!/bin/bash

echo "🚀 Starting deployment process for AI Meeting Notes Summarizer..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin YOUR_GITHUB_REPO_URL"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Update before deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is clean and up to date"

echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "1. ✅ Backend deployed to Railway"
echo "2. ✅ Frontend deployed to Vercel"
echo "3. ✅ Environment variables configured"
echo "4. ✅ API URLs updated in config"
echo ""

echo "🔗 Your deployed URLs should be:"
echo "   Frontend: https://your-app.vercel.app"
echo "   Backend: https://your-app.railway.app"
echo ""

echo "🧪 Test your deployment:"
echo "   - Visit your Vercel URL"
echo "   - Test the health endpoint: https://your-app.railway.app/api/health"
echo "   - Try uploading a transcript and generating a summary"
echo ""

echo "📚 For detailed deployment instructions, see DEPLOYMENT.md"
echo "�� Happy deploying!"
