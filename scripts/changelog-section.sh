#!/bin/sh
set -eu

version="$1"
notes=$(awk -v version="$version" '$1 == "##" { found = ($2 == version); next } found' CHANGELOG.md)

if [ -z "$(printf '%s' "$notes" | tr -d '[:space:]')" ]; then
  echo "CHANGELOG.md has no notes under '## $version'" >&2
  exit 1
fi

printf '%s\n' "$notes"
