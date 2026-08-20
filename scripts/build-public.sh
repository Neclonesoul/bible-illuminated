#!/data/data/com.termux/files/usr/bin/bash
set -e

cd "$(dirname "$0")/.."

rm -rf public
mkdir -p public

cp index.html public/
cp app.webmanifest public/
cp sw.js public/

cp -r assets public/
cp -r data public/

echo "Bible Illuminated public/ build complete."
