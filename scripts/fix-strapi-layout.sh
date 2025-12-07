#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=${1:-$(pwd)}
TARGET_DIR="${ROOT_DIR%/}/strapi"
NESTED_DIR="${TARGET_DIR}/strapi"
TMP_DIR="${ROOT_DIR%/}/strapi_tmp_$(date +%s)"

GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RED="\033[31m"
RESET="\033[0m"

log() {
  local color=$1; shift
  printf "%b%s%b\n" "${color}" "$*" "${RESET}"
}

abort() {
  log "${RED}" "[x] $*"
  exit 1
}

stats() {
  log "${BLUE}" "[i] Current Strapi folder stats:"
  if [ -d "${TARGET_DIR}" ]; then
    if command -v du >/dev/null 2>&1; then
      local size
      size=$(du -sh "${TARGET_DIR}" 2>/dev/null | cut -f1)
      log "${GREEN}" "    • Size: ${size:-unknown}"
    fi
    local file_count dir_count
    file_count=$(find "${TARGET_DIR}" -type f | wc -l | tr -d ' ')
    dir_count=$(find "${TARGET_DIR}" -type d | wc -l | tr -d ' ')
    log "${GREEN}" "    • Files: ${file_count}"
    log "${GREEN}" "    • Directories: ${dir_count}"
    log "${GREEN}" "    • Top-level entries: $(ls -1 "${TARGET_DIR}" | wc -l | tr -d ' ')"
  else
    log "${YELLOW}" "    • Strapi folder not found after operation."
  fi
}

[ -d "${ROOT_DIR}" ] || abort "Root directory '${ROOT_DIR}' does not exist."
[ -d "${TARGET_DIR}" ] || abort "Strapi directory '${TARGET_DIR}' does not exist."

if [ ! -d "${NESTED_DIR}" ]; then
  log "${YELLOW}" "[!] No nested 'strapi/strapi' directory detected. Nothing to fix."
  stats
  exit 0
fi

log "${BLUE}" "[i] Flattening nested Strapi directory structure..."
log "${BLUE}" "    • Moving '${NESTED_DIR}' to temporary location '${TMP_DIR}'."
mv "${NESTED_DIR}" "${TMP_DIR}"

log "${BLUE}" "    • Removing old wrapper directory '${TARGET_DIR}'."
rm -rf "${TARGET_DIR}"

log "${BLUE}" "    • Renaming '${TMP_DIR}' back to '${TARGET_DIR}'."
mv "${TMP_DIR}" "${TARGET_DIR}"

log "${GREEN}" "[✓] Strapi directory flattened successfully: ${TARGET_DIR}"

stats
