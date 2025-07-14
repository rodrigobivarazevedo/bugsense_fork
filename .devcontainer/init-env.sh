#!/bin/bash
set -e

echo "🔧 Starting init script..."

REPO_NAME="bugsense_fork"
APP_DIR="/workspaces/$REPO_NAME/app/ai-api"
ENV_PATH="$APP_DIR/.env"

# Ensure app directory exists
mkdir -p "$APP_DIR"

# Clean old entry and append the exact value from env
echo "🌱 Updating .env at $ENV_PATH"
grep -v "^GOOGLE_CREDENTIALS=" "$ENV_PATH" 2>/dev/null > "${ENV_PATH}.tmp" || true
echo "GOOGLE_CREDENTIALS=$(printenv GOOGLE_CREDENTIALS)" >> "${ENV_PATH}.tmp"
mv "${ENV_PATH}.tmp" "$ENV_PATH"

echo "✅ .env updated with correct GOOGLE_CREDENTIALS"
