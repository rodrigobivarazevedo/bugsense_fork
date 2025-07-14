#!/bin/bash

# Define repo-specific paths
REPO_NAME="bugsense_fork"  # 🔁 Replace with your actual repo name if needed
ENV_PATH="/workspaces/$REPO_NAME/app/ai-api/.env"

# Ensure target directory exists
mkdir -p "$(dirname "$ENV_PATH")"

# Create or update the .env file with GOOGLE_APPLICATION_CREDENTIALS path
# Remove any previous line setting this variable
grep -v "^GOOGLE_CREDENTIALS=" "$ENV_PATH" 2>/dev/null > "${ENV_PATH}.tmp" || true
echo "GOOGLE_CREDENTIALS=$CREDENTIALS_PATH" >> "${ENV_PATH}.tmp"
mv "${ENV_PATH}.tmp" "$ENV_PATH"

echo "✅ Credentials written to: $CREDENTIALS_PATH"
echo "✅ .env updated at: $ENV_PATH"
