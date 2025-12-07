#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "🔍 Current branch:"
git status -sb

echo
while true; do
  read -rp "Have you run ./scripts/verify-production.sh ? (yes/no) " VERIFIED
  if [[ "$VERIFIED" =~ ^(yes|y)$ ]]; then
    break
  fi

  read -rp "Run it now before publishing? (yes/no) " RUN_VERIFY
  if [[ "$RUN_VERIFY" =~ ^(yes|y)$ ]]; then
    ./scripts/verify-production.sh
    echo
    continue
  else
    echo "[x] Publish aborted. Re-run after verifying production."
    exit 1
  fi
done

echo "📦 Staging all tracked/untracked files..."
git add -A
git status -sb

echo
read -rp "Commit message: " COMMIT_MSG
if [[ -z "${COMMIT_MSG// /}" ]]; then
  echo "[x] Commit message cannot be empty."
  exit 1
fi

git commit -m "$COMMIT_MSG"

echo "⬆️ Pushing to origin..."
git push

echo
read -rp "Open GitHub PR wizard now? (yes/no) " CREATE_PR
if [[ "$CREATE_PR" =~ ^(yes|y)$ ]]; then
  if command -v gh >/dev/null 2>&1; then
    gh pr create --fill
  else
    echo "[!] gh CLI not installed. Use GitHub web UI to open the PR."
  fi
else
  echo "Skipping PR creation. Use gh pr create later if needed."
fi

echo "✅ Publish finished."
