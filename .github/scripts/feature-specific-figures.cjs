/* Focused explanatory schematics: symbolic examples, not screenshots or simulation data. */
const fs=require('node:fs'),path=require('node:path');
const {frame,text,rect,line,route,box}=require('./build-feature-reference-svg.cjs');
const directory='assets/diagrams/feature-specific/';
const captions={
 'finite-volume':['셀의 저장 변화는 경계 유량과 소스의 합으로 결정됩니다. 내부 경계의 같은 유량이 이웃 셀에 반대 부호로 작용합니다.','Cell storage changes with face discharges and sources. A shared internal discharge has opposite signs in neighboring cells.'],
 'flood-extras':['왼쪽은 계산 셀의 포함 여부, 오른쪽은 포함된 셀 사이의 연결 조건입니다. 같은 활성 셀도 경계 조건에 따라 연결이 달라집니다. 벽·개방만 표시한 개념 예시이며 지원 조건은 해석 경로마다 확인합니다.','The left panel selects computational cells; the right sets connections between active cells. The same cells can have different edge conditions. Wall/open examples are conceptual; check support for the selected solver.'],
 'rain-methods':['관측소 강우를 IDW 거리 가중으로 계산격자에 배분하는 과정을 설명합니다. 실제 관측값·계산값은 표시하지 않습니다.','Illustrates station rainfall mapped to model cells with IDW distance weighting; no observed or calculated values are shown.'],
 'wb-1d2d':['같은 교환량이 두 영역에 반대 부호로 기록되는 관계입니다. 월류와 복귀를 나누어 읽으세요.','Read opposite signed entries for the same exchange volume, separating overflow and return flow.'],
 netcdf:['파일별 좌표·시간·변수·단위를 확인한 뒤 비교합니다. 공통 파일 형식이 같은 격자나 시각을 뜻하지는 않습니다.','Inspect coordinates, times, variables and units per file. A shared format does not imply a shared grid or timestamps.'],
 viewer:['평면 지도에서 고른 위치와 시간 변화를 연결해 읽는 개념입니다. 실제 화면이나 계산 결과는 아닙니다.','Connect a location on a plan-view map with its time variation. This is not a software screenshot or a simulation result.'],
 inputstudio:['원자료를 프로젝트로 구성하고 검사한 뒤 엔진 입력으로 전달하는 역할입니다. 실제 편집 화면은 아닙니다.','Organize source data into a project, check it and prepare engine inputs. This is not an editor screenshot.']
};
function diagram(id,lang){const L=(k,e)=>lang==='ko'?k:e;let body,title,subtitle;
 if(id==='finite-volume'){
  title=L('경계 유량을 공유하면 내부 교환은 상쇄','Shared face discharge cancels internally');
  subtitle=L('유한체적의 보존 원리 · 그림의 수심과 화살표 크기는 설명용입니다.','Finite-volume conservation · depths and arrow sizes are illustrative.');
  body=rect(60,190,1080,340);
  for(const [j,level] of [[0,295],[1,320],[2,342]]){
   const x=190+j*280;
   body+=rect(x,level,280,460-level,'#bee0ee','#bee0ee',0)+line(x,level,x+280,level,'#247eaa');
   body+=text(x+140,236,['i − 1','i','i + 1'][j],26,700,'middle');
   body+=text(x+140,410,['Vᵢ₋₁','Vᵢ','Vᵢ₊₁'][j],32,700,'middle');
  }
  body+=`<path d="M190 460H1030V477H190Z" fill="#ddcbb4"/>`;
  for(const x of [190,470,750,1030])body+=line(x,253,x,477,'#607f94',false,'7 6');
  body+=line(420,280,520,280,undefined,true)+text(470,263,'Qᵢ₋½',24,600,'middle');
  body+=line(700,303,800,303,undefined,true)+text(750,283,'Qᵢ₊½',24,600,'middle');
  body+=text(330,508,'−Qᵢ₋½',25,600,'middle')+text(610,508,'+Qᵢ₋½ − Qᵢ₊½',25,600,'middle')+text(890,508,'+Qᵢ₊½',25,600,'middle');
  body+=text(600,576,L('각 셀: 저장 변화 = 시간간격 × 순유입량','Each cell: storage change = time step × net inflow'),28,600,'middle');
  body+=text(600,625,L('전체 합계에는 외부 경계·소스·손실만 남습니다.','Only external boundaries, sources and losses remain in the sum.'),24,500,'middle');
 }
 if(id==='flood-extras'){
  title=L('계산 영역과 셀 경계는 다른 입력','Domain and cell edges are different inputs');
  subtitle=L('Domain Mask: 셀 선택 / Face Mask: 셀 사이 연결 조건','Domain mask: select cells / Face mask: set connections between cells');
  body=rect(60,190,510,405)+rect(630,190,510,405);
  body+=text(88,238,'Domain Mask',29,700)+text(658,238,'Face Mask',29,700);
  const active=(x,y)=>!(x===0&&y<2)&&!(x===5&&y>1);
  for(const ox of [112,682])for(let y=0;y<4;y++)for(let x=0;x<6;x++){
   const a=active(x,y);
   body+=rect(ox+x*66,270+y*52,64,50,a?'#cce6ed':'url(#missing)',a?'#fff':'#d5dfe6',0);
  }
  // The two panels use exactly the same active cells. Only edge conditions differ.
  body+=`<path d="M880 272V319 M880 375V424" fill="none" stroke="#b25b42" stroke-width="8" stroke-linecap="round"/>`;
  body+=line(842,347,925,347,undefined,true);
  body+=`<path d="M660 516H688" fill="none" stroke="#b25b42" stroke-width="8" stroke-linecap="round"/>`+text(705,524,L('차단','Wall'),23,600);
  body+=line(898,516,934,516,undefined,true)+text(955,524,L('개방','Open'),23,600);
  body+=rect(90,505,22,22,'#cce6ed','#aac7d7',0)+text(126,524,L('계산에 포함','Active cells'),23);
  body+=rect(320,505,22,22,'url(#missing)','#d5dfe6',0)+text(356,524,L('영역 제외','Excluded cells'),23);
  body+=text(88,571,L('셀 단위로 계산 영역 선택','Select the domain cell by cell'),23);
  body+=text(658,571,L('인접한 두 셀은 모두 계산에 포함','Both adjacent cells remain active'),23);
  body+=text(600,634,L('활성 셀 ≠ 현재 침수 셀 · 해석 경로별 지원 조건 확인','Active cell ≠ wet cell · check solver-specific support'),24,600,'middle');
 }
 if(id==='rain-methods'){
  title=L('관측소 강우의 IDW 공간배분','IDW mapping of station rainfall');subtitle=L('현재 공개 제공 방식: IDW(역거리가중) · 거리 가중으로 격자 강우를 구성합니다.','Current public method: inverse-distance weighting (IDW).');
  body=rect(60,195,510,395)+rect(630,195,510,395);
  body+=text(90,245,L('관측소 강우','Station rainfall'),32,700);
  for(const [dx,dy,s] of [[85,110,'A'],[410,140,'B'],[360,245,'C']])body+=`<circle cx="${60+dx}" cy="${195+dy}" r="10" fill="#247eaa"/>`+text(60+dx+17,195+dy-8,s,23,700);
  body+=text(90,513,L('여러 관측소의 강우 시계열','Rainfall time series from stations'),22)+text(90,551,L('시간 간격·단위·결측 확인','Check interval, units and missing data'),22);
  body+=text(660,245,'IDW',32,700);
  for(const [dx,dy,s] of [[85,110,'A'],[410,140,'B'],[360,245,'C']])body+=`<circle cx="${630+dx}" cy="${195+dy}" r="10" fill="#247eaa"/>`+text(630+dx+17,195+dy-8,s,23,700);
  body+=rect(765,355,72,58,'#ecf6f3','#328c79',4)+text(801,391,L('격자','Cell'),22,700,'middle');
  body+=line(725,311,774,350,undefined,true)+line(1028,337,846,374,undefined,true)+line(984,428,838,407,undefined,true);
  body+=text(660,513,L('여러 관측소를 거리 가중으로 결합','Combine stations by distance weights'),22)+text(660,551,L('가중치 설정과 관측소 배치 확인','Check weighting settings and station layout'),22);
 }
 if(id==='wb-1d2d'){
  title=L('교환량은 하나, 회계는 두 영역','One exchange, two domain accounts');subtitle=L('ΔV는 같은 시간 구간의 교환 체적입니다. 부호는 각 영역의 증감입니다.','ΔV is exchanged volume over one interval; signs denote domain gain or loss.');
  body=box(60,205,340,120,L('1D 하천','1D river'))+box(800,205,340,120,L('2D 범람원','2D floodplain'))+line(420,240,780,240,undefined,true)+text(600,220,L('월류 ΔV','Overflow ΔV'),23,600,'middle')+line(780,298,420,298,undefined,true)+text(600,337,L('복귀 ΔV','Return ΔV'),23,600,'middle');
  const xs=[95,450,810],ys=[405,473,541];
  [L('교환 방향','Exchange direction'),L('하천 회계','River account'),L('범람원 회계','Floodplain account')].forEach((s,i)=>body+=text(xs[i],ys[0],s,26,700));
  [L('월류','Overflow'),'−ΔV','+ΔV'].forEach((s,i)=>body+=text(xs[i],ys[1],s,28));
  [L('복귀','Return'),'+ΔV','−ΔV'].forEach((s,i)=>body+=text(xs[i],ys[2],s,28));
  body+=line(60,425,1140,425,'#aac7d7')+text(600,614,L('동일 기간·교환량을 비교 · 전체 유역 물수지와 별도 진단','Match interval and volume · separate from whole-basin balance'),25,500,'middle');
 }
 if(id==='netcdf'){
  title=L('결과 파일을 비교하기 전 확인할 축','Check the axes before comparing files');subtitle=L('형식은 같아도 파일별 격자와 저장 시각은 다를 수 있습니다.','A common format can contain different grids and output times.');
  body=box(60,210,510,260,L('유역 격자 결과','Watershed-grid output'),[L('좌표 · 계산격자','Coordinates · model grid'),L('실제 저장 시각','Actual output timestamps'),L('변수 이름 · 단위','Variable names · units')])+box(630,210,510,260,L('범람 결과','Flood output'),[L('좌표 · 범람격자','Coordinates · flood grid'),L('별도 출력 간격 가능','May use a different interval'),L('사용 가능한 수리 변수','Available hydraulic variables')],'#ecf6f3');
  body+=route('M315 482V522H600V550')+route('M885 482V522H610',false)+text(600,601,L('위치·시간 정렬 → 변수·단위 확인 → 비교','Align location/time → check variables/units → compare'),28,600,'middle');
 }
 if(id==='viewer'){
  title=L('위치와 시간 변화를 함께 읽기','Read location and time together');subtitle=L('FloodViewer의 분석 역할을 설명하는 개념도입니다.','Conceptual analysis views for FloodViewer.');
  body=rect(60,200,510,360)+rect(630,200,510,360)+text(90,246,L('평면 공간분포','Plan-view distribution'),29,700)+text(660,246,L('선택 위치의 시간 변화','Time variation at a location'),28,700);
  for(let y=0;y<5;y++)for(let x=0;x<8;x++)body+=rect(96+x*51,282+y*45,49,43,(x+y)%4===0?'#70b9d5':(x+y)%3===0?'#b6dbe9':'#e0eef4','#fff',0);
  body+=`<circle cx="274" cy="394" r="16" fill="#f6a21a" stroke="#163c58" stroke-width="3"/>`+line(295,394,650,394,undefined,true);
  body+=line(696,476,1090,476,'#68859b')+line(696,476,696,285,'#68859b')+`<path d="M706 460C770 465 787 350 840 332S924 442 1080 450" fill="none" stroke="#247eaa" stroke-width="5"/>`+text(895,521,L('시간','Time'),23,500,'middle');
  body+=text(600,618,L('모식 분포·곡선 · 실제 값은 결과 파일에서 확인','Schematic pattern and curve · read actual values from outputs'),25,500,'middle');
 }
 if(id==='inputstudio'){
  title=L('원자료를 실행 입력으로 준비하기','Prepare source data as run inputs');subtitle=L('입력 프로젝트의 구성·검사 역할 · 결과 분석은 Viewer에서 수행합니다.','Project preparation and checking; result analysis is performed in a viewer.');
  body=box(60,200,350,115,L('공간 자료','Spatial data'),[L('지형 · 하천 · 단면','Terrain · rivers · sections')])+box(60,350,350,115,L('시간 자료·조건','Time data / settings'),[L('강우 · 모의조건','Rainfall · run settings')])+route('M423 260H462V315H495')+route('M423 409H462V365H495')+box(510,245,290,205,L('프로젝트','Project'),[L('자료 연결·편집','Link and edit inputs'),L('정합성 점검','Consistency checks')],'#ecf6f3')+line(815,343,864,343,undefined,true)+box(880,245,260,205,L('K-DRUM 입력','K-DRUM inputs'),[L('모의 준비','Ready for run'),L('조건 재확인','Recheck settings')])+text(600,590,L('원자료 변경 시 연결 자료와 좌표·시간 기준을 다시 점검','After source changes, recheck linked data and coordinate/time references'),23,500,'middle');
 }
 if(!body)throw Error(id);return frame(id,lang,title,subtitle,body);
}
function get(id,lang,pre=''){return captions[id]?{src:pre+directory+id+'-'+lang+'.svg',width:1200,height:720,caption:captions[id][lang==='ko'?0:1],shared:false}:null;}
function build(){const out=path.resolve(__dirname,'../../docs',directory);fs.mkdirSync(out,{recursive:true});for(const id of Object.keys(captions))for(const lang of ['ko','en'])fs.writeFileSync(path.join(out,id+'-'+lang+'.svg'),diagram(id,lang));}
module.exports={get,build,captions,directory};
