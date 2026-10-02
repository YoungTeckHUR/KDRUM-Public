/* Bilingual, deterministic process schematics. No measured or simulated values. */
const fs=require('node:fs'),path=require('node:path');
const directory='assets/diagrams/feature-reference-wave2-2026-09-19/';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(x,y,value,size=26,weight=400,anchor='start',color='#173d59')=>`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${color}">${esc(value)}</text>`;
const rect=(x,y,w,h,fill='#f1f7fb',stroke='#aac7d7',radius=16)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const line=(x1,y1,x2,y2,color='#247eaa',arrow=false,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3"${arrow?' marker-end="url(#arrow)"':''}${dash?` stroke-dasharray="${dash}"`:''}/>`;
const route=(d,arrow=true)=>`<path d="${d}" fill="none" stroke="#247eaa" stroke-width="3"${arrow?' marker-end="url(#arrow)"':''}/>`;
function box(x,y,w,h,title,lines=[],fill='#f1f7fb'){
 const english=!/[가-힣]/.test(title);
 return rect(x,y,w,h,fill)+text(x+24,y+46,title,english?24:28,700)+lines.map((s,i)=>text(x+24,y+91+i*38,s,english?22:24)).join('');
}
function frame(name,lang,title,subtitle,body){
 const note=lang==='ko'?'개념도 · 실제 계산값 또는 프로그램 화면이 아닙니다.':'Concept schematic · not calculated values or a software screenshot.';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(subtitle+' '+note)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#247eaa"/></marker><pattern id="missing" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M-3 3 3-3 M0 12 12 0 M9 15 15 9" stroke="#b2bdc5" stroke-width="2"/></pattern></defs>
<rect width="1200" height="720" fill="#fff"/><g font-family="Noto Sans CJK KR,Noto Sans KR,Malgun Gothic,Arial,sans-serif">
${text(60,43,'VISUAL CONCEPT',18,600,'start','#607f94')}${text(60,97,title,40,700)}${text(60,142,subtitle,23,400,'start','#526d7e')}
${body}
${line(60,663,1140,663,'#d7e4ec')}${text(60,697,note,19,400,'start','#607789')}
</g></svg>\n`;
}
function diagram(name,lang){
 const L=(ko,en)=>lang==='ko'?ko:en;
 if(name==='snow-process')return frame(name,lang,L('적설 저장량과 융설계수 보정','Snow storage and melt-factor adjustment'),L('강수 분리와 경험적 보정을 거쳐 융설수를 수문 계산에 전달합니다.','Partition precipitation and adjust melt empirically before hydrologic routing.'),
  box(60,192,330,153,L('기상 입력','Meteorological inputs'),[L('강수 · 기온 · 풍속','Precipitation · temp · wind'),L('표고에 따른 기온보정','Elevation-adjusted temp')])+
  box(435,192,330,153,L('강우·강설 구분','Rain / snow partition'),[L('기온 기준으로 분리','Temperature-based split'),L('강설은 적설에 누적','Snowfall adds to storage')])+
  box(810,192,330,153,L('융설계수 보정','Melt adjustment'),[L('계절 · 경사 · D8 흐름방향','Season · slope · D8'),L('시간대의 경험적 보정','Empirical time adjustment')])+
  line(395,262,427,262,undefined,true)+route('M600 353V399')+route('M460 353V382H225V401')+text(274,373,L('강우','Rain'),20)+route('M975 353V435H776')+
  box(435,412,330,155,L('적설 저장량 · 융설','Snow storage / melt'),[L('남은 적설량 갱신','Update remaining snow'),L('융설수 산정','Calculate meltwater')],'#ecf6f3')+
  box(60,412,330,155,L('수문 입력','Hydrologic input'),[L('강우 + 융설수','Rain + meltwater'),L('침투 · 유출 계산으로','To infiltration and runoff')])+
  route('M435 492H401')+text(810,515,L('직접 일사·적설 이동','Radiation / snow transport'),22,600)+text(810,547,L('해석과 구분','are not directly solved'),22)+
  text(600,623,L('경사·방향은 융설계수에 반영되며, 그림은 계산 결과가 아닙니다.','Slope and direction modify melt factors; no simulation result is shown.'),24,400,'middle'));
 if(name==='deep-storage-path'){
  let body=rect(60,195,500,400,'#f8fbfc','#aac7d7',14)+text(86,235,L('단위격자 다층 저장구조','Multi-layer unit-cell storage'),28,700);
  const layers=[[L('A층','A layer'),270,58,'#f1e2c8'],[L('B층','B layer'),328,58,'#e8d4b1'],[L('C층','C layer'),386,70,'#dcc39b'],[L('D층 저장','D-layer storage'),456,105,'#c7e3df']];
  layers.forEach(([label,y,h,color])=>{body+=rect(95,y,300,h,color,'#c7b18e',0)+text(118,y+37,label,label.includes('D')?24:25,700);});
  body+=route('M250 316V329')+route('M250 374V387')+route('M250 444V457');
  body+=text(278,303,L('침루','Percolation'),18,600,'start','#486171');
  body+=rect(455,310,70,145,'#dceef8','#8bbbd0',8)+text(490,388,L('하천','River'),20,700,'middle');
  body+=line(395,299,452,330,'#247eaa',true)+line(395,357,452,366,'#247eaa',true)+line(395,421,452,405,'#247eaa',true);
  body+=route('M370 520H425V430H390')+text(245,535,L('지연 복귀','Delayed return'),18,700,'start','#11695d');
  body+=`<path d="M250 561V584" fill="none" stroke="#a36a2c" stroke-width="3" stroke-dasharray="7 6" marker-end="url(#arrow)"/>`+text(278,580,L('선택적 심부 손실','Optional deep loss'),18,600,'start','#75470f');
  body+=rect(615,205,525,120,'#e9f5ef','#83b9ae',12)+text(642,243,L('D층은 기존 구성','D layer is an existing component'),27,700)+text(642,278,L('다층 유출구조의 지하수 저장층','Groundwater storage in the multilayer structure'),19)+text(642,307,L('신규 층이 아님','Not a newly added layer'),18,600,'start','#486171');
  body+=rect(615,350,525,145,'#f5f9fb','#aac7d7',12)+text(642,390,L('상부 토양층 경로','Upper soil-layer path'),26,700)+text(642,420,L('지연 복귀와 유출 연결','Delayed return and runoff linkage'),18,600,'start','#486171')+text(642,449,L('D층 저장량을 갱신하고 상부 유출경로와 연결','Update D storage and connect it to the upper runoff path'),19)+text(642,477,L('저장·복귀·손실은 물수지에서 구분','Separate storage, return and loss in the water balance'),19);
  body+=rect(615,510,525,85,'#fff6e7','#e6bf7d',12)+text(642,548,L('완전한 지하수유동모형과 구분','Distinct from a full groundwater-flow model'),22,700,'start','#75470f')+text(642,577,L('기능별 활성조건과 적용범위를 별도 확인','Check feature-specific activation and scope'),18,500,'start','#75470f');
  body+=text(600,640,L('D층 자체와 장기유출 개선 기능을 구분해서 해석','Distinguish the existing D layer from long-term runoff extensions'),22,500,'middle');
  return frame(name,lang,L('A/B/C/D층과 D층의 수문학적 역할','A/B/C/D layers and the hydrologic role of D'),L('기존 다층 구조에서 D층 저장, 지연 복귀와 선택적 손실을 구분합니다.','Within the existing multilayer structure, distinguish D-layer storage, delayed return and optional loss.'),body);
 }
 if(name==='input-readiness')return frame(name,lang,L('입력자료와 실행 준비 점검','Input data and execution readiness'),L('입력 조건을 확인하고 문제 항목을 실행 전에 정리합니다.','Review input conditions and identify issues before a model run.'),
  box(60,218,310,236,L('원자료','Source data'),[L('지형 · 강우 · 하천','Terrain · rain · rivers'),L('좌표 · 시간 · 단위','Coordinates · units')])+line(380,330,425,330,undefined,true)+
  box(440,218,310,236,L('정합성 검사','Consistency checks'),[L('공간 · 시간 범위','Space · time extent'),L('연결성 · 값의 범위','Connectivity · ranges')])+line(760,330,805,330,undefined,true)+
  box(820,218,320,236,L('점검 결과','Check results'),[L('문제 항목과 경고','Issues and warnings'),L('실행 준비 상태','Readiness for execution')],'#ecf6f3')+
  text(600,560,L('점검 범위와 개발 상태는 각 기능 설명에 따릅니다.','Check scope and availability follow each capability description.'),25,500,'middle'));
 if(name==='rainfall-coverage'){
  let body=box(350,194,500,106,L('강우자료의 시간 구간','Time intervals in rainfall inputs'));
  body+=route('M600 301V326H225V352')+route('M600 301V352')+route('M600 326H975V352');
  const items=[[L('관측','Observed'),L('관측자료가 있는 기간','Observed intervals'),'#e2f1fa'],[L('예측','Forecast'),L('예측자료가 있는 기간','Forecast intervals'),'#e7f3ed'],[L('결측','Missing'),L('입력자료가 없는 기간','Intervals without inputs'),'url(#missing)']];
  items.forEach(([title,desc,color],i)=>{const x=60+i*375;body+=box(x,370,330,134,title,[desc],color);});
  body+=route('M225 506V537H600',false)+route('M600 506V565')+route('M975 506V537H600',false);
  body+=text(600,609,L('유형별 시간수 집계 → 실행 결과요약','Hours by category → execution report'),29,700,'middle');
  return frame(name,lang,L('강우자료 완전성 점검','Rainfall input completeness'),L('관측·예측·결측의 구성과 누락 상태를 요약합니다.','Summarize observed, forecast and missing periods.'),body);
 }
 if(name==='initial-state-warmup')return frame(name,lang,L('워밍업과 초기상태 조정','Warm-up and initial-state adjustment'),L('초기상태 반복 조정과 목표지점 오차 진단의 관계입니다.','Initial-state adjustment is evaluated against the target discharge.'),
  box(60,220,295,162,L('초기상태','Initial states'),[L('토양 · 유출 상태','Soil and runoff states')])+
  box(60,425,295,136,L('목표지점 유량','Target discharge'))+line(368,300,425,300,undefined,true)+route('M355 485H399V370H430')+
  box(440,220,300,210,L('워밍업 계산','Warm-up runs'),[L('이전 상태로 계산','Run from current states'),L('초기상태 조정','Adjust initial states')])+
  line(753,300,805,300,undefined,true)+box(820,220,320,210,L('진단과 평가','Diagnostic review'),[L('목표유량 오차','Target-flow discrepancy'),L('상태 안정화 · 수렴','Stability · convergence')],'#ecf6f3')+
  route('M980 443V546H590V443')+text(820,592,L('평가에 따른 반복 조정','Repeat adjustment after review'),26,500,'middle'));
 if(name==='watershed-water-balance')return frame(name,lang,L('유역 물수지와 폐합오차','Watershed water balance'),L('같은 공간·시간 범위의 유입, 유출과 저장량 변화를 집계합니다.','Use the same spatial and temporal boundaries for all terms.'),
  rect(395,241,410,240,'#edf7f4','#50a69b')+text(600,291,L('평가 대상 유역','Watershed boundary'),28,700,'middle')+
  text(600,354,L('저장량 변화','Change in storage'),29,700,'middle')+text(600,402,'ΔS',38,600,'middle')+
  text(62,271,L('강우 · 외부 유입','Rainfall · external inflow'),25,600)+line(85,324,380,324,undefined,true)+
  text(860,394,L('유출','Outflow'),27,600)+line(820,352,1120,352,undefined,true)+
  line(680,230,680,185,undefined,true)+text(720,203,L('증발산','Evapotranspiration'),25,600)+
  text(600,550,L('폐합오차 = 유입 − 유출 − 저장량 변화','Closure residual = inputs − outputs − storage change'),29,700,'middle')+
  text(600,603,L('내부 이동은 유역 경계 통과량과 구분하여 추적합니다.','Track internal transfers separately from boundary fluxes.'),24,400,'middle'));
 if(name==='calibration-evaluation')return frame(name,lang,L('목표지점 보정과 매개변수 조합 평가','Target-site calibration and evaluation'),L('관측과 여러 매개변수 조합의 결과를 같은 조건에서 비교합니다.','Compare observations and parameter cases under consistent conditions.'),
  box(60,215,300,149,L('관측유량','Observed discharge'),[L('대상 지점 · 평가 기간','Site and time window')])+
  box(60,400,300,149,L('매개변수 범위','Parameter ranges'),[L('검토할 매개변수 조합','Candidate cases')])+
  route('M374 287H403V333H430')+route('M374 472H403V377H430')+
  box(440,268,300,210,L('반복 계산 · 비교','Run and compare'),[L('동일한 목표지점','Same target location'),L('조합별 결과','Results for each case')])+
  line(754,356,805,356,undefined,true)+box(820,268,320,210,L('성능지표 평가','Evaluate metrics'),['NSE · KGE','PBIAS · RMSE'],'#ecf6f3')+
  text(600,610,L('선정 결과의 적용 범위는 자료와 평가 조건에 따릅니다.','Applicability depends on the data and evaluation conditions.'),25,400,'middle'));
 if(name==='result-lifecycle')return frame(name,lang,L('실행 기록과 출력 무결성','Run records and output integrity'),L('결과의 생성 조건과 결과 분석 준비 상태를 함께 확인합니다.','Review how results were produced and whether outputs are usable.'),
  box(60,218,310,220,L('실행 조건 기록','Record run context'),[L('입력 · 실행방식','Inputs · run mode'),L('초기상태','Initial states'),L('진단 · 경고','Diagnostics · warnings'),L('계산시간','Computation time')])+
  line(384,325,425,325,undefined,true)+box(440,218,310,220,L('결과 파일 생성','Write result files'),['NetCDF · '+L('결과요약','reports'),L('생성과 정상 종료','Creation and closure')])+
  line(764,325,805,325,undefined,true)+box(820,218,320,220,L('출력 요건 점검','Output integrity'),[L('정의된 출력 요건','Output requirements'),L('실행 오류상태','Execution error state')],'#ecf6f3')+
  route('M980 452V496H600V529')+text(600,574,L('결과 분석 도구','Postprocessing and result analysis'),30,700,'middle')+
  text(600,618,L('출력 점검과 수문·수리 결과 타당성 평가는 별도 항목입니다.','Output integrity and physical validity are separate assessments.'),22,400,'middle'));
 if(name==='nested-grid-patch'){
  let body=text(60,205,L('원지형 격자','Source terrain grid'),28,700)+text(660,205,L('배경 병합 · 관심영역 유지','Grouped background · retained patch'),25,700);
  body+=rect(60,238,500,300,'#eff6fa','#9cbdcf',0);
  for(let i=0;i<=10;i++)body+=line(60+i*50,238,60+i*50,538,'#a4bdcc');
  for(let i=0;i<=6;i++)body+=line(60,238+i*50,560,238+i*50,'#a4bdcc');
  body+=rect(260,338,100,100,'#d8eee8','#008c8c',0)+line(310,338,310,438,'#75b3a9')+line(260,388,360,388,'#75b3a9')+line(580,388,640,388,undefined,true);
  body+=rect(660,238,500,300,'#eff6fa','#9cbdcf',0);
  for(let i=0;i<=5;i++)body+=line(660+i*100,238,660+i*100,538,'#a4bdcc');
  for(let i=0;i<=3;i++)body+=line(660,238+i*100,1160,238+i*100,'#a4bdcc');
  body+=rect(860,338,100,100,'#d8eee8','#008c8c',0)+line(910,338,910,438,'#75b3a9')+line(860,388,960,388,'#75b3a9');
  body+=text(60,588,L('초록 관심영역은 원해상도 유지 · 배경은 격자 병합','Green patch retains source cells; background cells are grouped'),27,600)+text(60,630,L('입력 지형보다 더 세밀한 지형정보를 생성하지 않습니다.','No terrain detail beyond the input resolution is created.'),23);
  return frame(name,lang,L('다중해상도와 관심영역(Patch)','Multiple resolutions and local patches'),L('격자 배치는 설명용이며 실제 적용 해상도를 나타내지 않습니다.','Illustrative grid layout; no specific model resolution is prescribed.'),body);
 }


 if(name==='rainfall-spatial-forcing'){
  let body=rect(60,195,330,405,'#f5f9fb','#aac7d7',14)+text(86,235,L('강우 원자료','Rainfall sources'),29,700);
  body+=rect(88,280,120,88,'#e8f3f9','#aac7d7',10)+text(148,318,L('관측소','Gauges'),21,700,'middle')+text(148,347,L('시계열','Time series'),17,500,'middle','#486171');
  body+=rect(235,280,120,88,'#e9f5ef','#83b9ae',10)+text(295,318,L('레이더','Radar'),21,700,'middle')+text(295,347,L('강우장','Rain field'),17,500,'middle','#486171');
  body+=rect(88,395,267,88,'#fff6e7','#e6bf7d',10)+text(221,433,L('격자 강우자료','Gridded rainfall'),21,700,'middle')+text(221,462,L('공간·시간 기준 확인','Check space + time reference'),17,500,'middle','#75470f');
  body+=lang==='ko'?(text(221,538,'자료형식별 공간 연결',17,600,'middle','#486171')+text(221,562,'방식이 다름',17,600,'middle','#486171')):text(86,546,'Mapping depends on source type',18,600,'start','#486171');
  body+=line(405,392,460,392,'#247eaa',true);
  body+=rect(475,195,300,405,'#edf7f4','#83b9ae',14)+text(501,235,L('공간 배분·정합','Spatial mapping'),29,700);
  body+=rect(510,282,230,82,'#fff','#d4e1e8',10)+text(625,315,'IDW',24,700,'middle')+text(625,344,L('관측소 → 격자','Gauge → cells'),18,500,'middle','#486171');
  body+=rect(510,390,230,82,'#fff','#d4e1e8',10)+text(625,423,L('레이더·격자','Radar / grid'),21,700,'middle')+(lang==='ko'?text(625,451,'좌표·해상도 정합',17,500,'middle','#486171'):(text(625,447,'Align coordinates',16,500,'middle','#486171')+text(625,461,'+ resolution',16,500,'middle','#486171')));
  body+=lang==='ko'?text(625,536,'시간간격·단위·결측도 함께 확인',18,600,'middle','#11695d'):(text(625,526,'Check interval, units',16,600,'middle','#11695d')+text(625,550,'and gaps',16,600,'middle','#11695d'));
  body+=line(790,392,845,392,'#247eaa',true);
  body+=rect(860,195,280,405,'#f5f9fb','#aac7d7',14)+text(886,235,L('계산격자 강우','Cell rainfall'),29,700);
  for(let y=0;y<4;y++)for(let x=0;x<4;x++)body+=rect(900+x*52,290+y*52,50,50,['#edf4ef','#d9ebf2','#bfdfeb','#8fc7dd'][(x+y)%4],'#fff',0);
  body+=text(1004,530,L('격자별 강우 입력','Rainfall by cell'),21,700,'middle')+text(1004,560,L('실제 값은 입력자료에서 확인','Read actual values from inputs'),17,500,'middle','#486171');
  body+=text(600,630,L('관측소 공간배분은 IDW · 레이더/격자 강우는 공간좌표를 계산격자와 정합','Station mapping uses IDW; radar/gridded fields are aligned spatially to model cells'),19,600,'middle');
  return frame(name,lang,L('공간 강우 입력의 구성','Preparing spatial rainfall forcing'),L('강우 원자료를 공간·시간 기준에 맞춰 계산격자별 입력으로 구성합니다.','Prepare rainfall sources as cell-based forcing with consistent space and time references.'),body);
 }
 if(name==='channelbed-hydraulic-terrain'){
  let body=rect(60,195,505,400,'#f5f9fb','#aac7d7',14)+text(86,235,L('원 지형자료','Source terrain'),29,700);
  body+=lang==='ko'?text(86,263,'DEM은 수면 아래 저수로를 충분히 표현하지 못할 수 있음',18,600,'start','#486171'):(text(312,257,'A DEM may not resolve the',16,600,'middle','#486171')+text(312,278,'submerged low-flow channel',16,600,'middle','#486171'));
  body+='<path d="M105 405 L190 370 L275 382 L360 360 L505 392" fill="none" stroke="#8ca3af" stroke-width="6"/>';
  body+=line(105,405,505,405,'#78bfdc')+text(310,432,L('DEM 표면','DEM surface'),19,700,'middle','#486171');
  body+='<path d="M185 405 L230 450 L275 495 L330 450 L375 405" fill="none" stroke="#967b59" stroke-width="5" stroke-dasharray="9 6"/>';
  body+=lang==='ko'?text(280,520,'수중 하상은 별도 자료가 필요',19,600,'middle','#75470f'):(text(280,510,'Submerged bed needs',16,600,'middle','#75470f')+text(280,532,'added information',16,600,'middle','#75470f'));
  body+=line(580,392,635,392,'#247eaa',true);
  body+=rect(650,195,490,400,'#edf7f4','#83b9ae',14)+text(676,235,L('ChannelBed 보완','ChannelBed supplementation'),29,700);
  body+=lang==='ko'?text(676,263,'중심선·횡단면·높이 기준을 이용해 수리지형 구성',18,600,'start','#486171'):(text(676,257,'Use centerline, sections and',16,600,'start','#486171')+text(676,278,'vertical reference',16,600,'start','#486171'));
  body+='<path d="M700 405 L785 370 L845 388 L895 472 L945 505 L995 472 L1045 388 L1100 405" fill="none" stroke="#967b59" stroke-width="6"/>';
  body+=line(700,405,1100,405,'#78bfdc')+text(900,438,L('수면','Water surface'),18,600,'middle','#247eaa');
  body+=text(945,535,L('저수로·하상 보완','Supplemented low-flow channel'),20,700,'middle','#11695d');
  body+=rect(720,555,370,45,'#fff6e7','#e6bf7d',8)+(lang==='ko'?text(905,584,'측량 원자료와 보완 지형을 구분',17,600,'middle','#75470f'):(text(905,573,'Keep survey source and',14,600,'middle','#75470f')+text(905,584,'supplemented terrain distinct',13,600,'middle','#75470f')));
  body+=text(600,630,L('목적: 1D/2D 수리해석에 사용할 하상·저수로 형상을 더 일관되게 준비','Purpose: prepare consistent channel-bed and low-flow geometry for 1D/2D hydraulics'),19,600,'middle');
  return frame(name,lang,L('DEM과 수리해석용 ChannelBed','DEM and hydraulic ChannelBed terrain'),L('DEM으로 부족한 수중 하상·저수로 형상을 추가 자료로 보완합니다.','Supplement submerged channel-bed geometry that a surface DEM may not resolve.'),body);
 }
 if(name==='river-deep-storage-exchange'){
  let body=rect(60,195,470,410,'#f5f9fb','#aac7d7',14)+text(86,235,L('하천','River'),30,700);
  body+='<path d="M105 360 L180 320 L260 335 L340 320 L485 360 L485 470 L105 470Z" fill="#e1d4bd" stroke="#a98f6a" stroke-width="3"/>';
  body+='<path d="M175 390 H415 L390 430 L350 450 L240 450 L200 430Z" fill="#78bfdc" stroke="#247eaa" stroke-width="3"/><line x1="175" y1="390" x2="415" y2="390" stroke="#247eaa" stroke-width="3"/>';
  body+=text(295,420,L('하천수','River water'),22,700,'middle');
  body+=route('M295 458V520')+text(320,493,L('침투','Infiltration'),20,700,'start','#11695d');
  body+=text(86,570,L('침투가능량과 하상 조건에 의해 제한','Limited by infiltration capacity and bed conditions'),18,600,'start','#486171');
  body+=line(545,392,600,392,'#247eaa',true);
  body+=rect(615,195,525,410,'#edf7f4','#83b9ae',14)+text(641,235,L('심부저장·D층 물수지','Deep storage / D-layer balance'),29,700);
  body+=rect(675,310,405,135,'#c7e3df','#83b9ae',10)+text(878,352,L('D층 저장','D-layer storage'),25,700,'middle')+text(878,385,L('저장여유만큼 유입','Transfer limited by available storage'),18,500,'middle','#486171');
  body+=route('M878 445V500')+text(903,480,L('지연 복귀','Delayed return'),19,700,'start','#11695d');
  body+=lang==='ko'?text(641,548,'하천 감소량 ↔ 심부저장 증가량을 같은 이동량으로 기록',18,600,'start','#486171'):(text(878,538,'River loss ↔ deep-storage gain',16,600,'middle','#486171')+text(878,560,'use the same transferred volume',16,600,'middle','#486171'));
  body+=text(600,630,L('하천 침투는 기존 D층 저장 및 장기유출 확장과 연결되며, 완전한 지하수유동 해석과는 구분','River infiltration links to D-layer storage/long-term runoff extensions; it is not full groundwater-flow simulation'),18,600,'middle');
  return frame(name,lang,L('하천 침투와 심부저장 연계','River infiltration and deeper storage'),L('하천에서 빠진 물과 심부 저장층에 더해진 물을 하나의 이동량으로 연결합니다.','Link water leaving the river with the corresponding gain in deeper storage.'),body);
 }
 if(name==='hydraulic-structures'){
  let body=rect(60,195,510,410,'#f5f9fb','#aac7d7',14)+text(86,235,L('월류 구조물','Overflow structure'),29,700);
  body+=line(100,385,520,385,'#78bfdc')+rect(285,360,95,125,'#c7b18e','#967b59',2);
  body+=text(332,347,L('월류턱','Crest'),19,700,'middle','#75470f')+route('M185 340H275')+text(176,322,L('상류 수위','Upstream level'),18,600);
  body+=route('M390 340H485')+text(414,322,L('월류 Q','Overflow Q'),18,700,'start','#11695d');
  body+=text(86,548,L('수위와 월류턱 높이의 관계로 유량 산정','Discharge depends on head relative to crest'),18,600,'start','#486171');
  body+=rect(630,195,510,410,'#edf7f4','#83b9ae',14)+text(656,235,L('게이트·개구부','Gate / opening'),29,700);
  body+=line(670,385,1100,385,'#78bfdc')+rect(860,300,28,185,'#967b59','#75470f',2)+rect(888,410,105,75,'#fff','#967b59',2);
  body+=text(915,447,L('개구부','Opening'),18,700,'middle')+route('M735 430H850')+text(704,411,L('상류 수위','Upstream level'),18,600);
  body+=route('M1000 447H1080')+text(1014,426,L('통과 Q','Gate Q'),18,700,'start','#11695d');
  body+=lang==='ko'?text(656,548,'개도·제원·상하류 수위 조건을 함께 사용',18,600,'start','#486171'):(text(885,538,'Use opening, geometry and',16,600,'middle','#486171')+text(885,560,'upstream/downstream levels',16,600,'middle','#486171'));
  body+=text(600,630,L('구조물 형식별 유량관계를 1D 하천수리 또는 2D 범람 계산과 연결','Structure-specific discharge relations connect to 1D river or 2D flood calculations'),19,600,'middle');
  return frame(name,lang,L('수리구조물의 유량 연결','Hydraulic-structure flow relations'),L('월류와 게이트 통과 흐름을 구조물 형식·제원·수위조건에 따라 구분합니다.','Distinguish overflow and gate flow using structure type, geometry and water levels.'),body);
 }


 if(name==='continuous-state-cycle'){
  let body=rect(60,205,320,365,'#f5f9fb','#aac7d7',14)+text(86,245,L('강우사상 A','Rain event A'),27,700);
  body+=rect(95,295,250,54,'#dceef8','#8bbbd0',8)+text(220,329,L('강우·융설 입력','Rain / melt input'),19,700,'middle');
  body+=route('M220 350V382');
  body+=rect(95,390,250,125,'#e9f5ef','#83b9ae',10)+text(220,422,L('A/B/C/D 상태','A/B/C/D states'),22,700,'middle')+text(220,455,L('토양수분·저장량 갱신','Update soil water + storage'),17,500,'middle','#486171')+text(220,484,L('유출·기저유출 반응','Runoff / baseflow response'),17,500,'middle','#486171');
  body+=line(390,390,425,390,'#247eaa',true);
  body+=rect(440,205,320,365,'#fffaf0','#e6bf7d',14)+text(466,245,L('무강우·건기','Dry / no-rain period'),27,700);
  body+=route('M600 300V265',true)+text(625,286,L('증발산','ET'),18,700,'start','#75470f');
  body+=rect(475,330,250,155,'#edf7f4','#83b9ae',10)+(lang==='ko'?(text(600,366,'상태는 계속 유지·갱신',21,700,'middle')+text(600,404,'저장량 감소·재분배',17,500,'middle','#486171')+text(600,435,'D층·지연유출 연속성',17,500,'middle','#486171')+text(600,466,'다음 계산으로 전달',17,600,'middle','#11695d')):(text(600,358,'States persist',18,700,'middle')+text(600,382,'through dry periods',18,700,'middle')+text(600,416,'Storage depletion',15,500,'middle','#486171')+text(600,438,'+ redistribution',15,500,'middle','#486171')+text(600,462,'D-layer continuity',15,600,'middle','#11695d')));
  body+=line(770,390,805,390,'#247eaa',true);
  body+=rect(820,205,320,365,'#f5f9fb','#aac7d7',14)+text(846,245,L('강우사상 B','Rain event B'),27,700);
  body+=rect(855,295,250,54,'#dceef8','#8bbbd0',8)+text(980,329,L('새 강우 입력','New rainfall input'),19,700,'middle');
  body+=route('M980 350V382');
  body+=rect(855,390,250,125,'#e9f5ef','#83b9ae',10)+(lang==='ko'?(text(980,422,'이전 상태를 이어 계산',21,700,'middle')+text(980,455,'같은 강우라도 초기상태 영향',16,500,'middle','#486171')+text(980,484,'연속 물수지 유지',17,600,'middle','#11695d')):(text(980,416,'Continue from',18,700,'middle')+text(980,440,'prior states',18,700,'middle')+text(980,470,'Starting state',14,500,'middle','#486171')+text(980,491,'affects response',14,600,'middle','#11695d')));
  body+=text(600,620,L('연속모의는 강우사상 사이의 저장상태를 끊지 않고 다음 시점으로 전달합니다.','Continuous simulation carries storage states across events instead of resetting them.'),19,600,'middle');
  return frame(name,lang,L('연속모의와 상태 연속성','Continuous simulation and model states'),L('강우가 없는 기간에도 저장상태를 이어 다음 강우 반응에 사용합니다.','Carry storage states through dry periods so they affect the next event.'),body);
 }
 if(name==='state-save-restart'){
  let body=rect(60,215,300,350,'#f5f9fb','#aac7d7',14)+text(86,255,L('1 · 계산 진행','1 · Run to checkpoint'),lang==='ko'?27:22,700);
  body+=rect(95,310,230,88,'#e8f3f9','#aac7d7',10)+text(210,344,L('모형 상태 갱신','Update model states'),20,700,'middle')+text(210,373,L('토양·저장·유출 등','Soil · storage · runoff'),17,500,'middle','#486171');
  body+=route('M210 400V445')+text(235,431,L('시점 t₁','time t₁'),18,700,'start','#11695d');
  body+=rect(95,455,230,68,'#edf7f4','#83b9ae',10)+text(210,497,L('체크포인트 도달','Reach checkpoint'),19,700,'middle');
  body+=line(375,390,415,390,'#247eaa',true);
  body+=rect(430,215,330,350,'#fffaf0','#e6bf7d',14)+text(456,255,L('2 · 상태 저장','2 · Save state'),27,700);
  body+=rect(480,315,230,125,'#fff','#d4e1e8',10)+text(595,350,L('상태 파일','Saved-state file'),22,700,'middle')+text(595,383,L('활성 기능의 내부 상태','States for enabled functions'),17,500,'middle','#486171')+text(595,414,L('다음 실행의 시작점','Starting point for next run'),17,600,'middle','#11695d');
  body+=text(595,500,L('입력자료와 구분해 보존','Keep separate from forcing inputs'),17,600,'middle','#75470f');
  body+=line(775,390,815,390,'#247eaa',true);
  body+=rect(830,215,310,350,'#f5f9fb','#aac7d7',14)+text(856,255,L('3 · 재시작','3 · Restart'),27,700);
  body+=rect(865,310,240,78,'#e9f5ef','#83b9ae',10)+text(985,344,L('상태 파일 읽기','Read saved state'),20,700,'middle')+text(985,372,L('t₁ 상태 복원','Restore t₁ states'),17,500,'middle','#486171');
  body+=route('M985 390V430');
  body+=rect(865,440,240,78,'#e8f3f9','#aac7d7',10)+text(985,474,L('이후 입력으로 계속 계산','Continue with later forcing'),18,700,'middle')+text(985,502,L('t₁ 이후 시간대','Times after t₁'),17,500,'middle','#486171');
  body+=text(600,620,L('저장·복원 범위는 활성 기능과 버전에 따라 확인하며, 모든 수리 확장이 동일하게 복원되는 것은 아닙니다.','Saved-state coverage depends on enabled functions and build; not every hydraulic extension is restored identically.'),17,600,'middle');
  return frame(name,lang,L('HotStart 상태 저장과 재시작','HotStart state save and restart'),L('계산 중 저장한 상태를 다음 실행의 시작상태로 사용해 모의를 이어갑니다.','Use saved model states as the starting point for a subsequent run.'),body);
 }
 if(name==='reservoir-operation'){
  let body=rect(60,205,300,365,'#f5f9fb','#aac7d7',14)+text(86,245,L('저수지 상태','Reservoir state'),27,700);
  body+=rect(95,300,230,78,'#dceef8','#8bbbd0',10)+text(210,334,L('유입량·수위','Inflow · level'),20,700,'middle')+text(210,362,L('저류량·여유용량','Storage · capacity margin'),17,500,'middle','#486171');
  body+=route('M210 380V430');
  body+=rect(95,440,230,76,'#edf7f4','#83b9ae',10)+text(210,473,L('현재 운영조건','Current operating state'),19,700,'middle')+text(210,499,L('시점별 갱신','Updated each step'),17,500,'middle','#486171');
  body+=line(375,390,415,390,'#247eaa',true);
  body+=rect(430,205,330,365,'#fffaf0','#e6bf7d',14)+text(456,245,L('운영규칙·제약','Rules and constraints'),27,700);
  body+=rect(470,300,250,150,'#fff','#d4e1e8',10)+text(595,334,L('방류 목표·운영규칙','Release target / rule'),19,700,'middle')+text(595,368,L('게이트·여수로 제원','Gate / spillway geometry'),17,500,'middle','#486171')+text(595,400,L('상·하류 수위조건','Up/downstream levels'),17,500,'middle','#486171')+text(595,430,L('허용범위 확인','Check admissible range'),17,600,'middle','#75470f');
  body+=text(595,505,L('운영자 판단을 지원하는 계산조건','Computation supports operator review'),17,600,'middle','#11695d');
  body+=line(775,390,815,390,'#247eaa',true);
  body+=rect(830,205,310,365,'#f5f9fb','#aac7d7',14)+text(856,245,L('방류와 하류영향','Release and downstream'),27,700);
  body+=rect(865,300,240,82,'#e9f5ef','#83b9ae',10)+text(985,335,L('게이트·월류 Q','Gate / overflow Q'),20,700,'middle')+text(985,364,L('구조물별 유량관계','Structure-specific relation'),16,500,'middle','#486171');
  body+=route('M985 384V430');
  body+=rect(865,440,240,82,'#e8f3f9','#aac7d7',10)+text(985,474,L('하류 하천으로 연결','Connect to downstream river'),18,700,'middle')+text(985,503,L('수위·유량 변화 확인','Review level / discharge'),17,500,'middle','#486171');
  body+=text(600,620,L('저수지 상태 → 운영조건 → 구조물 방류 → 하류 수리조건을 하나의 흐름으로 연결합니다.','Link reservoir state, operating constraints, structure releases and downstream hydraulics.'),18,600,'middle');
  return frame(name,lang,L('댐·저수지 운영의 계산 연결','Dam and reservoir operating logic'),L('저수지 상태와 운영규칙·구조물 조건을 이용해 방류를 하류 하천과 연결합니다.','Connect reservoir state and operating constraints to releases and downstream conditions.'),body);
 }
 if(name==='reservoir-scenario-assessment'){
  let body=rect(60,205,285,365,'#f5f9fb','#aac7d7',14)+text(86,245,L('예측 유입·초기상태','Forecast inflow + initial state'),25,700);
  body+=rect(95,305,215,82,'#dceef8','#8bbbd0',10)+text(202,339,L('예측 유입계열','Forecast inflow series'),19,700,'middle')+text(202,368,L('저수위·저류량','Level · storage'),17,500,'middle','#486171');
  body+=route('M202 390V450')+text(228,432,L('공통 입력조건','Common inputs'),17,600,'start','#11695d');
  body+=rect(95,462,215,66,'#edf7f4','#83b9ae',10)+text(202,503,L('동일 기준으로 비교','Use one comparison basis'),18,700,'middle');
  body+=line(360,390,400,390,'#247eaa',true);
  body+=rect(415,205,350,365,'#fffaf0','#e6bf7d',14)+text(441,245,L('운영대안 A / B / C','Operating alternatives A / B / C'),25,700);
  const ys=[305,382,459],labels=[L('대안 A','Alternative A'),L('대안 B','Alternative B'),L('대안 C','Alternative C')];
  ys.forEach((y,i)=>{body+=rect(455,y,270,58,i===1?'#e9f5ef':'#fff','#d4e1e8',8)+text(478,y+36,labels[i],18,700)+line(570,y+29,685,y+29,i===0?'#247eaa':(i===1?'#328c79':'#b07a31'),true);});
  body+=text(590,550,L('방류 시점·크기·구조물 조합','Compare timing, magnitude and structures'),16,600,'middle','#75470f');
  body+=line(780,390,820,390,'#247eaa',true);
  body+=rect(835,205,305,365,'#f5f9fb','#aac7d7',14)+text(861,245,L('비교·검토','Compare and review'),27,700);
  body+=rect(870,302,235,155,'#edf7f4','#83b9ae',10)+text(987,336,L('저수지 수위·저류','Reservoir level / storage'),18,700,'middle')+text(987,369,L('방류량·시점','Release amount / timing'),17,500,'middle','#486171')+text(987,401,L('하류 제약조건','Downstream constraints'),17,500,'middle','#486171')+text(987,432,L('물수지·운영한계','Balance / operating limits'),17,500,'middle','#486171');
  body+=rect(870,475,235,55,'#fff6e7','#e6bf7d',8)+text(987,509,L('운영자가 대안을 비교','Operator compares alternatives'),17,700,'middle','#75470f');
  body+=text(600,620,L('예측은 대안 비교의 입력이며, 그림은 자동 의사결정이나 실제 방류량을 의미하지 않습니다.','Forecasts support alternative comparison; the schematic does not imply automatic decisions or actual releases.'),17,600,'middle');
  return frame(name,lang,L('예측 기반 저수지 운영대안 비교','Forecast-based reservoir scenario comparison'),L('같은 예측조건에서 여러 방류대안의 저수지·하류 영향을 비교합니다.','Compare reservoir and downstream effects of alternative releases under common forecast conditions.'),body);
 }
 if(name==='sediment-transport-pathways'){
  let body=rect(60,205,320,365,'#f5f9fb','#aac7d7',14)+text(86,245,L('사면 유사 발생','Hillslope sediment source'),27,700);
  body+='<path d="M100 430 L185 300 L340 430 Z" fill="#e7dcc6" stroke="#a98f6a" stroke-width="3"/>';
  body+=route('M175 340C210 360 245 382 300 410')+text(132,322,L('침식·이동','Erosion / movement'),18,700,'start','#75470f');
  body+=rect(105,455,230,62,'#fff6e7','#e6bf7d',8)+text(220,493,L('유사 공급량','Sediment supply'),19,700,'middle');
  body+=line(395,390,430,390,'#247eaa',true);
  body+=rect(445,205,320,365,'#edf7f4','#83b9ae',14)+text(471,245,L('하천 유입·이송','Delivery and river transport'),25,700);
  body+='<path d="M490 410 C555 360 625 360 720 420" fill="none" stroke="#78bfdc" stroke-width="28" stroke-linecap="round"/>';
  body+=route('M520 393C575 360 635 370 690 405')+text(605,337,L('흐름에 따라 하류 이동','Move downstream with flow'),18,700,'middle','#11695d');
  body+=text(605,470,L('하천 유사이송과 연결','Link to river sediment transport'),18,600,'middle','#486171');
  body+=line(780,390,815,390,'#247eaa',true);
  body+=rect(830,205,310,365,'#f5f9fb','#aac7d7',14)+text(856,245,L('퇴적·통과','Deposition / onward transport'),25,700);
  body+='<path d="M870 390 C920 360 1010 360 1100 405" fill="none" stroke="#78bfdc" stroke-width="24" stroke-linecap="round"/>';
  body+='<path d="M920 438 Q985 402 1055 438 Q985 458 920 438Z" fill="#d6b47a" stroke="#a98f6a" stroke-width="2"/>';
  body+=text(987,475,L('퇴적 가능 구간','Potential deposition reach'),18,700,'middle','#75470f')+text(987,510,L('남은 유사는 하류로 전달','Remaining load continues downstream'),16,500,'middle','#486171');
  body+=text(600,620,L('사면에서 발생한 유사와 하천 유사이송을 구분하되, 유역의 연속된 이동경로로 연결해 설명합니다.','Separate hillslope sediment generation from river transport while showing their connected pathway.'),17,600,'middle');
  return frame(name,lang,L('사면–하천 유사 이동 경로','Hillslope-to-river sediment pathway'),L('사면에서 발생한 유사가 하천으로 유입되어 이송·퇴적되는 연결을 보여줍니다.','Show how hillslope sediment is delivered to the river and then transported or deposited.'),body);
 }
 if(name==='conservative-tracer-path'){
  let body=rect(60,205,300,365,'#f5f9fb','#aac7d7',14)+text(86,245,L('주입·초기조건','Injection / initial condition'),27,700);
  body+=rect(95,315,230,82,'#e8f3f9','#aac7d7',10)+text(210,349,L('상류 주입 위치','Upstream injection point'),19,700,'middle')+text(210,378,L('시점·투입량 정의','Define timing / amount'),17,500,'middle','#486171');
  body+=route('M210 400V455')+text(236,438,L('하천으로 입력','Enter river'),17,600,'start','#11695d');
  body+=line(375,390,415,390,'#247eaa',true);
  body+=rect(430,205,330,365,'#edf7f4','#83b9ae',14)+text(456,245,L('보존성 물질 이동','Conservative transport'),27,700);
  body+='<path d="M475 420 C540 360 625 360 715 425" fill="none" stroke="#78bfdc" stroke-width="32" stroke-linecap="round"/>';
  body+=route('M500 401C565 360 630 370 690 412')+text(595,330,L('흐름과 함께 하류 이동','Move downstream with flow'),18,700,'middle','#11695d');
  body+=rect(495,460,200,52,'#fff','#d4e1e8',8)+text(595,493,L('반응·붕괴 없는 추적','No reactive decay'),17,700,'middle','#486171');
  body+=line(775,390,815,390,'#247eaa',true);
  body+=rect(830,205,310,365,'#f5f9fb','#aac7d7',14)+text(856,245,L('지점별 확인','Observation by location'),27,700);
  body+=line(885,330,1085,330,'#78bfdc')+line(885,415,1085,415,'#78bfdc');
  [920,985,1050].forEach((x,i)=>{body+='<circle cx="'+x+'" cy="330" r="9" fill="#fff" stroke="#247eaa" stroke-width="3"/>'+text(x,365,'P'+(i+1),16,700,'middle');});
  body+='<path d="M885 485 C920 485 930 450 955 450 S995 500 1025 490 S1060 465 1090 480" fill="none" stroke="#247eaa" stroke-width="4"/>';
  body+=text(985,525,L('농도·도달시간 시계열','Concentration / arrival-time series'),16,600,'middle','#486171');
  body+=text(600,620,L('보존성 추적은 물질의 이동경로를 확인하는 기능이며, 반응성 수질과정 모듈과 구분합니다.','Conservative tracking follows material movement and is distinct from reactive water-quality processes.'),17,600,'middle');
  return frame(name,lang,L('보존성 물질·염료 추적 경로','Conservative material and dye tracking'),L('상류에서 주입한 보존성 물질의 하류 이동과 지점별 확인 흐름을 보여줍니다.','Show downstream movement of a conservative tracer and observation at selected locations.'),body);
 }

 if(name==='river-network-hydraulics'){
  let body=rect(60,190,510,390,'#f5f9fb','#aac7d7',14)+text(86,230,L('하천망','River network'),29,700);
  body+=text(86,258,L('Reach · 분기 · 합류 연결','Reach · branch · confluence connectivity'),18,600,'start','#486171');
  body+='<path d="M130 485 C220 455 290 430 365 380 S470 305 525 275" fill="none" stroke="#4b8fae" stroke-width="16" stroke-linecap="round"/>';
  body+='<path d="M175 300 C240 335 280 360 350 390" fill="none" stroke="#75a9c0" stroke-width="11" stroke-linecap="round"/>';
  body+='<path d="M365 380 C410 430 452 462 520 490" fill="none" stroke="#75a9c0" stroke-width="11" stroke-linecap="round"/>';
  body+='<circle cx="350" cy="390" r="13" fill="#fff" stroke="#247eaa" stroke-width="4"/><circle cx="410" cy="340" r="13" fill="#fff" stroke="#247eaa" stroke-width="4"/>';
  body+=text(186,291,L('지류','Tributary'),18,600)+text(380,417,L('합류','Confluence'),18,700,'start','#11695d')+text(429,329,L('분기','Branch'),18,700,'start','#75470f');
  body+=line(155,505,220,472,'#247eaa',true)+text(96,535,L('하류 방향','Downstream'),18,600);
  body+=text(86,566,L('각 Reach의 횡단면과 연결관계를 함께 사용','Use cross sections and reach connectivity together'),19,500,'start','#486171');

  body+=rect(620,190,520,390,'#f8fbfc','#aac7d7',14)+text(646,230,L('횡단면 기반 수리','Cross-section hydraulics'),29,700);
  body+=text(646,258,L('같은 하천망에서 수위와 유량을 연결','Link water level and discharge across the network'),18,600,'start','#486171');
  const ys=[305,395,485];
  ys.forEach((y,i)=>{
    body+=rect(650,y-28,250,68,'#fff','#d4e1e8',8);
    body+='<path d="M670 '+(y+25)+' L705 '+(y-2)+' L755 '+(y+16)+' L810 '+(y-10)+' L880 '+(y+25)+'" fill="none" stroke="#967b59" stroke-width="3"/>';
    body+=line(705,y+3,852,y+3,'#247eaa');
    body+=text(665,y-7,'XS-'+String(i+1).padStart(2,'0'),17,700);
  });
  body+=route('M930 310V468')+text(956,337,L('수위 η','Water level η'),20,700)+text(956,377,L('유량 Q','Discharge Q'),20,700)+text(956,410,L('상·하류','Up/downstream'),18,500,'start','#486171')+text(956,434,L('상호영향','interaction'),18,500,'start','#486171');
  body+=text(646,555,L('단면 형상은 보존하고 종단 위치·연결성을 정합','Preserve section shape; align elevation and connectivity'),18,500,'start','#486171');
  body+=text(600,625,L('입력: 하천망·횡단면·경계조건  →  해석: 연속·운동량  →  결과: 수위 η · 유량 Q','Inputs: network · sections · boundaries  →  solve continuity/momentum  →  level η · discharge Q'),20,600,'middle');
  return frame(name,lang,L('1D 하천망 수리와 단면 연결','1D river-network hydraulics and cross sections'),L('Reach별 횡단면과 연결점을 따라 수위·유량을 함께 해석합니다.','Water level and discharge are linked through reaches, sections and network junctions.'),body);
 }
 if(name==='river-floodplain-coupling'){
  let body=rect(60,195,460,330,'#f4f9fc','#aac7d7',14)+rect(680,195,460,330,'#f4faf6','#aac7d7',14);
  body+=text(88,238,L('1D 하천','1D river'),30,700)+text(708,238,L('2D 범람원','2D floodplain'),30,700);
  body+='<path d="M95 475V355H165C195 355 214 378 230 405C246 431 268 442 292 442C316 442 338 431 354 405C370 378 389 355 419 355H500V475Z" fill="#e1d4bd" stroke="#a98f6a" stroke-width="3"/>';
  body+='<path d="M210 397H374C360 400 351 410 341 425C331 437 315 442 292 442C269 442 253 437 243 425C233 410 224 400 210 397Z" fill="#78bfdc" stroke="#247eaa" stroke-width="3"/><line x1="210" y1="397" x2="374" y2="397" stroke="#247eaa" stroke-width="3"/>';
  body+=text(292,474,L('수위 η₁ᴰ','stage η₁ᴰ'),20,700,'middle');
  for(let y=0;y<4;y++)for(let x=0;x<6;x++)body+=rect(738+x*58,285+y*43,56,41,(x+y>4)?'#9bcde0':(x+y>2?'#cde6ef':'#edf4ef'),'#fff',0);
  body+=text(910,474,L('수위 η₂ᴰ · 저류','stage η₂ᴰ · storage'),20,700,'middle');
  body+=line(520,302,675,302,'#247eaa',true)+text(600,280,L('월류','Overflow'),22,700,'middle')+text(600,326,'η₁ᴰ > η₂ᴰ',18,600,'middle','#486171');
  body+=line(680,382,525,382,'#328c79',true)+text(600,420,L('복귀','Return flow'),22,700,'middle','#11695d')+text(600,446,'η₂ᴰ > η₁ᴰ',18,600,'middle','#486171');
  body+=text(600,505,L('교환경계','Exchange interface'),18,700,'middle','#75470f');
  body+=rect(125,535,950,82,'#f8fbfc','#d4e1e8',10)+text(600,570,L('양방향 연계: 교환 후 바뀐 수위·저류가 다음 시간단계의 교환에 다시 영향','Two-way coupling: updated levels and storage affect exchange in the next time step'),19,600,'middle')+text(600,600,L('물수지 판정은 별도 1D–2D 교환 물수지 기능에서 확인','Check transfer accounting separately in the 1D–2D exchange-balance capability'),17,500,'middle','#486171');
  return frame(name,lang,L('1D 하천과 2D 범람원의 양방향 연계','Bidirectional 1D river–2D floodplain coupling'),L('상대 수위와 교환경계에 따라 월류 또는 복귀 흐름을 계산합니다.','Overflow or return flow is determined across the exchange interface as relative levels change.'),body);
 }
 if(name==='local-inertia-grid'){
  let body=rect(60,195,510,410,'#f5f9fb','#aac7d7',14)+text(86,235,L('2D 계산격자','2D computational grid'),29,700);
  body+=text(86,262,L('셀 중심 수심 h · 격자면 유량 q','Cell depth h · face discharge q'),18,600,'start','#486171');
  const gx=120,gy=300,s=72;
  for(let y=0;y<4;y++)for(let x=0;x<5;x++){const cx=gx+x*s,cy=gy+y*s,fill=(x+y>4)?'#9bcde0':(x+y>2?'#cde6ef':'#edf4ef');body+='<path d="M'+cx+' '+cy+'h'+(s-2)+'v'+(s-2)+'h-'+(s-2)+'Z" fill="'+fill+'" stroke="#fff" stroke-width="2"/>';}
  body+=text(gx+2.5*s,gy+1.65*s,L('수심 h','depth h'),22,700,'middle');
  body+=line(gx+2*s-7,gy+1.5*s,gx+3*s-7,gy+1.5*s,'#247eaa',true)+text(gx+2.5*s,gy+1.5*s-13,L('격자면 유량 q','face discharge q'),17,700,'middle');
  body+=line(gx+1.5*s,gy+2*s-7,gx+1.5*s,gy+3*s-7,'#328c79',true)+text(gx+1.58*s,gy+2.55*s,'q',18,700,'start','#11695d');
  body+=text(86,558,L('η = z + h 로 수면고를 구성','Water level η = z + h'),18,500,'start','#486171');

  body+=rect(620,195,520,410,'#f8fbfc','#aac7d7',14)+text(646,235,L('시간단계 계산 흐름','Time-step update'),29,700);
  const steps=[
    [L('1 · 수면고·지형','1 · level + terrain'),L('인접 셀의 수면차 확인','Read level difference between cells'),'#e8f3f9'],
    [L('2 · 격자면 유량 q','2 · face discharge q'),L('국부관성·수면경사·마찰로 갱신','Update with local inertia, slope and friction'),'#e9f5ef'],
    [L('3 · 수심 h 갱신','3 · update depth h'),L('유입 − 유출로 셀 저장량 갱신','Update cell storage from inflow − outflow'),'#fff6e7']
  ];
  steps.forEach((row,i)=>{const y=285+i*92;body+=rect(650,y,460,72,row[2],'#d4e1e8',10)+text(674,y+29,row[0],21,700)+text(674,y+56,row[1],17,500,'start','#486171');if(i<2)body+=route('M880 '+(y+76)+'V'+(y+88));});
  body+=text(646,548,L('이류가속도 생략','Advective acceleration omitted'),18,600,'start','#75470f')+text(646,572,L('국부관성·수면경사·마찰 반영','Local inertia, surface slope and friction retained'),18,600,'start','#75470f');
  body+=text(600,625,L('공간 격자에서 q를 먼저 갱신하고, 그 유입·유출로 h를 갱신하는 범람해석 개념','Update face q, then update cell h from the resulting inflow and outflow'),20,600,'middle');
  return frame(name,lang,L('2D Local Inertia 격자 계산 개념','2D Local Inertia grid-update concept'),L('셀 수심 h와 격자면 단위폭 유량 q를 시간에 따라 갱신합니다.','Cell depth h and face unit-width discharge q are advanced through time.'),body);
 }
 if(name==='river-result-views'){
  const blue='#0077ad',bed='#866d51',orange='#b56114',axis='#9aafbd';
  const curve=(d,c=blue)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`;
  const point=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="${orange}" stroke="#fff" stroke-width="3"/>`;
  let body=text(50,55,L('같은 지점과 시점으로 결과 연결하기','Connect results at one location and time'),36,700)+text(50,99,L('종단에서 지점을 고르고, 횡단과 시계열에서 같은 수위를 확인합니다.','Choose a location in the profile; match its level in the other views.'),26);
  body+=text(50,163,L('종단면','Longitudinal profile'),30,700)+text(1140,163,L('시점 t₀ 고정','Fixed time t₀'),25,500,'end',orange);
  body+=line(95,200,95,410,axis)+line(95,410,1135,410,axis)+text(60,215,'z',27,500,'end');
  body+=`<path d="M140 238L310 244L420 252L560 260L720 275L920 286L1100 302L1100 374L920 350L720 352L560 330L420 334L310 303L140 315Z" fill="#e4f2f8"/>`;
  body+=curve('M140 315L310 303L420 334L560 330L720 352L920 350L1100 374',bed)+curve('M140 238L310 244L420 252L560 260L720 275L920 286L1100 302');
  body+=line(560,193,560,410,orange,false,'8 7')+point(560,260)+text(581,241,'η₀',29,600,'start',blue)+text(560,447,L('선택 단면 x₀','Selected section x₀'),26,600,'middle',orange)+text(1135,447,L('하류 방향 x →','Downstream x →'),24,400,'end');
  body+=line(145,475,190,475,blue)+text(204,484,L('수면','Water surface'),24)+line(395,475,440,475,bed)+text(454,484,L('하상','Riverbed'),24);
  body+=line(50,512,1150,512,'#d7e4ec');
  body+=text(50,559,L('횡단면','Cross section'),30,700)+text(50,595,L('지점 x₀ · 시점 t₀','Location x₀ · time t₀'),25,500,'start',orange);
  body+=line(90,629,90,800,axis)+line(90,800,540,800,axis)+text(66,642,'z',27,500,'end');
  body+=`<path d="M167 681L472 681L437 735L395 773L270 773L214 735Z" fill="#cce8f4"/>`;
  body+=curve('M115 636L167 681L214 735L270 773L395 773L437 735L472 681L522 640',bed)+line(167,681,472,681,blue)+text(481,673,'η₀',29,600,'end',blue)+text(540,836,L('횡단 방향 y →','Across channel y →'),24,400,'end');
  body+=text(660,559,L('시계열','Time series'),30,700)+text(660,595,L('지점 x₀ 고정 · 시간 변화','Fixed location x₀ · varying time'),25,500,'start',orange);
  body+=line(722,627,722,691,axis)+line(722,691,1140,691,axis)+text(696,648,'η',28,500,'end',blue);
  body+=curve('M730 679C790 679 815 667 852 640S907 633 930 648S1020 680 1130 683');
  body+=line(722,722,722,792,axis)+line(722,792,1140,792,axis)+text(696,748,'Q',28,500,'end','#12877b');
  body+=curve('M730 783C790 785 837 771 870 741S916 734 930 746S1020 782 1130 785','#12877b');
  body+=line(930,614,930,792,orange,false,'8 7')+point(930,648)+point(930,746)+text(952,641,'η₀',26,600,'start',blue)+text(930,829,'t₀',28,600,'middle',orange)+text(1140,836,L('시간 t →','Time t →'),24,400,'end');
  body+=text(50,885,L('η: 수위 · Q: 유량   |   지점 x₀와 시점 t₀를 맞춰 세 결과를 비교합니다.','η: water level · Q: discharge   |   Match x₀ and t₀ across all three views.'),26,500);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="930" viewBox="0 0 1200 930" role="img" aria-labelledby="title desc"><title id="title">${esc(L('종단·횡단·시계열 결과의 연결','Connecting profile, section and time series'))}</title><desc id="desc">${esc(L('설명용 모식 곡선. 동일 지점 x₀와 시점 t₀의 수위 η₀를 세 관점으로 비교합니다. 실제 계산 결과나 뷰어 화면이 아닙니다.','Illustrative curves linking the same location x₀, time t₀ and level η₀. Not simulation results or a viewer screenshot.'))}</desc><rect width="1200" height="930" fill="#fff"/><g font-family="Noto Sans CJK KR,Noto Sans KR,Malgun Gothic,Arial,sans-serif">${body}</g></svg>\n`;
 }

 throw new Error('Unknown reference schematic: '+name);
}
const names=['input-readiness','rainfall-coverage','initial-state-warmup','watershed-water-balance','calibration-evaluation','result-lifecycle','nested-grid-patch','river-result-views','snow-process','deep-storage-path','continuous-state-cycle','state-save-restart','reservoir-operation','reservoir-scenario-assessment','sediment-transport-pathways','conservative-tracer-path','rainfall-spatial-forcing','channelbed-hydraulic-terrain','river-deep-storage-exchange','hydraulic-structures','river-network-hydraulics','river-floodplain-coupling','local-inertia-grid'];
function build(){const out=path.resolve(__dirname,'../../docs',directory);fs.mkdirSync(out,{recursive:true});for(const name of names)for(const lang of ['ko','en'])fs.writeFileSync(path.join(out,name+'-'+lang+'.svg'),diagram(name,lang));}
if(require.main===module)build();
module.exports={names,directory,build,diagram,frame,text,rect,line,route,box};
