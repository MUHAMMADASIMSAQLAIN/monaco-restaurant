import os
import math
import numpy as np
from PIL import Image, ImageFont, ImageDraw, ImageFilter

# Canvas: 16:9 Widescreen Showcase Banner (1920x1080 Full HD)
WIDTH = 1920
HEIGHT = 1080

# Colors
C_BG_DEEP = (6, 17, 10)         # Ultra-dark forest
C_BG_GRAD = (10, 33, 18)        # Monaco forest green
C_GOLD = (217, 182, 93)         # #D9B65D Champagne Gold
C_GOLD_BRIGHT = (245, 215, 135) # Bright gold
C_GOLD_GLOW = (217, 182, 93, 70)
C_CREAM = (255, 241, 217)       # #FFF1D9 Warm cream
C_WHITE = (255, 255, 255)
C_DARK_CARD = (11, 28, 16)      # Pill & card background
C_CYAN_GOLD = (220, 195, 120)

# Fonts
font_big_white = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 76)
font_big_gold = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 50)
font_sub = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 24)
font_pill = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 20)
font_tech = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 18)
font_footer = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 20)
font_icon = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 28)

DIR_5F = r'C:\Users\Muhammad Asim\.gemini\antigravity\brain\5f5aa39f-ddfd-43ed-aa4f-3c039160ec74\browser_sandbox\screenshots'
SHOT_DESKTOP = os.path.join(DIR_5F, 'step_62_shot_1.png')
SHOT_MOBILE = os.path.join(DIR_5F, 'step_101_shot_1.png')

def create_background():
    base = Image.new('RGB', (WIDTH, HEIGHT), C_BG_DEEP)
    draw = ImageDraw.Draw(base)
    
    # Smooth radial/linear dark green gradient
    for y in range(HEIGHT):
        alpha = y / HEIGHT
        r = int(C_BG_DEEP[0] * (1 - alpha*0.7) + C_BG_GRAD[0] * (alpha*0.7))
        g = int(C_BG_DEEP[1] * (1 - alpha*0.7) + C_BG_GRAD[1] * (alpha*0.7))
        b = int(C_BG_DEEP[2] * (1 - alpha*0.7) + C_BG_GRAD[2] * (alpha*0.7))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Ambient Gold Radial Glow behind the monitor area (x=1350, y=450)
    glow_overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_overlay)
    
    center_x, center_y = 1400, 420
    for rad in range(450, 50, -30):
        intensity = int(35 * (1 - rad / 450))
        glow_draw.ellipse(
            [center_x - rad, center_y - rad, center_x + rad, center_y + rad],
            fill=(217, 182, 93, intensity)
        )
        
    # Subtle digital tech dots grid in background
    np.random.seed(42)
    for _ in range(120):
        px = np.random.randint(40, WIDTH - 40)
        py = np.random.randint(40, HEIGHT - 100)
        glow_draw.ellipse([px, py, px+2, py+2], fill=(217, 182, 93, 40))
        
    glow_overlay = glow_overlay.filter(ImageFilter.GaussianBlur(12))
    base.paste(Image.alpha_composite(base.convert('RGBA'), glow_overlay), (0, 0))
    return base

def draw_pill(draw, x, y, w, h, text):
    """Draw glowing feature pill badge matching sample."""
    # Outer glow outline
    draw.rounded_rectangle([x-2, y-2, x+w+2, y+h+2], radius=h//2 + 2, outline=(C_GOLD[0]//2, C_GOLD[1]//2, C_GOLD[2]//2), width=1)
    # Main pill
    draw.rounded_rectangle([x, y, x+w, y+h], radius=h//2, fill=C_DARK_CARD, outline=C_GOLD, width=2)
    # Centered text
    tw = draw.textlength(text, font=font_pill)
    tx = x + (w - tw) / 2
    ty = y + (h - 26) / 2
    draw.text((tx, ty), text, fill=C_CREAM, font=font_pill)

def draw_left_content(canvas):
    draw = ImageDraw.Draw(canvas)
    
    # 1. Main Headline
    x_left = 90
    y_top = 130
    
    # Line 1: MONACO RESTAURANT
    draw.text((x_left, y_top), "MONACO RESTAURANT", fill=C_WHITE, font=font_big_white)
    
    # Line 2: FINE DINING & RESERVATION ENGINE
    draw.text((x_left, y_top + 95), "FINE DINING & RESERVATION ENGINE", fill=C_GOLD, font=font_big_gold)
    
    # Subtitle with bullets
    sub_text = "Autonomous Table Booking  •  Real-Time Zapier Automation"
    draw.text((x_left + 2, y_top + 175), sub_text, fill=C_CREAM, font=font_sub)
    
    # 2. Six Feature Badges (3 rows x 2 columns)
    pills = [
        ("Table Booking System", "Zapier Automation"),
        ("Google Sheets Sync", "Gmail Confirmations"),
        ("Conflict Reassignment", "Calendar Integration"),
    ]
    
    start_y = y_top + 260
    pill_w = 265
    pill_h = 56
    gap_x = 24
    gap_y = 20
    
    for row_idx, row in enumerate(pills):
        for col_idx, label in enumerate(row):
            px = x_left + col_idx * (pill_w + gap_x)
            py = start_y + row_idx * (pill_h + gap_y)
            draw_pill(draw, px, py, pill_w, pill_h, label)
            
    # 3. Tech Stack Bar at bottom left
    tech_y = start_y + 3 * (pill_h + gap_y) + 35
    bar_w = 2 * pill_w + gap_x
    bar_h = 56
    
    draw.rounded_rectangle([x_left, tech_y, x_left + bar_w, tech_y + bar_h], radius=14, fill=C_DARK_CARD, outline=(C_GOLD[0]//3, C_GOLD[1]//3, C_GOLD[2]//3), width=1)
    
    # Tech badges inside bar
    tech_str = "⚛ React 18  •  TS  •  Tailwind CSS  •  Vercel  •  ⚡ Zapier  •  Google Cloud"
    tw = draw.textlength(tech_str, font=font_tech)
    draw.text((x_left + (bar_w - tw)/2, tech_y + 16), tech_str, fill=C_GOLD_BRIGHT, font=font_tech)

def draw_monitor_mockup(canvas):
    """Render high-end studio monitor displaying desktop site."""
    draw = ImageDraw.Draw(canvas)
    
    # Monitor screen dimensions
    screen_w = 760
    screen_h = 428
    screen_x = 1040
    screen_y = 210
    bezel = 12
    
    # Outer Bezel
    bx1 = screen_x - bezel
    by1 = screen_y - bezel
    bx2 = screen_x + screen_w + bezel
    by2 = screen_y + screen_h + bezel
    
    # Monitor stand
    stand_w = 40
    stand_h = 160
    stand_x = screen_x + (screen_w - stand_w) // 2
    stand_y = by2
    
    # Metallic gradient stand
    for sx in range(stand_x, stand_x + stand_w):
        val = int(140 + 70 * math.sin((sx - stand_x)/stand_w * math.pi))
        draw.line([(sx, stand_y), (sx, stand_y + stand_h)], fill=(val, val, val))
        
    # Monitor base plate (oval with metallic reflection)
    base_w = 260
    base_h = 32
    base_x = screen_x + (screen_w - base_w) // 2
    base_y = stand_y + stand_h - 10
    draw.ellipse([base_x, base_y, base_x + base_w, base_y + base_h], fill=(160, 165, 170), outline=(210, 215, 220), width=2)
    draw.ellipse([base_x + 10, base_y + 4, base_x + base_w - 10, base_y + base_h - 6], fill=(100, 105, 110))
    
    # Monitor casing shadow
    draw.rounded_rectangle([bx1+10, by1+12, bx2+10, by2+12], radius=16, fill=(4, 10, 6))
    
    # Monitor outer chassis (Titanium dark finish with gold chamfered edge)
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=16, fill=(18, 22, 20), outline=C_GOLD, width=2)
    # Camera dot at top bezel
    draw.ellipse([(screen_x + screen_w//2 - 3, by1 + 4), (screen_x + screen_w//2 + 3, by1 + 10)], fill=(40, 45, 45))
    
    # Paste desktop screenshot inside screen
    if os.path.exists(SHOT_DESKTOP):
        with Image.open(SHOT_DESKTOP) as shot:
            shot_rgb = shot.convert('RGB')
            shot_scaled = shot_rgb.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
            canvas.paste(shot_scaled, (screen_x, screen_y))
            
    # Inner glass screen border
    draw.rectangle([screen_x, screen_y, screen_x + screen_w, screen_y + screen_h], outline=(C_GOLD[0]//2, C_GOLD[1]//2, C_GOLD[2]//2), width=1)

def draw_smartphone_mockup(canvas):
    """Render angled smartphone on bottom-right showing mobile reservation card."""
    draw = ImageDraw.Draw(canvas)
    
    phone_w = 240
    phone_h = 490
    phone_x = 1600
    phone_y = 380
    bezel = 8
    
    px1 = phone_x - bezel
    py1 = phone_y - bezel
    px2 = phone_x + phone_w + bezel
    py2 = phone_y + phone_h + bezel
    
    # Phone drop shadow
    draw.rounded_rectangle([px1+14, py1+14, px2+14, py2+14], radius=38, fill=(3, 8, 4))
    
    # Phone outer frame (Titanium Gold)
    draw.rounded_rectangle([px1, py1, px2, py2], radius=38, fill=(28, 32, 30), outline=C_GOLD, width=3)
    draw.rounded_rectangle([px1+2, py1+2, px2-2, py2-2], radius=36, outline=(40, 45, 42), width=2)
    
    # Screen
    if os.path.exists(SHOT_MOBILE):
        with Image.open(SHOT_MOBILE) as shot:
            shot_rgb = shot.convert('RGB')
            # Crop and resize nicely to phone proportions
            shot_scaled = shot_rgb.resize((phone_w, phone_h), Image.Resampling.LANCZOS)
            
            # Mask rounded corners
            mask = Image.new('L', (phone_w, phone_h), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.rounded_rectangle([0, 0, phone_w, phone_h], radius=30, fill=255)
            
            canvas.paste(shot_scaled, (phone_x, phone_y), mask)
            
    # Dynamic Island pill at top
    island_w = 64
    island_h = 16
    ix = phone_x + (phone_w - island_w) // 2
    iy = phone_y + 8
    draw.rounded_rectangle([ix, iy, ix + island_w, iy + island_h], radius=8, fill=(0, 0, 0))

def draw_floating_3d_decorations(canvas):
    """Draw 3D glowing Michelin Star & Luxury Cutlery above monitor (matching tooth in sample)."""
    draw = ImageDraw.Draw(canvas)
    
    # Floating Golden Star with 3D glow (x=1360, y=100)
    cx, cy = 1380, 110
    
    # Outer glow
    for r in range(50, 10, -8):
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(217, 182, 93, 30), width=2)
        
    # Big 3D Star
    star_txt = "★"
    f_star = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 72)
    tw = draw.textlength(star_txt, font=f_star)
    
    # 3D shadow offset
    draw.text((cx - tw/2 + 3, cy - 50 + 3), star_txt, fill=(120, 95, 35), font=f_star)
    draw.text((cx - tw/2, cy - 50), star_txt, fill=C_GOLD_BRIGHT, font=f_star)
    
    # Second small floating star
    c2x, c2y = 1750, 160
    star2_txt = "✦"
    f_star2 = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 44)
    draw.text((c2x, c2y), star2_txt, fill=C_GOLD, font=f_star2)
    
    # Third small floating diamond on left
    c3x, c3y = 1010, 140
    draw.text((c3x, c3y), "✦", fill=C_GOLD, font=f_star2)

def draw_footer_bar(canvas):
    """Draw bottom bar with live demo and GitHub repository links matching sample."""
    draw = ImageDraw.Draw(canvas)
    
    bar_y = HEIGHT - 80
    
    # Divider line with gradient center
    draw.line([(60, bar_y), (WIDTH - 60, bar_y)], fill=(C_GOLD[0]//2, C_GOLD[1]//2, C_GOLD[2]//2), width=1)
    
    # Globe icon + Live Demo
    demo_x = 90
    draw.text((demo_x, bar_y + 22), "🌐", font=font_footer, fill=C_GOLD)
    draw.text((demo_x + 32, bar_y + 24), "Live Demo:", fill=C_WHITE, font=font_footer)
    draw.text((demo_x + 155, bar_y + 24), "https://monaco-fine-dining.vercel.app", fill=C_GOLD_BRIGHT, font=font_footer)
    
    # GitHub icon + Repository
    git_x = 1000
    draw.text((git_x, bar_y + 22), "🐙", font=font_footer, fill=C_GOLD)
    draw.text((git_x + 32, bar_y + 24), "GitHub:", fill=C_WHITE, font=font_footer)
    draw.text((git_x + 125, bar_y + 24), "https://github.com/MUHAMMADASIMSAQLAIN/monaco-restaurant", fill=C_GOLD_BRIGHT, font=font_footer)

def main():
    print("Generating Monaco Restaurant Showcase Thumbnail Poster...")
    canvas = create_background()
    
    draw_left_content(canvas)
    draw_monitor_mockup(canvas)
    draw_smartphone_mockup(canvas)
    draw_floating_3d_decorations(canvas)
    draw_footer_bar(canvas)
    
    # Output paths
    desktop_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'monaco-showcase-poster.png')
    public_path = r'C:\Users\Muhammad Asim\.gemini\antigravity\scratch\monaco-restaurant\public\monaco-showcase-poster.png'
    artifact_path = r'C:\Users\Muhammad Asim\.gemini\antigravity\brain\c4f85d4f-1d18-45f5-aad5-0a69e797ecd0\monaco-showcase-poster.png'
    
    canvas.save(desktop_path, format='PNG', quality=95)
    canvas.save(public_path, format='PNG', quality=95)
    canvas.save(artifact_path, format='PNG', quality=95)
    
    print(f"Poster successfully generated and saved to:")
    print(f"1. Desktop: {desktop_path} ({os.path.getsize(desktop_path):,} bytes)")
    print(f"2. Public:  {public_path}")
    print(f"3. Artifact:{artifact_path}")

if __name__ == '__main__':
    main()
