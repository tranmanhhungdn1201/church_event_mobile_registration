#!/bin/bash

# Quick deploy script for GitHub Pages
# Usage: ./deploy.sh [message]

echo "🚀 Starting deployment to GitHub Pages..."

# Check if commit message is provided
if [ -z "$1" ]; then
    COMMIT_MSG="Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

echo "📝 Commit message: $COMMIT_MSG"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Adding and committing changes..."
    git add .
    git commit -m "$COMMIT_MSG"
else
    echo "✅ No changes to commit"
fi

# Build and deploy
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Deploying to GitHub Pages..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🌐 Application will be available at: https://$(git config user.name).github.io/church_event_mobile_registration/"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
