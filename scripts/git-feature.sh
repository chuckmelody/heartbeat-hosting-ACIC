#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH_NAME=""
read -rp "Enter the feature branch name (without prefix): " INPUT_BRANCH
BRANCH_NAME="feature/${INPUT_BRANCH// /-}"

if [[ -z "${INPUT_BRANCH// /}" ]]; then
  echo "Branch name cannot be empty."
  exit 1
fi

echo "🚀 Preparing to create ${BRANCH_NAME}"

echo "📋 Current status:"
git status -sb

echo "🌍 Fetching latest main..."
git fetch origin main

echo "🧭 Switching to main..."
git checkout main
git pull origin main

if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
  echo "⚠️ Branch ${BRANCH_NAME} already exists locally. Checking it out."
  git checkout "$BRANCH_NAME"
else
  echo "🆕 Creating branch ${BRANCH_NAME}"
  git checkout -b "$BRANCH_NAME"
fi

echo "🧪 Placeholder test run (edit this block to run your real commands)"
echo "bash scripts/run-tests.sh (if you have it)"
echo ">>> (no tests defined; please replace this stub with \`npm run test\` / \`docker compose exec ...\` etc.)"

echo "🗂️ Stage changes? (yes/no)"
read -r STAGE_RESPONSE
if [[ "$STAGE_RESPONSE" =~ ^(yes|y)$ ]]; then
  git add -A
  git status -sb
else
  echo "Skipping git add. You can stage files manually."
fi

echo "📝 Commit message (leave blank to skip commit):"
read -r COMMIT_MESSAGE
if [[ -n "$COMMIT_MESSAGE" ]]; then
  git commit -m "$COMMIT_MESSAGE"
else
  echo "Skipping commit."
fi

echo "📤 Pushing ${BRANCH_NAME} to origin..."
git push --set-upstream origin "$BRANCH_NAME"

echo "✅ Feature branch push complete. Run \`gh pr create\` or open GitHub to make a PR."
