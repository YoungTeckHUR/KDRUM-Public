#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import hashlib
import os
import zipfile
import qrcode
from qrcode.constants import ERROR_CORRECT_H
import qrcode.image.svg

URL = "https://youngteckhur.github.io/KDRUM-Public/"
OUT = Path("docs/assets/qr/official")
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#003D7C"
BLUE = "#0072BC"
TEAL = "#00A6A6"
TEXT = "#263238"
LIGHT = "#F5F9FC"
WHITE = "#FFFFFF"

FONT_REG_CANDIDATES = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
FONT_BOLD_CANDIDATES = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

def font(candidates, size):
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def qr_base(box_size=20):
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=box_size,
        border=4,
    )
    qr.add_data(URL)
    qr.make(fit=True)
    return qr

qr = qr_base()
qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

standalone = qr_img.resize((2400, 2400), Image.Resampling.NEAREST)
standalone.save(OUT / "KDRUM_QR_Standalone_2400.png", dpi=(300, 300))

qr_svg = qr_base(box_size=10)
svg_img = qr_svg.make_image(image_factory=qrcode.image.svg.SvgPathImage)
svg_img.save(OUT / "KDRUM_QR_Standalone_Vector.svg")

def rounded_card(size, radius=48, shadow=22):
    w, h = size
    base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow_layer)
    sd.rounded_rectangle((shadow, shadow, w-shadow, h-shadow), radius=radius, fill=(0,0,0,45))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(14))
    base.alpha_composite(shadow_layer)
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((12,12,w-32,h-32), radius=radius, fill=WHITE, outline=BLUE, width=5)
    return base

ppt = rounded_card((1800, 900))
d = ImageDraw.Draw(ppt)
d.rounded_rectangle((12, 12, 1780, 45), radius=18, fill=BLUE)
d.rounded_rectangle((1350, 12, 1780, 45), radius=18, fill=TEAL)
d.text((110, 120), "Explore K-DRUM", font=font(FONT_BOLD_CANDIDATES, 82), fill=NAVY)
d.text((110, 225), "Official public website", font=font(FONT_REG_CANDIDATES, 40), fill=TEXT)
d.text((110, 312), "Scan the QR code to access", font=font(FONT_REG_CANDIDATES, 29), fill=TEXT)
d.text((110, 355), "K-DRUM technical information.", font=font(FONT_REG_CANDIDATES, 29), fill=TEXT)
qr_card = qr_img.resize((560,560), Image.Resampling.NEAREST)
ppt.alpha_composite(qr_card.convert("RGBA"), (1120,150))
d.rounded_rectangle((100,610,1040,705), radius=32, fill=LIGHT)
d.text((135,635), "youngteckhur.github.io/KDRUM-Public/", font=font(FONT_REG_CANDIDATES,32), fill=NAVY)
d.text((110,755), "K-water Grid-based Distributed Rainfall rUnoff Model", font=font(FONT_REG_CANDIDATES,29), fill=TEXT)
ppt.save(OUT / "KDRUM_QR_PPT_Card_1800x900.png", dpi=(300,300))

pr = Image.new("RGB", (2480,1748), WHITE)
d = ImageDraw.Draw(pr)
d.rectangle((0,0,2480,150), fill=NAVY)
d.rectangle((1900,0,2480,150), fill=TEAL)
d.rounded_rectangle((90,225,2390,1658), radius=55, outline=BLUE, width=6, fill=WHITE)
d.text((180,325), "K-DRUM 공식 홈페이지", font=font(FONT_BOLD_CANDIDATES,110), fill=NAVY)
d.text((180,485), "분포형 강우-유출모형 K-DRUM 공개 기술정보", font=font(FONT_REG_CANDIDATES,54), fill=TEXT)
d.text((180,590), "QR 코드를 스캔하여 홈페이지로 이동하세요.", font=font(FONT_REG_CANDIDATES,42), fill=TEXT)
qr_print = qr_img.resize((820,820), Image.Resampling.NEAREST)
pr.paste(qr_print, (1430,520))
d.rounded_rectangle((180,790,1280,1065), radius=38, fill=LIGHT)
d.text((245,845), "Official Website", font=font(FONT_BOLD_CANDIDATES,44), fill=NAVY)
d.text((245,925), "youngteckhur.github.io/", font=font(FONT_REG_CANDIDATES,38), fill=TEXT)
d.text((245,975), "KDRUM-Public/", font=font(FONT_REG_CANDIDATES,38), fill=TEXT)
d.line((180,1215,1280,1215), fill=BLUE, width=5)
d.text((180,1270), "K-water Grid-based Distributed Rainfall rUnoff Model", font=font(FONT_REG_CANDIDATES,34), fill=TEXT)
d.text((180,1335), "Static QR · direct URL · high error correction", font=font(FONT_REG_CANDIDATES,30), fill=TEXT)
pr.save(OUT / "KDRUM_QR_Print_Report_2480x1748.png", dpi=(300,300))

readme = """# K-DRUM Official Website QR Assets

Reusable official QR assets for presentations, reports, posters, and external sharing.

**Encoded URL:** https://youngteckhur.github.io/KDRUM-Public/

## Files
- `KDRUM_QR_Standalone_2400.png` — standalone 2400×2400 PNG, 300 dpi
- `KDRUM_QR_Standalone_Vector.svg` — scalable vector QR
- `KDRUM_QR_PPT_Card_1800x900.png` — presentation card
- `KDRUM_QR_Print_Report_2480x1748.png` — report/print card
- `KDRUM_Official_QR_Set.zip` — all reusable QR assets

## Usage rule
The QR encodes the homepage URL directly and does not depend on a third-party dynamic QR or URL-shortening service.
The QR itself remains black on white for robust scanning; K-water-like colors are used only in the surrounding card design.
"""
(OUT / "README.md").write_text(readme, encoding="utf-8")

zip_path = OUT / "KDRUM_Official_QR_Set.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for p in sorted(OUT.iterdir()):
        if p.name in {zip_path.name, "SHA256SUMS.txt"}:
            continue
        zf.write(p, arcname=p.name)

lines = []
for p in sorted(OUT.iterdir()):
    if p.name == "SHA256SUMS.txt":
        continue
    lines.append(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}")
(OUT / "SHA256SUMS.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

print(f"Generated K-DRUM QR assets in {OUT}")
