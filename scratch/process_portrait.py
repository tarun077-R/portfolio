import numpy as np
from PIL import Image, ImageFilter

# Load user's real outdoor portrait
img = Image.open('C:/Users/tarun/.gemini/antigravity/brain/40802601-cf87-4d83-8809-aa9abdb135e3/.user_uploaded/media_1794740870829_11e876bc.jpg').convert('RGBA')
w, h = img.size
arr = np.array(img, dtype=np.float32)

r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]

# Sky mask: sky has dominant blue
blue_ratio = b / (r + g + 1.0)
is_sky = (b > 120) & (b > r + 20) & (b > g) & (blue_ratio > 0.42)

# Smooth mask
mask = (~is_sky).astype(np.float32)
mask_img = Image.fromarray((mask * 255).astype(np.uint8))
mask_img = mask_img.filter(ImageFilter.GaussianBlur(1.5))

# Create canvas 2048 x 1152
canvas_w, canvas_h = 2048, 1152
canvas = np.zeros((canvas_h, canvas_w, 3), dtype=np.float32)

# Target scale and position for subject:
target_h = 1050
scale = target_h / h
target_w = int(w * scale)

resized_img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
resized_mask = mask_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Position: center face near 60% of canvas width (x ~ 1228)
pos_x = int(canvas_w * 0.60 - target_w * 0.5)
pos_y = canvas_h - target_h  # Align bottom

subj_arr = np.array(resized_img, dtype=np.float32)[:,:,:3]
subj_mask = np.array(resized_mask, dtype=np.float32) / 255.0

# Apply editorial monochrome / silver grading with warm tone
luminance = 0.299 * subj_arr[:,:,0] + 0.587 * subj_arr[:,:,1] + 0.114 * subj_arr[:,:,2]

# Editorial contrast curve
lum_norm = luminance / 255.0
lum_curved = np.power(lum_norm, 1.2) * 255.0

# Silver monochrome base
mono = np.stack([lum_curved, lum_curved, lum_curved], axis=-1)

# Blend subtle natural skin warmth (22% original color, 78% monochrome)
graded = mono * 0.78 + subj_arr * 0.22

# Edge detection on mask for rim glow using PIL blur
blur_low = np.array(resized_mask.filter(ImageFilter.GaussianBlur(3)), dtype=np.float32)
blur_high = np.array(resized_mask.filter(ImageFilter.GaussianBlur(8)), dtype=np.float32)
edge = np.maximum(0, blur_low - blur_high)
edge_norm = edge / (np.max(edge) + 1e-5)

# Mask vertical fade out at bottom
y_coords = np.linspace(0, 1, target_h)[:, None]
bottom_fade = np.clip(1.0 - (y_coords - 0.72) / 0.28, 0.0, 1.0)
final_alpha = subj_mask * bottom_fade

# Burnt-orange rim light (#ff630f is 255, 99, 15)
orange_rim = np.zeros_like(graded)
orange_rim[:,:,0] = 255
orange_rim[:,:,1] = 99
orange_rim[:,:,2] = 15

graded = graded + orange_rim * (edge_norm[:,:,None] * 0.40)
graded = np.clip(graded, 0, 255)

# Place onto canvas
for c in range(3):
    canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w, c] = (
        graded[:,:,c] * final_alpha
    )

# Subtle warm glow on background behind right side
xx, yy = np.meshgrid(np.arange(canvas_w), np.arange(canvas_h))
glow_dist = np.sqrt(((xx - canvas_w * 0.65) / 450)**2 + ((yy - canvas_h * 0.45) / 350)**2)
glow_val = np.exp(-glow_dist**2) * 16.0
canvas[:,:,0] += glow_val * 1.0
canvas[:,:,1] += glow_val * 0.38
canvas[:,:,2] += glow_val * 0.06

canvas = np.clip(canvas, 0, 255).astype(np.uint8)
out_img = Image.fromarray(canvas)
out_img.save('C:/Users/tarun/portfolio/public/images/real-portrait-editorial.webp', quality=95)
out_img.save('C:/Users/tarun/portfolio/public/images/real-portrait-editorial.jpg', quality=95)
print('Successfully generated real portrait editorial image!')
