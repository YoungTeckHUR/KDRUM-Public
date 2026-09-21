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
 if(name==='deep-storage-path')return frame(name,lang,L('D층 저장·복귀·손실의 구분','D-layer storage, return and loss'),L('지연 복귀와 별도 선택 조건의 심부 손실을 구분합니다.','Development path · delayed return and deep loss have separate controls.'),
  box(60,225,330,190,L('D층 저장','D-layer storage'),[L('유입과 저장량 갱신','Inflow and storage update'),L('저장량 내에서 방출','Release within storage')])+
  line(405,317,427,317,undefined,true)+box(435,225,330,190,L('상부 토양층 경로','Upper soil-layer path'),[L('지연 복귀 수용','Receives delayed return'),L('토양층 유출과 연결','Connects to soil runoff')],'#ecf6f3')+
  line(779,317,804,317,undefined,true)+box(810,225,330,190,L('유출 전달','Runoff routing'),[L('다른 유출 기여와 결합','Joins other contributions'),L('하류 유량에 기여','Contributes downstream')])+
  route('M225 430V466')+box(60,480,330,120,L('선택적 심부 손실','Optional deep loss'),[L('활성 옵션 확인','Check enabled option')])+
  text(435,522,L('저장·복귀·손실을 따로 집계','Account for each term separately'),26,600)+text(435,569,L('완전한 지하수유동 해석과 구분','Distinct from full groundwater flow'),24));
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
  body+=text(600,609,L('유형별 시간수 집계 → 실행 리포트','Hours by category → execution report'),29,700,'middle');
  return frame(name,lang,L('강우자료 완전성 평가','Rainfall input completeness'),L('관측·예측·결측의 구성과 누락 상태를 요약합니다.','Summarize observed, forecast and missing periods.'),body);
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
  line(384,325,425,325,undefined,true)+box(440,218,310,220,L('결과 파일 생성','Write result files'),['NetCDF · '+L('리포트','reports'),L('생성과 정상 종료','Creation and closure')])+
  line(764,325,805,325,undefined,true)+box(820,218,320,220,L('출력 요건 점검','Output integrity'),[L('정의된 출력 요건','Output requirements'),L('실행 오류상태','Execution error state')],'#ecf6f3')+
  route('M980 452V496H600V529')+text(600,574,L('후처리 · 결과 분석 도구','Postprocessing and result analysis'),30,700,'middle')+
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
const names=['input-readiness','rainfall-coverage','initial-state-warmup','watershed-water-balance','calibration-evaluation','result-lifecycle','nested-grid-patch','river-result-views','snow-process','deep-storage-path'];
function build(){const out=path.resolve(__dirname,'../../docs',directory);fs.mkdirSync(out,{recursive:true});for(const name of names)for(const lang of ['ko','en'])fs.writeFileSync(path.join(out,name+'-'+lang+'.svg'),diagram(name,lang));}
if(require.main===module)build();
module.exports={names,directory,build,diagram,frame,text,rect,line,route,box};
