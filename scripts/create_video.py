import os
import cv2
import numpy as np
from PIL import Image, ImageFont, ImageDraw, ImageFilter

# Output Dimensions: 9:16 Full HD
WIDTH = 1080
HEIGHT = 1920
FPS = 30

# Colors
C_FOREST = (10, 33, 18)         # #0A2112
C_FOREST_LIGHT = (16, 46, 24)   # #102E18
C_GOLD = (217, 182, 93)         # #D9B65D
C_GOLD_LIGHT = (233, 204, 130)  # #E9CC82
C_CREAM = (255, 241, 217)       # #FFF1D9
C_WHITE = (255, 255, 255)
C_DARK = (15, 25, 17)
C_CARD_BG = (14, 38, 22)
C_AMBER = (245, 158, 11)

# Fonts
font_title = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 44)
font_h1 = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', 38)
font_h2 = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 26)
font_body = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 22)
font_pill = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 18)
font_small = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 18)

# Paths to screenshots
DIR_5F = r'C:\Users\Muhammad Asim\.gemini\antigravity\brain\5f5aa39f-ddfd-43ed-aa4f-3c039160ec74\browser_sandbox\screenshots'
DIR_C2 = r'C:\Users\Muhammad Asim\.gemini\antigravity\brain\c2629100-c091-4bf5-9f9c-cfa1f2b9abc5\browser_sandbox\screenshots'

SCENES = [
    {
        'type': 'title_card',
        'duration_sec': 3.5,
        'badge': 'SYSTEM ARCHITECTURE SHOWCASE',
        'title': 'MONACO RESTAURANT',
        'subtitle': 'Autonomous Fine Dining & Reservation Engine',
        'desc': 'Full-Stack Architecture with Real-Time Zapier Automation,\nGoogle Cloud Database, and Intelligent Slot Management.',
        'pills': ['React 18', 'Vercel Serverless', 'Zapier Catch Hook', 'Google Sheets', 'Gmail API'],
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_5F, 'step_62_shot_1.png'),
        'duration_sec': 4.0,
        'badge': 'STEP 1 OF 6: LUXURY WEB EXPERIENCE',
        'title': 'Curved Hero & Monte Carlo Aesthetic',
        'subtitle': 'Michelin 3★ Pedigree • Fully responsive edge-to-edge UI',
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_5F, 'step_40_shot_5.png'),
        'duration_sec': 3.5,
        'badge': 'STEP 2 OF 6: CHEF MENU & CART',
        'title': 'Interactive Category Menu & Drawer',
        'subtitle': 'Persistent shopping cart with live 8% dining tax calculation',
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_5F, 'step_86_shot_1.png'),
        'duration_sec': 4.5,
        'badge': 'STEP 3 OF 6: CONFLICT RESOLUTION',
        'title': 'Intelligent Slot Conflict Concierge',
        'subtitle': 'Customer picked 19:00 (Full) • System offers next premier slot 19:30',
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_5F, 'step_101_shot_1.png'),
        'duration_sec': 4.5,
        'badge': 'STEP 4 OF 6: INSTANT CONFIRMATION',
        'title': 'Table Secured & Google Calendar Sync',
        'subtitle': 'Booking MON-20261127-J1FV • 1-Click "Add to Google Calendar"',
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_C2, 'step_122.png'),
        'duration_sec': 4.0,
        'badge': 'STEP 5 OF 6: ZAPIER WORKFLOW ENGINE',
        'title': 'Automated Webhook Catch Hook',
        'subtitle': 'Backend POST /api/reservations dispatches payload in 400ms',
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_C2, 'step_108.png'),
        'duration_sec': 4.0,
        'badge': 'STEP 6 OF 6: GOOGLE SHEETS LIVE SYNC',
        'title': 'Spreadsheet Row Created Instantly',
        'subtitle': 'Monaco Restaurant Reservations: 11 columns mapped live',
    },
    {
        'type': 'screenshot',
        'path': os.path.join(DIR_C2, 'step_137.png'),
        'duration_sec': 4.0,
        'badge': 'AUTOMATION: CUSTOMER EMAIL',
        'title': 'Branded Gmail Confirmation Delivered',
        'subtitle': 'Sent via Gmail API with booking details & venue directions',
    },
    {
        'type': 'outro_card',
        'duration_sec': 4.0,
        'badge': 'PROJECT COMPLETE & VERIFIED LIVE',
        'title': 'PRODUCTION READY',
        'subtitle': 'https://monaco-fine-dining.vercel.app',
        'desc': 'Repository: github.com/MUHAMMADASIMSAQLAIN/monaco-restaurant\nAutomated via Zapier • Engineered by Muhammad Asim Saqlain',
        'pills': ['#WebDev', '#React', '#Zapier', '#Automation', '#FullStack'],
    },
]

TOTAL_DURATION = sum(s['duration_sec'] for s in SCENES)
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)

def create_base_canvas():
    """Create luxury dark green gradient with ambient gold glows."""
    canvas = Image.new('RGB', (WIDTH, HEIGHT), C_FOREST)
    draw = ImageDraw.Draw(canvas)
    
    # Subtle vertical gradient
    for y in range(0, HEIGHT, 4):
        alpha = y / HEIGHT
        r = int(C_FOREST[0] * (1 - alpha*0.5) + C_FOREST_LIGHT[0] * (alpha*0.5))
        g = int(C_FOREST[1] * (1 - alpha*0.5) + C_FOREST_LIGHT[1] * (alpha*0.5))
        b = int(C_FOREST[2] * (1 - alpha*0.5) + C_FOREST_LIGHT[2] * (alpha*0.5))
        draw.rectangle([0, y, WIDTH, y+4], fill=(r, g, b))
    
    # Outer gold border line
    draw.rectangle([20, 20, WIDTH - 20, HEIGHT - 20], outline=(C_GOLD[0], C_GOLD[1], C_GOLD[2]), width=2)
    draw.rectangle([26, 26, WIDTH - 26, HEIGHT - 26], outline=(C_GOLD[0]//3, C_GOLD[1]//3, C_GOLD[2]//3), width=1)
    
    # Four corner gold diamonds
    for cx, cy in [(20, 20), (WIDTH-20, 20), (20, HEIGHT-20), (WIDTH-20, HEIGHT-20)]:
        draw.polygon([(cx, cy-6), (cx+6, cy), (cx, cy+6), (cx-6, cy)], fill=C_GOLD)
        
    return canvas

def render_top_header(draw):
    """Draw top luxury brand header."""
    # Logo text
    brand = "M O N A C O"
    w = draw.textlength(brand, font=font_title)
    draw.text(((WIDTH - w) / 2, 60), brand, fill=C_GOLD, font=font_title)
    
    sub = "R E S T A U R A N T   •   A U T O M A T I O N   E N G I N E"
    w_sub = draw.textlength(sub, font=font_pill)
    draw.text(((WIDTH - w_sub) / 2, 120), sub, fill=C_CREAM, font=font_pill)
    
    # Gold divider with center diamond
    draw.line([(140, 160), (WIDTH - 140, 160)], fill=(C_GOLD[0]//2, C_GOLD[1]//2, C_GOLD[2]//2), width=1)
    draw.polygon([(WIDTH//2, 155), (WIDTH//2 + 5, 160), (WIDTH//2, 165), (WIDTH//2 - 5, 160)], fill=C_GOLD)

def render_lower_third(draw, badge, title, subtitle):
    """Draw bottom information card for the scene."""
    box_top = 1600
    box_bottom = 1820
    
    # Glassy background card
    draw.rounded_rectangle([60, box_top, WIDTH - 60, box_bottom], radius=24, fill=C_CARD_BG, outline=C_GOLD, width=2)
    
    # Badge pill
    badge_w = draw.textlength(badge, font=font_pill) + 32
    draw.rounded_rectangle([85, box_top - 18, 85 + badge_w, box_top + 18], radius=18, fill=C_GOLD)
    draw.text((101, box_top - 10), badge, fill=C_FOREST, font=font_pill)
    
    # Title & Subtitle
    draw.text((85, box_top + 40), title, fill=C_CREAM, font=font_h1)
    draw.text((85, box_top + 105), subtitle, fill=(200, 215, 205), font=font_h2)

def render_progress_bar(draw, frame_idx, total_frames):
    """Draw video timeline progress bar at the very bottom."""
    progress = frame_idx / total_frames
    bar_y = HEIGHT - 38
    draw.line([(40, bar_y), (WIDTH - 40, bar_y)], fill=(30, 60, 40), width=4)
    current_x = 40 + int(progress * (WIDTH - 80))
    if current_x > 40:
        draw.line([(40, bar_y), (current_x, bar_y)], fill=C_GOLD, width=4)

def render_title_card(scene, progress):
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    render_top_header(draw)
    
    center_y = 700
    
    # Big Luxury Emblem Circle
    draw.ellipse([(WIDTH//2 - 140, center_y - 200), (WIDTH//2 + 140, center_y + 80)], outline=C_GOLD, width=3)
    draw.ellipse([(WIDTH//2 - 120, center_y - 180), (WIDTH//2 + 120, center_y + 60)], outline=(C_GOLD[0]//2, C_GOLD[1]//2, C_GOLD[2]//2), width=1)
    
    # Crown star
    star_txt = "3 ★"
    sw = draw.textlength(star_txt, font=font_title)
    draw.text(((WIDTH - sw)/2, center_y - 100), star_txt, fill=C_GOLD, font=font_title)
    
    # Title
    t1 = scene['title']
    t1_w = draw.textlength(t1, font=font_title)
    draw.text(((WIDTH - t1_w)/2, center_y + 130), t1, fill=C_CREAM, font=font_title)
    
    t2 = scene['subtitle']
    t2_w = draw.textlength(t2, font=font_h2)
    draw.text(((WIDTH - t2_w)/2, center_y + 200), t2, fill=C_GOLD_LIGHT, font=font_h2)
    
    # Description lines
    lines = scene['desc'].split('\n')
    for i, l in enumerate(lines):
        lw = draw.textlength(l, font=font_body)
        draw.text(((WIDTH - lw)/2, center_y + 280 + i*40), l, fill=(210, 225, 215), font=font_body)
        
    # Pills row
    pills = scene['pills']
    total_pw = sum(draw.textlength(p, font=font_pill) + 30 for p in pills) + (len(pills)-1)*15
    start_px = (WIDTH - total_pw) / 2
    cur_x = start_px
    for p in pills:
        pw = draw.textlength(p, font=font_pill) + 24
        draw.rounded_rectangle([cur_x, center_y + 400, cur_x + pw, center_y + 440], radius=20, fill=C_CARD_BG, outline=C_GOLD, width=1)
        draw.text((cur_x + 12, center_y + 410), p, fill=C_GOLD, font=font_pill)
        cur_x += pw + 15
        
    render_lower_third(draw, scene['badge'], "Autonomous Architecture", "From Web UI to Google Sheets, Gmail & Calendar in real time")
    return canvas

def render_outro_card(scene, progress):
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    render_top_header(draw)
    
    center_y = 660
    
    # Verification checkmark circle
    draw.ellipse([(WIDTH//2 - 100, center_y - 160), (WIDTH//2 + 100, center_y + 40)], fill=C_CARD_BG, outline=C_GOLD, width=3)
    check_sym = "✔"
    cw = draw.textlength(check_sym, font=font_title)
    draw.text(((WIDTH - cw)/2, center_y - 90), check_sym, fill=C_GOLD, font=font_title)
    
    t1 = scene['title']
    t1_w = draw.textlength(t1, font=font_title)
    draw.text(((WIDTH - t1_w)/2, center_y + 80), t1, fill=C_GOLD, font=font_title)
    
    url = "https://monaco-fine-dining.vercel.app"
    uw = draw.textlength(url, font=font_h2)
    draw.text(((WIDTH - uw)/2, center_y + 150), url, fill=C_CREAM, font=font_h2)
    
    # Box with stats & repo
    draw.rounded_rectangle([100, center_y + 220, WIDTH - 100, center_y + 420], radius=24, fill=C_CARD_BG, outline=(C_GOLD[0]//2, C_GOLD[1]//2, C_GOLD[2]//2), width=2)
    
    repo_line = "GitHub: MUHAMMADASIMSAQLAIN/monaco-restaurant"
    rw = draw.textlength(repo_line, font=font_body)
    draw.text(((WIDTH - rw)/2, center_y + 260), repo_line, fill=C_CREAM, font=font_body)
    
    eng_line = "Engineered & Verified with Google Antigravity"
    ew = draw.textlength(eng_line, font=font_h2)
    draw.text(((WIDTH - ew)/2, center_y + 315), eng_line, fill=C_GOLD_LIGHT, font=font_h2)
    
    credit_line = "Developer: Muhammad Asim Saqlain"
    crw = draw.textlength(credit_line, font=font_pill)
    draw.text(((WIDTH - crw)/2, center_y + 365), credit_line, fill=(180, 205, 190), font=font_pill)
    
    render_lower_third(draw, scene['badge'], "Ready for Deployment & Showcase", "Complete source code, CI/CD, and live Zapier integration")
    return canvas

def render_screenshot_scene(scene, progress):
    canvas = create_base_canvas()
    draw = ImageDraw.Draw(canvas)
    render_top_header(draw)
    
    # Load and scale screenshot
    shot_path = scene['path']
    if os.path.exists(shot_path):
        with Image.open(shot_path) as shot:
            shot = shot.convert('RGB')
            sw, sh = shot.size
            
            # Target frame size in the vertical 9:16 layout
            # We provide a framed card: width 920, height ~1320
            target_w = 920
            target_h = 1320
            
            # Scale screenshot to fit inside or crop appropriately
            aspect = sw / sh
            target_aspect = target_w / target_h
            
            if aspect > target_aspect:
                # Wider image (like desktop 1024x576): fit width, letterbox vertically in glass frame
                scale = target_w / sw
                new_w = target_w
                new_h = int(sh * scale)
                shot_resized = shot.resize((new_w, new_h), Image.Resampling.LANCZOS)
                paste_x = (WIDTH - new_w) // 2
                paste_y = 220 + (target_h - new_h) // 2
            else:
                # Taller mobile image: fit height
                scale = target_h / sh
                new_h = target_h
                new_w = int(sw * scale)
                if new_w > target_w:
                    new_w = target_w
                shot_resized = shot.resize((new_w, new_h), Image.Resampling.LANCZOS)
                paste_x = (WIDTH - new_w) // 2
                paste_y = 220
                
            # Outer frame / phone mockup casing
            frame_pad = 8
            fx1 = paste_x - frame_pad
            fy1 = paste_y - frame_pad
            fx2 = paste_x + shot_resized.width + frame_pad
            fy2 = paste_y + shot_resized.height + frame_pad
            
            # Floating shadow
            draw.rounded_rectangle([fx1+12, fy1+14, fx2+12, fy2+14], radius=24, fill=(5, 15, 8))
            # Gold frame
            draw.rounded_rectangle([fx1, fy1, fx2, fy2], radius=24, fill=C_CARD_BG, outline=C_GOLD, width=3)
            
            # Paste screenshot
            canvas.paste(shot_resized, (paste_x, paste_y))
            
    render_lower_third(draw, scene['badge'], scene['title'], scene['subtitle'])
    return canvas

def main():
    out_dir = r'C:\Users\Muhammad Asim\.gemini\antigravity\scratch\monaco-restaurant\public'
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'monaco-workflow-demo-9x16.mp4')
    
    artifact_dir = r'C:\Users\Muhammad Asim\.gemini\antigravity\brain\c4f85d4f-1d18-45f5-aad5-0a69e797ecd0'
    artifact_out_path = os.path.join(artifact_dir, 'monaco-workflow-demo-9x16.mp4')
    
    print(f"Target: {WIDTH}x{HEIGHT} at {FPS}fps, Total Duration: {TOTAL_DURATION}s ({TOTAL_FRAMES} frames)")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(out_path, fourcc, FPS, (WIDTH, HEIGHT))
    
    # Pre-render key scenes
    scene_frames = []
    print("Pre-rendering scene canvases...")
    for s_idx, s in enumerate(SCENES):
        if s['type'] == 'title_card':
            img = render_title_card(s, 0)
        elif s['type'] == 'outro_card':
            img = render_outro_card(s, 0)
        else:
            img = render_screenshot_scene(s, 0)
        scene_frames.append(img)
        print(f"  Scene {s_idx+1}/{len(SCENES)} rendered: {s['title']}")
        
    global_frame = 0
    fade_len = int(0.4 * FPS) # 12 frames crossfade
    
    print("Compositing video frames with timeline progress...")
    for s_idx, s in enumerate(SCENES):
        s_duration = s['duration_sec']
        s_num_frames = int(s_duration * FPS)
        cur_img = scene_frames[s_idx]
        next_img = scene_frames[(s_idx + 1) % len(scene_frames)]
        
        for f_idx in range(s_num_frames):
            # Check if in crossfade zone at end of scene
            if f_idx >= s_num_frames - fade_len and s_idx < len(SCENES) - 1:
                alpha = (f_idx - (s_num_frames - fade_len)) / fade_len
                # Blend images
                blended = Image.blend(cur_img, next_img, alpha)
                frame_draw = ImageDraw.Draw(blended)
                render_progress_bar(frame_draw, global_frame, TOTAL_FRAMES)
                cv_frame = cv2.cvtColor(np.array(blended), cv2.COLOR_RGB2BGR)
            else:
                frame_copy = cur_img.copy()
                frame_draw = ImageDraw.Draw(frame_copy)
                render_progress_bar(frame_draw, global_frame, TOTAL_FRAMES)
                cv_frame = cv2.cvtColor(np.array(frame_copy), cv2.COLOR_RGB2BGR)
                
            writer.write(cv_frame)
            global_frame += 1
            
            if global_frame % 90 == 0 or global_frame == TOTAL_FRAMES:
                pct = int((global_frame / TOTAL_FRAMES) * 100)
                print(f"  Progress: {global_frame}/{TOTAL_FRAMES} frames ({pct}%)")
                
    writer.release()
    print(f"Video created successfully at: {out_path}")
    
    # Also copy to artifact directory
    import shutil
    shutil.copyfile(out_path, artifact_out_path)
    print(f"Copied to artifact directory: {artifact_out_path}")
    print(f"Final file size: {os.path.getsize(out_path):,} bytes")

if __name__ == '__main__':
    main()
