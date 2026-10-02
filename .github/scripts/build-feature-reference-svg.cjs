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
  let body=rect(60,195,300,410,'#f5f9fb','#aac7d7',14)+text(86,235,L('강우 입력원','Rainfall sources'),29,700);
  body+=text(86,265,L('자료 형식에 따라 연결 경로를 구분','Use a path suited to the source format'),17,600,'start','#486171');
  body+=text(92,315,L('관측소 시계열','Gauge time series'),21,700);
  [[125,350],[205,335],[285,365]].forEach((p,i)=>{body+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="10" fill="#fff" stroke="#247eaa" stroke-width="4"/>'+text(p[0],p[1]-17,'S'+(i+1),15,700,'middle');});
  body+=text(92,425,L('레이더·격자 강우장','Radar / gridded rainfall'),21,700);
  for(let y=0;y<3;y++)for(let x=0;x<4;x++)body+=rect(100+x*50,455+y*38,48,36,(x+y>3)?'#78bfdc':(x+y>1?'#cde6ef':'#edf4ef'),'#fff',0);
  body+=text(86,582,L('시간간격 · 단위 · 좌표 확인','Check interval · units · coordinates'),17,500,'start','#486171');

  body+=rect(410,195,350,410,'#f8fbfc','#aac7d7',14)+text(436,235,L('공간 연결','Spatial mapping'),29,700);
  body+=rect(440,285,290,72,'#e8f3f9','#d4e1e8',10)+text(462,315,L('1 · 공통 기준 확인','1 · align references'),20,700)+text(462,343,L('시간 · 단위 · 계산영역','time · units · model domain'),17,500,'start','#486171');
  body+=rect(440,385,290,86,'#e9f5ef','#d4e1e8',10)+text(462,416,L('2 · 관측소 입력','2 · station input'),20,700)+text(462,444,L('IDW 거리 가중으로 격자화','Map to cells with IDW'),17,500,'start','#486171');
  body+=rect(440,500,290,72,'#fff6e7','#d4e1e8',10)+text(462,530,L('3 · 격자형 입력','3 · gridded input'),20,700)+text(462,558,L('공간범위·격자 대응 확인','Check spatial/grid alignment'),17,500,'start','#486171');

  body+=route('M365 355H402')+route('M365 500H402')+route('M765 395H802');
  body+=rect(810,195,330,410,'#f4faf6','#aac7d7',14)+text(836,235,L('K-DRUM 계산격자','K-DRUM model grid'),29,700);
  body+=text(836,265,L('격자별 강우 입력','Rainfall forcing by cell'),18,600,'start','#486171');
  for(let y=0;y<5;y++)for(let x=0;x<5;x++)body+=rect(850+x*48,315+y*48,46,46,(x+y>6)?'#4fa6c7':(x+y>3?'#9bcde0':'#dceef8'),'#fff',0);
  body+=text(975,585,L('색상은 공간배분 개념','Colors show mapping concept'),17,500,'middle','#486171');
  body+=text(600,628,L('관측소는 IDW · 레이더/격자자료는 해당 공간정보를 계산격자와 정합','Stations use IDW · radar/gridded fields are aligned to the computational grid'),19,600,'middle');
  return frame(name,lang,L('관측 강우에서 계산격자 강우까지','From rainfall observations to model-cell forcing'),L('입력 형식에 맞춰 공간·시간 기준을 확인하고 계산격자의 강우 입력으로 연결합니다.','Align spatial and temporal references and connect each rainfall source to model-cell forcing.'),body);
 }
 if(name==='channelbed-terrain'){
  let body=rect(60,195,310,385,'#f5f9fb','#aac7d7',14)+text(86,235,L('1 · 표면 지형','1 · surface terrain'),27,700);
  body+=text(86,266,L('DEM만으로는 저수로가 약하게 표현될 수 있음','DEM may under-resolve low-flow geometry'),16,600,'start','#486171');
  body+='<path d="M90 365 L145 335 L205 355 L265 345 L340 365" fill="none" stroke="#8a795f" stroke-width="5"/>';
  body+=line(115,335,320,335,'#78bfdc')+text(215,320,L('수면 예시','example water level'),16,600,'middle','#247eaa');
  body+=text(86,430,L('확인','Review'),19,700)+text(86,458,L('하상·저수로 형상과 높이 기준','bed / low-flow shape and vertical datum'),16,500,'start','#486171');

  body+=rect(445,195,310,385,'#f8fbfc','#aac7d7',14)+text(471,235,L('2 · 보완 자료','2 · supplemental data'),27,700);
  body+=text(471,266,L('DEM · 중심선 · 추가 단면','DEM · centerline · added sections'),17,600,'start','#486171');
  body+=line(490,330,700,330,'#247eaa',true)+text(595,312,L('하천 중심선','river centerline'),17,700,'middle');
  [360,425,490].forEach((y,i)=>{body+=rect(500,y,205,45,'#fff','#d4e1e8',6)+text(520,y+29,'XS-'+String(i+1).padStart(2,'0'),17,700)+text(585,y+29,L('단면·하상 정보','section / bed info'),15,500);});
  body+=text(471,555,L('원자료가 제공하는 정보 범위 안에서 보완','Supplement only within source-data support'),16,500,'start','#486171');

  body+=route('M375 385H435')+route('M760 385H820');
  body+=rect(830,195,310,385,'#f4faf6','#aac7d7',14)+text(856,235,L('3 · 수리 지형','3 · hydraulic terrain'),27,700);
  body+=text(856,266,L('주변 지형과 연결된 저수로·하상','Connected low-flow / bed geometry'),17,600,'start','#486171');
  body+='<path d="M860 365 L915 335 L955 355 L985 420 L1015 355 L1060 345 L1110 365" fill="none" stroke="#8a795f" stroke-width="5"/>';
  body+=line(885,335,1088,335,'#78bfdc')+text(986,320,L('수면 예시','example water level'),16,600,'middle','#247eaa');
  body+=text(856,455,L('최종 확인','Final checks'),19,700)+text(856,484,L('높이 기준 · 주변 연결성','vertical datum · terrain continuity'),16,500,'start','#486171')+text(856,512,L('1D/2D 수리입력으로 사용','use as 1D/2D hydraulic input'),16,500,'start','#486171');
  body+=text(600,628,L('보완 지형은 측량 원자료와 구분하고, 추가 자료가 없는 형상을 임의로 생성하지 않음','Keep supplemented terrain distinct from survey data; do not invent unsupported geometry'),18,600,'middle');
  return frame(name,lang,L('DEM에서 수리해석용 ChannelBed 지형까지','From DEM to ChannelBed hydraulic terrain'),L('DEM·중심선·추가 단면이 제공하는 범위에서 저수로와 하상을 보완하고 높이 기준과 연결성을 확인합니다.','Supplement low-flow and bed geometry only where supported by DEM, centerline and section data, then verify datum and continuity.'),body);
 }
 if(name==='hydraulic-structure-interface'){
  let body=rect(60,195,500,355,'#f5f9fb','#aac7d7',14)+text(86,235,L('월류 구조물','Crest overflow'),28,700);
  body+=text(86,263,L('상·하류 수위와 월류턱 제원','Up/downstream levels and crest geometry'),17,600,'start','#486171');
  body+='<path d="M95 430H250V335H330V430H525" fill="#e7d9bd" stroke="#9a825f" stroke-width="3"/>';
  body+=line(105,360,245,360,'#247eaa')+line(335,405,515,405,'#78bfdc');
  body+=route('M225 315H355')+text(290,300,L('월류 Q','overflow Q'),19,700,'middle');
  body+=text(105,350,L('상류 수위','upstream level'),15,600)+text(365,395,L('하류 수위','downstream level'),15,600);

  body+=rect(640,195,500,355,'#f4faf6','#aac7d7',14)+text(666,235,L('게이트·개구부','Gate / opening'),28,700);
  body+=text(666,263,L('수위와 개구부 제원에 따른 흐름','Flow governed by levels and opening geometry'),17,600,'start','#486171');
  body+='<path d="M675 430H820V315H875V430H1110" fill="#e7d9bd" stroke="#9a825f" stroke-width="3"/>';
  body+='<rect x="827" y="350" width="41" height="80" fill="#fff" stroke="#647785" stroke-width="3"/>';
  body+=line(685,350,818,350,'#247eaa')+line(880,405,1100,405,'#78bfdc');
  body+=route('M790 390H930')+text(860,375,L('개구부 Q','opening Q'),19,700,'middle');
  body+=text(685,340,L('상류 수위','upstream level'),15,600)+text(920,395,L('하류 수위','downstream level'),15,600);

  body+=rect(115,575,970,62,'#f8fbfc','#d4e1e8',9)+text(600,603,L('수위·구조물 제원','heads + geometry'),18,700,'middle')+text(600,630,L('→ 구조물 유량 Q 산정 → 1D/2D 상·하류 계산에 전달','→ calculate structure discharge Q → pass to upstream/downstream 1D/2D calculations'),17,600,'middle','#486171');
  return frame(name,lang,L('수리구조물 유량과 계산영역 연결','Hydraulic-structure discharge and domain coupling'),L('월류와 게이트·개구부 흐름을 구조물 조건에 맞게 구분하고 산정 유량을 상·하류 계산에 전달합니다.','Distinguish crest overflow from gate/opening flow and pass the calculated discharge to adjoining domains.'),body);
 }
 if(name==='river-deep-storage'){
  let body=rect(60,195,520,410,'#f5f9fb','#aac7d7',14)+text(86,235,L('하천–D층 이동','River-to-D-layer transfer'),28,700);
  body+=text(86,264,L('D층은 기존 다층 구조의 지하수 저장층','D is the existing groundwater-storage layer'),17,600,'start','#486171');
  body+='<path d="M95 405V330H170C205 330 220 355 240 385C260 416 290 428 320 428C350 428 380 416 400 385C420 355 435 330 470 330H545V405Z" fill="#e1d4bd" stroke="#a98f6a" stroke-width="3"/>';
  body+='<path d="M220 375H420C400 380 390 394 380 408C367 424 347 428 320 428C293 428 273 424 260 408C250 394 240 380 220 375Z" fill="#78bfdc" stroke="#247eaa" stroke-width="3"/>';
  body+=text(320,455,L('하천수','river water'),19,700,'middle');
  body+=route('M320 465V505')+text(340,493,L('침투 이동량','infiltration transfer'),17,700);
  body+=rect(150,520,340,62,'#c7e3df','#83b9ae',9)+text(320,557,L('기존 D층 저장','Existing D-layer storage'),21,700,'middle');

  body+=rect(630,195,510,410,'#f8fbfc','#aac7d7',14)+text(656,235,L('이동량 제한과 물수지','Transfer limits and accounting'),28,700);
  const rows=[
   [L('가용 하천수','Available river water'),L('하천에서 실제로 이동 가능한 물','water available for transfer'),'#e8f3f9'],
   [L('침투가능량','Infiltration capacity'),L('선택한 조건의 침투 한계','infiltration limit for the selected path'),'#e9f5ef'],
   [L('D층 저장여유','D-layer storage space'),L('저장 가능한 남은 용량','remaining storage capacity'),'#fff6e7']
  ];
  rows.forEach((r,i)=>{const y=285+i*82;body+=rect(660,y,450,64,r[2],'#d4e1e8',9)+text(680,y+27,r[0],19,700)+text(680,y+51,r[1],15,500,'start','#486171');});
  body+=text(885,548,L('같은 시간구간에서','Over the same interval'),17,600,'middle','#486171');
  body+=text(760,580,L('하천  −ΔV','River  −ΔV'),21,700,'middle')+text(1010,580,L('D층  +ΔV','D layer  +ΔV'),21,700,'middle');
  body+=text(600,628,L('이동량은 가용 하천수·침투가능량·D층 저장여유의 제한을 함께 받음','Transfer is jointly limited by available river water, infiltration capacity and D-layer storage space'),18,600,'middle');
  return frame(name,lang,L('하천 침투와 D층 심부저장 연계','River infiltration and D-layer storage coupling'),L('하천에서 심부 저장으로 이동 가능한 물을 여러 제한조건으로 제약하고 두 영역의 물수지에 같은 이동량으로 반영합니다.','Constrain river-to-deep-storage transfer by available water, infiltration capacity and storage space, then account for the same transfer in both domains.'),body);
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
const names=['input-readiness','rainfall-coverage','initial-state-warmup','watershed-water-balance','calibration-evaluation','result-lifecycle','nested-grid-patch','river-result-views','snow-process','deep-storage-path','rainfall-spatial-forcing','channelbed-terrain','hydraulic-structure-interface','river-deep-storage','river-network-hydraulics','river-floodplain-coupling','local-inertia-grid'];
function build(){const out=path.resolve(__dirname,'../../docs',directory);fs.mkdirSync(out,{recursive:true});for(const name of names)for(const lang of ['ko','en'])fs.writeFileSync(path.join(out,name+'-'+lang+'.svg'),diagram(name,lang));}
if(require.main===module)build();
module.exports={names,directory,build,diagram,frame,text,rect,line,route,box};
