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

# Android Trusted Web Activity verification
if [ -d .well-known ]; then
  mkdir -p public/.well-known
  cp -r .well-known/. public/.well-known/
fi

echo
echo "Bible Illuminated build complete."
echo "Files:"
find public -maxdepth 2 -type f | sort | head -n 40
