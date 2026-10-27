#!/usr/bin/env bash
set -euo pipefail
source_mp4=docs/media/2026-09-12-p18/KDRUM_Nature_to_Digital_22s_web.mp4
out_dir=docs/media/2026-10-27-opening
new_mp4="$out_dir/KDRUM_OpeningTitle_v1.1_web.mp4"
poster="$out_dir/KDRUM_OpeningTitle_v1.1_poster.jpg"
mkdir -p "$out_dir"
if ! command -v ffmpeg >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg
fi
command -v ffmpeg
command -v ffprobe
ffmpeg -hide_banner -loglevel error -y -ss 20.5 -i "$source_mp4" -vf scale=1280:720 -frames:v 1 -q:v 3 "$poster"
ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 30 -t 1.8 -i "$poster" -i "$source_mp4" -filter_complex '[0:v]format=yuv420p,setsar=1,setpts=PTS-STARTPTS[opening];[1:v]trim=start=0.1,setpts=PTS-STARTPTS,fps=30,format=yuv420p,setsar=1[body];[opening][body]concat=n=2:v=1:a=0[v]' -map '[v]' -r 30 -c:v libx264 -crf 25 -preset medium -pix_fmt yuv420p -movflags +faststart -an "$new_mp4"
ffmpeg -hide_banner -loglevel error -y -i "$new_mp4" -frames:v 1 -vf 'signalstats,metadata=print:file=/tmp/kdrum_opening_frame_stats.txt' -f null -
python3 - <<'PY'
from pathlib import Path
import hashlib,json,re,subprocess
src=Path('docs/media/2026-09-12-p18/KDRUM_Nature_to_Digital_22s_web.mp4')
directory=Path('docs/media/2026-10-27-opening')
movie=directory/'KDRUM_OpeningTitle_v1.1_web.mp4'
poster=directory/'KDRUM_OpeningTitle_v1.1_poster.jpg'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
expected='14b8173bdd1126049ad624ce4c335de72590f691dc46aab170d22bffe68dd54f'
if sha(src)!=expected:raise SystemExit('Source video provenance mismatch')
def duration(p):
 r=subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(p)],text=True)
 return float(r)
d=duration(movie)
if not 23<=d<=25:raise SystemExit(f'Unexpected video length: {d}')
v=Path('/tmp/kdrum_opening_frame_stats.txt').read_text(errors='replace')
m=re.search(r'lavfi.signalstats.YAVG=([0-9.]+)',v)
if not m or float(m.group(1))<30:raise SystemExit('The opening frame is too dark')
assets={}
for typ,p,max_bytes in [('video',movie,20_000_000),('poster',poster,1_000_000)]:
 if not p.is_file() or p.stat().st_size>max_bytes:raise SystemExit(f'Invalid {typ} size')
 assets[typ]={'file':p.name,'size':p.stat().st_size,'sha256':sha(p)}
manifest={'version':'opening-title-v1.1','source':'2026-09-12-p18 web concept MP4','source_sha256':sha(src),'duration_seconds':round(d,3),'opening_seconds':1.8,'removed_black_seconds':0.1,'title_frame_source_seconds':20.5,'assets':assets}
(directory/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Verified opening media:',json.dumps(manifest,ensure_ascii=False))
PY
