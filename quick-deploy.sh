#!/bin/bash

# Quick deploy script - build and deploy only
echo "🚀 Quick deploy to GitHub Pages..."

# Build and deploy
npm run build && npm run deploy

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
else
    echo "❌ Deployment failed!"
fi
