#!/bin/bash

# LinguaTrade Quick Deploy Script
# This script helps you deploy LinguaTrade to production

echo "🚀 LinguaTrade Deployment Helper"
echo "================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

# Check if we have a remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No GitHub remote found."
    echo "Please create a GitHub repository and add it as origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/linguatrade.git"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Commit and push changes
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: Production ready build $(date)"
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your remote configuration."
    exit 1
fi

echo "✅ Code pushed to GitHub successfully!"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Backend Deployment (Railway):"
echo "   - Go to https://railway.app"
echo "   - Create new project from your GitHub repo"
echo "   - Set environment variables:"
echo "     NODE_ENV=production"
echo "     PORT=3001"
echo "     CLIENT_URL=https://your-frontend-domain.vercel.app"
echo "     JWT_SECRET=your-super-secret-key-here"
echo ""
echo "2. Frontend Deployment (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set root directory to 'client'"
echo "   - Set environment variables:"
echo "     VITE_API_URL=https://your-railway-url.up.railway.app"
echo "     VITE_ENVIRONMENT=production"
echo ""
echo "3. Test your deployment:"
echo "   - Backend health: https://your-railway-url.up.railway.app/api/health"
echo "   - Frontend: https://your-vercel-url.vercel.app"
echo ""
echo "🌟 Your LinguaTrade platform will be live and ready for users!"
echo ""
echo "📖 For detailed instructions, see: deploy-instructions.md"