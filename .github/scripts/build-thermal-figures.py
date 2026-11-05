"""Reproduce the public thermal figures from documented endpoint values, not time series."""
from pathlib import Path
import json,html
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
root=Path(__file__).resolve().parents[2]
out=root/'docs/assets/diagrams/thermal';out.mkdir(parents=True,exist_ok=True)
# Optional local Korean font. SVG text stays editable and uses Korean system fonts in browsers.
import os
font_path=os.environ.get('THERMAL_FONT_PATH')
if font_path:
 font_manager.fontManager.addfont(font_path)
 plt.rcParams['font.family']=font_manager.FontProperties(fname=font_path).get_name()
plt.rcParams.update({'svg.fonttype':'none','svg.hashsalt':'kdrum-thermal-20261105','font.size':16,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.labelcolor':'#243c50','text.color':'#143a53','axes.edgecolor':'#c7d8e1','xtick.color':'#243c50','ytick.color':'#486171'})
data={'reviewed':'2026-11-05','trial_period':'2020-07-29 00:00–12:00','metric':'warm minus baseline at 12 h, deg C','forcing':'post-initial air temperature and dewpoint +15 deg C; first record retained','soil_cell_output_position_1based':60,'soil':{'A':5.6757965,'B':1.3896446,'C':0.2219543,'D':0.000816345},'river_cell_output_position_1based':49434,'river_cell':0.4426861,'river_mean_548_wet_cells':2.9064604,'source':'THERMAL_VALIDATION.md; recorded Seomjin trials; no observed-temperature accuracy claim'}
(out/'endpoint-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
for lang in ['ko','en']:
 ko=lang=='ko';L=lambda k,e:k if ko else e
 for name in ['soil-response','river-response']:
  fig,ax=plt.subplots(figsize=(12,7.2),dpi=100);fig.patch.set_facecolor('white')
  fig.subplots_adjust(left=.13,right=.94,bottom=.25,top=.71)
  soil=name=='soil-response'
  vals=list(data['soil'].values()) if soil else [data['river_cell'],data['river_mean_548_wet_cells']]
  labs=['A','B','C','D'] if soil else [L('한 하천격자','One river cell'),L('548개 하천격자 평균','Mean of 548 river cells')]
  bars=ax.bar(labs,vals,color=['#0077a5','#168d9b','#48a7a6','#a5c5c1'] if soil else ['#0077a5','#279a8d'],width=.56,zorder=3)
  ymax=6.6 if soil else 3.5;ax.set_ylim(0,ymax);ax.set_yticks([0,2,4,6] if soil else [0,1,2,3]);ax.grid(axis='y',color='#e3ebf0',zorder=0)
  ax.tick_params(axis='both',length=0,pad=12);ax.set_ylabel(L('온도 차이 [°C]','Temperature difference [°C]'),labelpad=16)
  for b,v in zip(bars,vals):ax.text(b.get_x()+b.get_width()/2,v+ymax*.035,'+'+(f'{v:.4f}' if v<.001 else f'{v:.3f}'),ha='center',va='bottom',fontsize=18,fontweight='bold')
  fig.text(.08,.92,L('기온 상승에 대한 토양층별 반응','Soil-layer response to warmer air') if soil else L('기온 상승에 대한 하천수온 반응','River-temperature response to warmer air'),fontsize=25,weight='bold')
  fig.text(.08,.85,L('섬진강 · 12시간 말 · 고온 조건 − 기준 조건','Seomjin · endpoint at 12 h · warm − baseline'),fontsize=17,color='#486171')
  fig.text(.08,.17,L('본모의 기온·이슬점 +15°C · 첫 기상기록 유지','Production air temperature and dewpoint +15°C; first record retained'),fontsize=14)
  fig.text(.08,.115,L('동일 토양격자 · 층마다 깊이·열적 반응이 다름','One fixed soil cell · layers have different depths and thermal responses') if soil else L('한 격자와 공간 산술평균의 비교 · 서로 다른 공간 통계','Point response versus spatial arithmetic mean · different spatial statistics'),fontsize=14,color='#486171')
  fig.text(.08,.06,L('실제 모의값 · 관측 정확도 평가가 아닌 민감도 시험','Actual simulated values · sensitivity trial, not observed-accuracy validation'),fontsize=13,color='#486171')
  fig.savefig(out/(name+'-'+lang+'.svg'),metadata={'Date':None,'Creator':'K-DRUM public thermal figures'})
  if os.environ.get('THERMAL_PREVIEW_DIR'):
   preview=Path(os.environ['THERMAL_PREVIEW_DIR']);preview.mkdir(parents=True,exist_ok=True)
   fig.savefig(preview/(name+'-'+lang+'.png'),dpi=120)
  plt.close(fig)
 # Exact process topology rendered in SVG, keeping labels editable.
 parts=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img"><title>'+L('토양온도와 하천수온의 연결','Linking soil and river temperature')+'</title><defs><marker id="arr" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#168c9b"/></marker></defs><rect width="1200" height="720" rx="18" fill="#fff"/>']
 def txt(x,y,s,size=22,color='#143a53',weight=500,anchor='start'):
  parts.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" font-family="Noto Sans KR,Malgun Gothic,Arial,sans-serif">{html.escape(s)}</text>')
 def rect(x,y,w,h,fill):parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}"/>')
 def arrow(x1,y1,x2,y2,both=False):parts.append(f'<path d="M{x1} {y1}L{x2} {y2}" stroke="#168c9b" stroke-width="3" fill="none" marker-end="url(#arr)"'+(' marker-start="url(#arr)"' if both else '')+'/>')
 txt(56,70,L('토양에서 하천까지, 물과 함께 이동하는 열','Heat moves with water, from soil to river'),32,weight=700)
 txt(56,108,L('대기·적설·토양·하천의 열교환 연결 · 개념도','Atmosphere, snow, soil and river heat exchange · concept diagram'),20,color='#486171')
 rect(56,146,1088,76,'#eef6fb');txt(600,193,L('대기 기온','Atmospheric temperature'),27,weight=700,anchor='middle')
 rect(56,280,500,64,'#edf6fa');txt(84,322,L('적설 · 토양의 냉각·가열을 완충','Snow · insulates the soil'),23)
 for i,(a,c,k,e) in enumerate([('A','#d9e8d8','표층 반응','Upper-layer response'),('B','#d9dfc6','층간 열전도','Interlayer conduction'),('C','#e6d5b7','수분 의존 열물성','Moisture-dependent properties'),('D','#c9bfae','심부의 지연 반응','Delayed deep-layer response')]):
  y=362+i*62;rect(56,y,500,54,c);txt(82,y+36,a,25,weight=700);txt(138,y+35,L(k,e),21)
 arrow(306,230,306,274,True);txt(345,259,L('열전도','Conduction'),18)
 arrow(520,392,520,566,True)
 rect(744,340,400,210,'#edf8fa');txt(944,385,L('1D 하천수온','1D river temperature'),27,weight=700,anchor='middle')
 parts.append('<path d="M774 425 Q845 413 914 425 T1114 425 V475 Q1025 488 944 477 T774 478Z" fill="#78bfdc"/>')
 txt(944,518,L('하천 흐름을 따른 열수송','Heat transport with river flow'),21,anchor='middle')
 arrow(944,230,944,329,True);txt(980,274,L('대기 열교환','Air–water'),18);txt(980,301,L('선형 교환','heat exchange'),18)
 arrow(570,451,730,451);txt(651,399,L('물의 이동','Water flow'),20,anchor='middle');txt(651,426,L('현열 전달','Sensible heat'),20,anchor='middle')
 txt(651,488,L('융설·유출·토양수','Melt / runoff'),16,anchor='middle');txt(651,513,L('하천 유입','soil-water input'),16,anchor='middle')
 rect(56,632,1088,52,'#f3f7fa');txt(600,665,L('초기 온도 생성·저장·재사용 → 토양 4개 층·하천수온 NetCDF','Generate, save and reuse initial temperatures → four soil layers + river NetCDF'),21,anchor='middle')
 parts.append('</svg>');(out/('thermal-process-'+lang+'.svg')).write_text(''.join(parts))
