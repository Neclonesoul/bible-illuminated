#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Building Bible Illuminated public directory..."

rm -rf public
mkdir -p public

cp index.html public/
cp app.webmanifest public/
cp sw.js public/

cp -r assets public/
cp -r data public/

echo
echo "Bible Illuminated build complete."
echo "Files:"
find public -maxdepth 2 -type f | sort | head -n 40
