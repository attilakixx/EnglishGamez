#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

{
  printf 'window.DORI_QUIZ_FILES = '
  find . -mindepth 2 -maxdepth 2 -type f \
    \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) \
    -printf '%P\n' \
    | sort \
    | jq -R . \
    | jq -s .
  printf ';\n'
} > manifest.js

echo "Wrote $(pwd)/manifest.js"
