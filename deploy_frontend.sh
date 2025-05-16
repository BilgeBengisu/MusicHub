#!/bin/bash
# Frontend deployment script

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Install Netlify CLI if not installed
if ! command -v netlify &> /dev/null
then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "Frontend deployment completed!" 