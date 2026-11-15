import cv2
import numpy as np
from PIL import Image

# Load original real photo
img_path = r'C:\Users\tarun\.gemini\antigravity\brain\40802601-cf87-4d83-8809-aa9abdb135e3\.user_uploaded\media_1794742107519_c50c8d2f.jpg'
bgr = cv2.imread(img_path)
h, w = bgr.shape[:2]
rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32)

# Canvas: 2048 x 1152 pure black
canvas_w, canvas_h = 2048, 1152
canvas = np.zeros((canvas_h, canvas_w, 3), dtype=np.float32)

# Scale: preserve 100% of the photo without any cropping or cutting
target_h = 1000
scale = target_h / h
target_w = int(w * scale)
resized = cv2.resize(rgb, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

# Color Grading: High-end editorial aesthetic
r, g, b = resized[:,:,0], resized[:,:,1], resized[:,:,2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
lum_norm = np.clip(lum / 255.0, 0.0, 1.0)
lum_curved = (lum_norm ** 1.15) * 255.0

mono = np.stack([lum_curved, lum_curved, lum_curved], axis=-1)

# Subtle silver-charcoal grading with authentic warm skin tone preserved
graded = resized * 0.70 + mono * 0.30

# Rich blacks on shadows
shadow_depth = np.clip(1.0 - lum_norm * 1.8, 0.0, 1.0)[:,:,None]
graded = graded * (1.0 - shadow_depth * 0.20)
graded = np.clip(graded, 0.0, 255.0)

# Ultra-smooth, seamless perimeter vignette (fade to #000000 on all 4 borders)
yy, xx = np.meshgrid(np.arange(target_h), np.arange(target_w), indexing='ij')

# Normalize coordinates from center: -1 to 1
nx = (xx - target_w * 0.5) / (target_w * 0.5)
ny = (yy - target_h * 0.5) / (target_h * 0.5)

dist_x = np.abs(nx)
dist_y = np.abs(ny)

fade_x = np.clip((1.0 - dist_x) / 0.35, 0.0, 1.0)
fade_y = np.clip((1.0 - dist_y) / 0.30, 0.0, 1.0)

# Smoothstep interpolation
fade_x = fade_x * fade_x * (3.0 - 2.0 * fade_x)
fade_y = fade_y * fade_y * (3.0 - 2.0 * fade_y)

vignette = fade_x * fade_y

# Position photo at 60% of canvas width (centered on face/body)
pos_x = int(canvas_w * 0.60 - target_w * 0.5)
pos_y = int(canvas_h * 0.50 - target_h * 0.5)

# Blend onto canvas
for c in range(3):
    canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w, c] = (
        graded[:,:,c] * vignette
    )

canvas = np.clip(canvas, 0, 255).astype(np.uint8)

# Save high-quality images
out_img = Image.fromarray(canvas)
out_img.save('public/images/hero-portrait.webp', quality=95)
out_img.save('public/images/hero-portrait.jpg', quality=95)
print('Clean authentic real portrait saved!')
