#!/bin/bash
set -e

echo "🔧 Starting init script..."

REPO_NAME="bugsense_fork"
APP_DIR="/workspaces/$REPO_NAME/app/ai-api"
ENV_PATH="$APP_DIR/.env"

mkdir -p "$APP_DIR"

# Get raw env var value
RAW_VAL=$(printenv GOOGLE_CREDENTIALS)

# Strip possible leading "GOOGLE_CREDENTIALS=" if present
if [[ "$RAW_VAL" == GOOGLE_CREDENTIALS=* ]]; then
  VALUE="${RAW_VAL#GOOGLE_CREDENTIALS=}"
else
  VALUE="$RAW_VAL"
fi

echo "🌱 Updating .env at $ENV_PATH"
grep -v "^GOOGLE_CREDENTIALS=" "$ENV_PATH" 2>/dev/null > "${ENV_PATH}.tmp" || true
echo "GOOGLE_CREDENTIALS=$VALUE" >> "${ENV_PATH}.tmp"
mv "${ENV_PATH}.tmp" "$ENV_PATH"

echo "✅ .env updated with correct GOOGLE_CREDENTIALS"
