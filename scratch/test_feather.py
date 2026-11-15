import cv2
import numpy as np
from PIL import Image

# Load original real photo
img_path = r'C:\Users\tarun\.gemini\antigravity\brain\40802601-cf87-4d83-8809-aa9abdb135e3\.user_uploaded\media_1794742107519_c50c8d2f.jpg'
bgr = cv2.imread(img_path)
h, w = bgr.shape[:2]
rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

# 1. Canvas 2048 x 1152 pure black
canvas_w, canvas_h = 2048, 1152
canvas = np.zeros((canvas_h, canvas_w, 3), dtype=np.float32)

# Scale real photo so it fits beautifully
target_h = 1000
scale = target_h / h
target_w = int(w * scale)
resized_real = cv2.resize(rgb, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)

# Create smooth feather / vignette mask for the real photo (NO JAGGED CUTOUT!)
# Keep center 100% solid, fade edges smoothly over 80px
yy, xx = np.meshgrid(np.arange(target_h), np.arange(target_w), indexing='ij')

# Distances from edges
dist_left = xx / 120.0
dist_right = (target_w - 1 - xx) / 120.0
dist_top = yy / 100.0
dist_bottom = (target_h - 1 - yy) / 140.0

edge_dist = np.minimum(np.minimum(dist_left, dist_right), np.minimum(dist_top, dist_bottom))
edge_dist = np.clip(edge_dist, 0.0, 1.0)
# Smooth cosine curve
mask_smooth = 0.5 * (1.0 - np.cos(edge_dist * np.pi))

# Position at 60% of canvas width
pos_x = int(canvas_w * 0.60 - target_w * 0.5)
pos_y = int(canvas_h * 0.48 - target_h * 0.5)

# Blend onto canvas
for c in range(3):
    canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w, c] = (
        resized_real[:,:,c] * mask_smooth
    )

canvas = np.clip(canvas, 0, 255).astype(np.uint8)
Image.fromarray(canvas).save('scratch/test_feather.jpg', quality=95)
print('Feathered real photo created!')
