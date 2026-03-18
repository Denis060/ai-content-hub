#!/bin/bash

# AI Content Hub - Vercel Deployment Script
# This script helps you deploy to GitHub and Vercel

echo "================================"
echo "AI Content Hub - Deployment Helper"
echo "================================"
echo ""

# Step 1: Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

REPO_NAME="ai-content-hub"
GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📝 Repository will be created at:"
echo "   $GITHUB_URL"
echo ""

# Step 2: Verify git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Run this from the content-hub directory."
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Step 3: Show deployment steps
echo "================================"
echo "NEXT STEPS:"
echo "================================"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY"
echo "   - Visit: https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - Description: Multi-platform content automation"
echo "   - Choose: Public (easier) or Private (more secure)"
echo "   - Don't initialize with README"
echo "   - Click 'Create repository'"
echo ""
echo "2️⃣  PUSH TO GITHUB"
echo "   After creating the repo on GitHub, run these commands:"
echo ""
echo "   git branch -M main"
echo "   git remote add origin $GITHUB_URL"
echo "   git push -u origin main"
echo ""
echo "3️⃣  DEPLOY ON VERCEL"
echo "   - Visit: https://vercel.com"
echo "   - Sign in with GitHub"
echo "   - Click 'Add New' → 'Project'"
echo "   - Click 'Import Git Repository'"
echo "   - Paste: $GITHUB_URL"
echo "   - Click 'Import'"
echo "   - Add environment variables (leave empty for now)"
echo "   - Click 'Deploy'"
echo ""
echo "4️⃣  SETUP SUPABASE"
echo "   - Visit: https://supabase.com"
echo "   - Create new project"
echo "   - Get Project URL and Anon Key"
echo "   - Create database tables (SQL in DEPLOYMENT.md)"
echo ""
echo "5️⃣  UPDATE VERCEL"
echo "   - Add Supabase credentials to Vercel environment variables"
echo "   - Redeploy"
echo ""
echo "================================"
echo ""
echo "Ready? Let's go! 🚀"
