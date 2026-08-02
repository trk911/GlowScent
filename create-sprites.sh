#!/bin/bash

python3 -c "
from PIL import Image
import os

files = sorted([
    f for f in os.listdir('.')
    if f.lower().endswith('.webp')
])[:220]

if len(files) != 220:
    print('ERROR: Found', len(files), 'frames. Need exactly 220.')
    exit(1)

imgs = [
    Image.open(f).convert('RGBA')
    for f in files
]

frame_w, frame_h = imgs[0].size

cols = 11
rows = 20

sprite_w = frame_w * cols
sprite_h = frame_h * rows

out = Image.new(
    'RGBA',
    (sprite_w, sprite_h)
)

for i, img in enumerate(imgs):

    x = (i % cols) * frame_w
    y = (i // cols) * frame_h

    out.paste(img, (x, y))

os.makedirs('sprites', exist_ok=True)

out.save(
    'sprites/sprite01.webp',
    'WEBP',
    method=6,
    quality=90
)

print('================================')
print('DONE')
print('Frames:', len(files))
print('Frame size:', frame_w, 'x', frame_h)
print('Sprite size:', sprite_w, 'x', sprite_h)
print('Output: sprites/sprite01.webp')
print('================================')
"