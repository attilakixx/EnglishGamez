#!/bin/sh
set -eu

# Generate english_game/manifest.json from all image files in this folder.
# Run from anywhere with: sh english_game/generate-manifest.sh

cd "$(dirname "$0")"
out="manifest.json"

list=""
for name in *.jpg *.JPG *.jpeg *.JPEG *.png *.PNG; do
  [ -e "$name" ] || continue
  if [ -z "$list" ]; then
    list="$name"
  else
    list="$list
$name"
  fi
done

(
  printf '[\n'
  first=1
  printf '%s\n' "$list" | sort | while IFS= read -r name; do
    [ -n "$name" ] || continue
    if [ "$first" -eq 1 ]; then
      first=0
      printf '  \"%s\"' "$name"
    else
      printf ',\n  \"%s\"' "$name"
    fi
  done
  printf '\n]\n'
) > "$out"

echo "Wrote $(pwd)/$out"

