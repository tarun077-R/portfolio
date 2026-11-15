import cv2
import numpy as np
from PIL import Image

# 1. Load image
img_path = r'C:\Users\tarun\.gemini\antigravity\brain\40802601-cf87-4d83-8809-aa9abdb135e3\.user_uploaded\media_1794742107519_c50c8d2f.jpg'
bgr = cv2.imread(img_path)
h, w = bgr.shape[:2]

# 2. HSV color segmentation for initial trimap
hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
H, S, V = hsv[:,:,0], hsv[:,:,1], hsv[:,:,2]

# Sky is blue: H in [90, 135], S > 40, V > 100
is_sky = (H >= 85) & (H <= 140) & (S >= 35) & (V >= 100)

# Build GrabCut mask: 0=BGD, 1=FGD, 2=PR_BGD, 3=PR_FGD
mask = np.zeros((h, w), dtype=np.uint8)

# Initialize with probable foreground for everything non-sky
mask[~is_sky] = cv2.GC_PR_FGD
mask[is_sky] = cv2.GC_BGD

# Definite foreground core: inner region of face & suit (away from boundaries)
# Erode non-sky to find definite core
kernel_core = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))
core_fg = cv2.erode((~is_sky).astype(np.uint8), kernel_core)
mask[core_fg == 1] = cv2.GC_FGD

# Definite background: erode sky to avoid touching hair edges
kernel_bg = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
sure_bg = cv2.erode(is_sky.astype(np.uint8), kernel_bg)
mask[sure_bg == 1] = cv2.GC_BGD

# Transition zone near hair/shoulders as probable background
transition = (is_sky & (sure_bg == 0))
mask[transition] = cv2.GC_PR_BGD

# Run GrabCut
bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

cv2.grabCut(bgr, mask, None, bgdModel, fgdModel, 6, cv2.GC_INIT_WITH_MASK)

# Extract binary / soft mask
grabcut_mask = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1.0, 0.0).astype(np.float32)

# Edge-preserving refinement of alpha mask
# Guided / bilateral filter
alpha = cv2.bilateralFilter(grabcut_mask, d=9, sigmaColor=75, sigmaSpace=75)
alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
alpha = np.clip(alpha, 0.0, 1.0)

# 3. Blue despill on edges to eliminate sky fringe
# Where alpha is soft edge (0.05 < alpha < 0.98), reduce blue channel if B > (R+G)/2
b_ch, g_ch, r_ch = bgr[:,:,0].astype(np.float32), bgr[:,:,1].astype(np.float32), bgr[:,:,2].astype(np.float32)
max_rg = (r_ch + g_ch) * 0.5
excess_blue = np.maximum(0, b_ch - max_rg)

# Despill weight increases near soft edge
despill_weight = np.clip((1.0 - alpha) * 2.0, 0.0, 1.0)
b_despilled = b_ch - excess_blue * despill_weight

bgr_clean = np.stack([b_despilled, g_ch, r_ch], axis=-1)
bgr_clean = np.clip(bgr_clean, 0, 255).astype(np.uint8)

# Convert to RGB
rgb_clean = cv2.cvtColor(bgr_clean, cv2.COLOR_BGR2RGB).astype(np.float32)

# 4. Color Grading: Studio Silver-Monochrome Key with Warmth
# Luminance calculation
lum = 0.299 * rgb_clean[:,:,0] + 0.587 * rgb_clean[:,:,1] + 0.114 * rgb_clean[:,:,2]
# Filmic S-curve on luminance
lum_norm = lum / 255.0
lum_curved = (lum_norm ** 1.15) * 255.0
mono = np.stack([lum_curved, lum_curved, lum_curved], axis=-1)

# Natural skin warmth: 60% color, 40% silver monochrome for realistic, premium look
graded_subject = rgb_clean * 0.65 + mono * 0.35

# High-end black blazer contrast: darken shadows gently
dark_mask = np.clip(1.0 - lum_norm * 2.0, 0.0, 1.0)[:,:,None]
graded_subject = graded_subject * (1.0 - dark_mask * 0.25)
graded_subject = np.clip(graded_subject, 0, 255)

# 5. Composition on 16:9 Canvas (2048 x 1152)
canvas_w, canvas_h = 2048, 1152
canvas = np.zeros((canvas_h, canvas_w, 3), dtype=np.float32)

# Target scale: height approx 980px so face is proportional and majestic
target_h = 980
scale = target_h / h
target_w = int(w * scale)

resized_subj = cv2.resize(graded_subject, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
resized_alpha = cv2.resize(alpha, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

# Smooth vertical fade at bottom 28% of subject so blazer fades into black shadows
y_indices = np.linspace(0, 1, target_h)[:, None]
fade_start = 0.70
bottom_fade = np.clip(1.0 - (y_indices - fade_start) / (1.0 - fade_start), 0.0, 1.0)
# Cosine smooth curve
bottom_fade = 0.5 * (1.0 - np.cos(bottom_fade * np.pi))
final_subj_alpha = resized_alpha * bottom_fade

# Position subject: centered horizontally around 60% of canvas width (x ~ 1228)
pos_x = int(canvas_w * 0.60 - target_w * 0.5)
pos_y = canvas_h - target_h  # Ground to bottom

# Background: Studio lighting gradient
xx, yy = np.meshgrid(np.arange(canvas_w), np.arange(canvas_h))

# Soft ambient charcoal spotlight behind him
spot_x = canvas_w * 0.62
spot_y = canvas_h * 0.45
spot_dist = np.sqrt(((xx - spot_x) / 500)**2 + ((yy - spot_y) / 400)**2)
spot_intensity = np.exp(-spot_dist**2) * 22.0  # Subtle dark charcoal (#161616)
canvas[:,:,0] += spot_intensity
canvas[:,:,1] += spot_intensity
canvas[:,:,2] += spot_intensity

# Burnt-orange studio rim light on the edge
# Accent color #ff630f (R=255, G=99, B=15)
edge_detect = cv2.Canny((final_subj_alpha * 255).astype(np.uint8), 50, 150)
edge_blur = cv2.GaussianBlur(edge_detect.astype(np.float32) / 255.0, (19, 19), 0)

# Apply subtle rim glow to right and top contour of subject
rim_light = np.zeros_like(resized_subj)
rim_light[:,:,0] = 255.0 * 0.45
rim_light[:,:,1] = 99.0 * 0.45
rim_light[:,:,2] = 15.0 * 0.45

# Add rim light onto subject edges
resized_subj_with_rim = resized_subj + rim_light * edge_blur[:,:,None]
resized_subj_with_rim = np.clip(resized_subj_with_rim, 0, 255)

# Place subject onto canvas
for c in range(3):
    canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w, c] = (
        canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w, c] * (1.0 - final_subj_alpha) +
        resized_subj_with_rim[:,:,c] * final_subj_alpha
    )

# Subtle warm atmospheric backlight on the right side
glow_dist = np.sqrt(((xx - canvas_w * 0.72) / 420)**2 + ((yy - canvas_h * 0.42) / 320)**2)
glow_intensity = np.exp(-glow_dist**2) * 14.0
canvas[:,:,0] += glow_intensity * 1.0
canvas[:,:,1] += glow_intensity * 0.388
canvas[:,:,2] += glow_intensity * 0.059

canvas = np.clip(canvas, 0, 255).astype(np.uint8)

# Save result
out_img = Image.fromarray(canvas)
out_img.save('public/images/hero-portrait.webp', quality=95)
out_img.save('public/images/hero-portrait.jpg', quality=95)
print('High-end studio composite of real photo created successfully!')

