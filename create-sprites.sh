#!/bin/bash

FRAME_W=1280
FRAME_H=720
COLS=5
ROWS=10

mkdir -p sprites

echo "🚀 Creating sprite sheets..."

# Sprite 01 — Frames 0001-0050
ffmpeg -i "frames/%04d.webp" \
-vf "select='between(n,0,49)',scale=${FRAME_W}:${FRAME_H},tile=${COLS}x${ROWS}" \
-frames:v 1 -c:v webp -q:v 80 \
"sprites/sprite01.webp"

# Sprite 02 — Frames 0051-0100
ffmpeg -i "frames/%04d.webp" \
-vf "select='between(n,50,99)',scale=${FRAME_W}:${FRAME_H},tile=${COLS}x${ROWS}" \
-frames:v 1 -c:v webp -q:v 80 \
"sprites/sprite02.webp"

# Sprite 03 — Frames 0101-0150
ffmpeg -i "frames/%04d.webp" \
-vf "select='between(n,100,149)',scale=${FRAME_W}:${FRAME_H},tile=${COLS}x${ROWS}" \
-frames:v 1 -c:v webp -q:v 80 \
"sprites/sprite03.webp"

# Sprite 04 — Frames 0151-0200
ffmpeg -i "frames/%04d.webp" \
-vf "select='between(n,150,199)',scale=${FRAME_W}:${FRAME_H},tile=${COLS}x${ROWS}" \
-frames:v 1 -c:v webp -q:v 80 \
"sprites/sprite04.webp"

# Sprite 05 — Frames 0201-0220
ffmpeg -i "frames/%04d.webp" \
-vf "select='between(n,200,219)',scale=${FRAME_W}:${FRAME_H},tile=${COLS}x4" \
-frames:v 1 -c:v webp -q:v 80 \
"sprites/sprite05.webp"

echo ""
echo "✅ DONE!"
echo ""

ls -lh sprites/