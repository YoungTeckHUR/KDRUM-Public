(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const assetBase=ko?'../assets/':'assets/';
  const MYWATER='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
  const TERMS='https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127';

  const copy={
    nav:ko?
      [['주요 기능','#capabilities'],['모형 구성','#architecture'],['결과 예시','#results'],['연구·적용','#research'],['프로그램','#platform'],['무료 다운로드','#references']]:
      [['Capabilities','#capabilities'],['Model workflow','#architecture'],['Result concepts','#results'],['Research','#research'],['Programs','#platform'],['Free download','#references']],
    details:ko?'상세 보기':'View details',
    clickHint:ko?'화살표가 표시된 카드는 선택할 수 있습니다. 카드를 누르면 개념도·현재 상태·주의사항을 확인할 수 있습니다.':'Cards with an arrow are interactive. Open one to see its concept diagram, current status and cautions.',
    concept:ko?'개념 예시':'Concept illustration',
    program:ko?'구성 프로그램':'Program component',
    resource:ko?'자료 열기':'Open resource'
  };

  const groupType={forcing:'rain',hydrology:'hydrology',terrain:'terrain',audit:'audit',river:'river',flood:'flood',transport:'transport',platform:'platform'};

  const symbolCode={
    'rain-spatial':'P','rain-methods':'IDW','rain-qc':'QC','rain-summary':'%','input-precheck':'CHK',
    'ga':'GA','runoff':'Q','continuous':'T','et':'ET','snow':'SN','warmup':'W','hotstart':'HS','dlayer':'D',
    'slope-separate':'S','kw-hill':'KW','kw-river':'Q','river-infil':'INF','channelbed':'DEM',
    'wb':'Σ','wb-1d2d':'QEX','run-report':'RPT','subbasin-report':'SUB','optimization':'OPT','subcal':'CAL','output-integrity':'OK',
    'dwnet':'1D','junction':'JCT','structures':'STR','dam-operation':'DAM','dam-forecast':'FCST','dam-scenario':'NET',
    'coupling':'1D↔2D','local-inertia':'LI','fullswe':'SWE','multires':'MR','flood-extras':'2D+',
    'sed-hill':'SED','sed-river':'QS','dye':'C(t)','wq':'WQ','parallel':'OMP','netcdf':'NC','viewer':'MAP','inputstudio':'IN','viewer1d':'1D V','estuary':'X–Z'
  };
  const programRoles=[
    {role:'core',match:/K-DRUM Core/i,labelKo:'해석 엔진',labelEn:'Simulation engine',code:'CORE'},
    {role:'authoring',match:/InputStudio/i,labelKo:'입력자료 작성',labelEn:'Project authoring',code:'INPUT'},
    {role:'floodviewer',match:/FloodViewer/i,labelKo:'통합 결과분석',labelEn:'Integrated results',code:'MAP'},
    {role:'geometry',match:/ChannelBed/i,labelKo:'지형·하상 작성',labelEn:'Terrain & channel bed',code:'BED'},
    {role:'output',match:/통합 결과출력|Integrated output/i,labelKo:'자료교환',labelEn:'Data exchange',code:'NC'},
    {role:'viewer1d',match:/1차원 하천수리 결과 뷰어|1D River Hydraulics Results Viewer/i,labelKo:'1차원 결과분석',labelEn:'1D results',code:'1D'},
    {role:'research',match:/Estuary2DV/i,labelKo:'연구 확장',labelEn:'Research extension',code:'X–Z'}
  ];

  const itemType={
    'rain-spatial':'rain','rain-methods':'stations','rain-qc':'quality','rain-summary':'quality','input-precheck':'check',
    'ga':'infiltration','runoff':'hydrology','continuous':'timeline','et':'et','snow':'snow','warmup':'loop','hotstart':'restart','dlayer':'groundwater',
    'slope-separate':'slope','kw-hill':'terrain','kw-river':'river','river-infil':'infiltration','channelbed':'terrain',
    'wb':'audit','wb-1d2d':'exchange','run-report':'report','subbasin-report':'report','optimization':'calibration','subcal':'calibration','output-integrity':'check',
    'dwnet':'river','junction':'network','structures':'structure','dam-operation':'dam','dam-forecast':'dam','dam-scenario':'network',
    'coupling':'exchange','local-inertia':'flood','fullswe':'flood','multires':'grid','flood-extras':'flood',
    'sed-hill':'sediment','sed-river':'sediment','dye':'tracer','wq':'quality',
    'parallel':'parallel','netcdf':'data','viewer':'viewer','inputstudio':'input','viewer1d':'viewer1d','estuary':'estuary'
  };

  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const svg=(body,label='')=>`<svg viewBox="0 0 160 104" role="img" aria-label="${esc(label)}" focusable="false"><defs><linearGradient id="ev3g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dff4ff"/><stop offset="1" stop-color="#e9f8f2"/></linearGradient></defs><rect x="1" y="1" width="158" height="102" rx="16" fill="url(#ev3g)" stroke="#b9ddeb"/>${body}</svg>`;

  function conceptSvg(type,label=''){
    const blue='#0878c9',cyan='#25a9d6',teal='#1b9b84',green='#55a96a',amber='#d8901f',violet='#7167c5',ink='#183a52',muted='#7aa0b5';
    const base={
      rain:`<path d="M24 36c3-12 17-18 28-11 9-13 31-8 32 8 13-2 22 7 20 18H28c-13 0-15-11-4-15Z" fill="#fff" stroke="${blue}" stroke-width="3"/><g stroke="${cyan}" stroke-width="3" stroke-linecap="round"><path d="M43 58l-6 16"/><path d="M62 58l-6 16"/><path d="M81 58l-6 16"/><path d="M100 58l-6 16"/></g><g stroke="${muted}" opacity=".7"><path d="M112 28v54"/><path d="M128 28v54"/><path d="M144 28v54"/><path d="M106 38h46"/><path d="M106 54h46"/><path d="M106 70h46"/></g><path d="M109 76c12-18 24-6 38-24" fill="none" stroke="${teal}" stroke-width="4"/>`,
      stations:`<g fill="#fff" stroke="${blue}" stroke-width="3"><circle cx="34" cy="28" r="7"/><circle cx="74" cy="46" r="7"/><circle cx="48" cy="78" r="7"/></g><path d="M34 28 74 46 48 78Z" fill="none" stroke="${muted}" stroke-width="2" stroke-dasharray="5 4"/><g stroke="${muted}" opacity=".65"><path d="M102 20v68"/><path d="M122 20v68"/><path d="M142 20v68"/><path d="M94 30h58"/><path d="M94 50h58"/><path d="M94 70h58"/></g><path d="M80 50h17" stroke="${amber}" stroke-width="4" stroke-linecap="round"/><path d="m92 44 8 6-8 6" fill="none" stroke="${amber}" stroke-width="3"/>`,
      quality:`<rect x="18" y="18" width="124" height="68" rx="12" fill="#fff" stroke="${muted}" stroke-width="2"/><path d="M32 68 50 54l16 7 18-27 18 15 20-10" fill="none" stroke="${blue}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="m104 69 8 8 17-20" fill="none" stroke="${green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="84" cy="34" r="4" fill="${amber}"/>`,
      check:`<rect x="28" y="17" width="103" height="73" rx="12" fill="#fff" stroke="${blue}" stroke-width="3"/><g fill="none" stroke="${muted}" stroke-width="3"><rect x="42" y="31" width="12" height="12" rx="2"/><rect x="42" y="51" width="12" height="12" rx="2"/><rect x="42" y="71" width="12" height="12" rx="2"/></g><g stroke="${ink}" stroke-width="3" stroke-linecap="round"><path d="M65 37h48"/><path d="M65 57h39"/><path d="M65 77h31"/></g><path d="m42 56 5 5 10-13" fill="none" stroke="${green}" stroke-width="4"/>`,
      infiltration:`<path d="M18 36h124" stroke="${green}" stroke-width="5"/><path d="M18 54h124M18 74h124" stroke="${amber}" stroke-width="2" stroke-dasharray="6 5"/><g stroke="${blue}" stroke-width="4" stroke-linecap="round"><path d="M42 17v42"/><path d="M79 17v52"/><path d="M116 17v34"/></g><path d="m36 52 6 8 6-8m25 10 6 8 6-8m25-18 6 8 6-8" fill="none" stroke="${blue}" stroke-width="3"/><path d="M24 82c24-12 39 8 58-2 22-12 34 5 54-5" fill="none" stroke="${teal}" stroke-width="3"/>`,
      hydrology:`<path d="M17 22h126v66H17z" fill="#fff" stroke="${muted}" stroke-width="2"/><path d="M17 43h126M17 65h126" stroke="${amber}" stroke-width="2"/><path d="M36 26c-8 14-8 21 0 28 8-7 8-14 0-28Z" fill="${cyan}"/><path d="M30 69c14-7 25 10 39 2s25-7 38 1 21 0 29-5" fill="none" stroke="${blue}" stroke-width="4"/><path d="M88 29c14 6 18 18 16 31" fill="none" stroke="${green}" stroke-width="4"/>`,
      timeline:`<path d="M18 55h124" stroke="${muted}" stroke-width="4"/><g fill="#fff" stroke="${blue}" stroke-width="3"><circle cx="28" cy="55" r="8"/><circle cx="66" cy="55" r="8"/><circle cx="104" cy="55" r="8"/><circle cx="140" cy="55" r="8"/></g><path d="M28 33c10 0 11-13 21-13s11 13 21 13 11-13 21-13 11 13 21 13" fill="none" stroke="${teal}" stroke-width="4"/><path d="M28 76h112" stroke="${amber}" stroke-width="3" stroke-dasharray="7 5"/>`,
      et:`<circle cx="118" cy="26" r="13" fill="#ffe3a5" stroke="${amber}" stroke-width="3"/><path d="M20 79h120" stroke="${green}" stroke-width="5"/><path d="M80 78V42" stroke="${green}" stroke-width="5"/><path d="M80 49c-18-18-34-8-37 5 14 3 27-1 37-5Zm0 8c18-18 34-8 37 5-14 3-27-1-37-5Z" fill="#d9f0dc" stroke="${green}" stroke-width="2"/><g fill="none" stroke="${cyan}" stroke-width="3" stroke-linecap="round"><path d="M70 36c-5-10 4-13 0-22"/><path d="M87 36c5-10-4-13 0-22"/></g>`,
      snow:`<path d="M19 75 48 39l22 23 20-35 23 31 28-17v42H19Z" fill="#dceef7" stroke="${muted}" stroke-width="2"/><path d="m48 39 9 7 7-2m26-17 10 12 9-3" fill="none" stroke="#fff" stroke-width="5"/><g stroke="${cyan}" stroke-width="2"><path d="M27 20v14m-7-7h14m-10-5 7 10m0-10-7 10"/><path d="M129 15v14m-7-7h14m-10-5 7 10m0-10-7 10"/></g><path d="M82 67c7 6 7 13 0 19-7-6-7-13 0-19Z" fill="${blue}"/>`,
      loop:`<path d="M42 29c22-18 58-16 77 3" fill="none" stroke="${blue}" stroke-width="5" stroke-linecap="round"/><path d="m112 22 10 12-15 3" fill="none" stroke="${blue}" stroke-width="4"/><path d="M118 76c-22 18-58 16-77-3" fill="none" stroke="${teal}" stroke-width="5" stroke-linecap="round"/><path d="m48 83-10-12 15-3" fill="none" stroke="${teal}" stroke-width="4"/><rect x="54" y="39" width="52" height="27" rx="8" fill="#fff" stroke="${amber}" stroke-width="3"/><path d="M67 52h26" stroke="${ink}" stroke-width="3"/>`,
      restart:`<path d="M36 25h67a20 20 0 0 1 0 40H76" fill="none" stroke="${blue}" stroke-width="5"/><path d="m83 55-12 10 12 10" fill="none" stroke="${blue}" stroke-width="4"/><rect x="28" y="56" width="48" height="30" rx="8" fill="#fff" stroke="${teal}" stroke-width="3"/><path d="M40 68h24m-24 8h15" stroke="${muted}" stroke-width="3"/>`,
      groundwater:`<path d="M16 36h128" stroke="${green}" stroke-width="5"/><path d="M16 55h128M16 76h128" stroke="${amber}" stroke-width="2" stroke-dasharray="6 5"/><path d="M28 82c16-14 31 9 47-2 17-12 32 8 51-4" fill="none" stroke="${blue}" stroke-width="5"/><path d="M82 23v46" stroke="${cyan}" stroke-width="4"/><path d="m75 60 7 10 7-10" fill="none" stroke="${cyan}" stroke-width="3"/>`,
      slope:`<path d="M18 78 68 30l74 48" fill="#e2f0e5" stroke="${green}" stroke-width="3"/><path d="M68 30 97 78" stroke="${amber}" stroke-width="5"/><path d="M30 69 61 40" stroke="${blue}" stroke-width="5"/><path d="m55 39 8-1-1 8m28 25 8 3-5 7" fill="none" stroke="${blue}" stroke-width="3"/>`,
      terrain:`<path d="M15 80 42 47l22 16 26-37 20 25 34-22v51Z" fill="#dff2e2" stroke="${green}" stroke-width="3"/><path d="M18 73c24-17 37 9 58-7s36 7 62-13" fill="none" stroke="${blue}" stroke-width="5"/><g stroke="${muted}" opacity=".6"><path d="M31 29v58M58 20v68M85 18v69M112 16v71M139 20v67"/></g>`,
      river:`<path d="M15 24c28 0 31 19 51 22 24 4 22-22 48-16 16 4 16 24 31 29" fill="none" stroke="${blue}" stroke-width="12" stroke-linecap="round"/><path d="M16 86c25-10 44-13 62-5 22 10 45 5 67-7" fill="none" stroke="${green}" stroke-width="5"/><g fill="#fff" stroke="${ink}" stroke-width="2"><circle cx="49" cy="42" r="6"/><circle cx="84" cy="42" r="6"/><circle cx="121" cy="36" r="6"/></g>`,
      audit:`<path d="M23 81h114" stroke="${muted}" stroke-width="3"/><rect x="31" y="48" width="20" height="33" rx="4" fill="#d8eef9" stroke="${blue}" stroke-width="3"/><rect x="63" y="32" width="20" height="49" rx="4" fill="#e0f3e9" stroke="${teal}" stroke-width="3"/><rect x="95" y="57" width="20" height="24" rx="4" fill="#fff0d3" stroke="${amber}" stroke-width="3"/><path d="M28 25c20-11 38 8 55-2 18-10 32 3 49-5" fill="none" stroke="${blue}" stroke-width="4"/><path d="m118 20 12-3-5 11" fill="none" stroke="${blue}" stroke-width="3"/>`,
      exchange:`<path d="M20 31h45v45H20zM95 31h45v45H95z" fill="#fff" stroke="${blue}" stroke-width="3"/><path d="M65 45h30m0 17H65" stroke="${amber}" stroke-width="4"/><path d="m87 39 8 6-8 6m-14 5-8 6 8 6" fill="none" stroke="${amber}" stroke-width="3"/><path d="M25 61c12-12 23 8 35-2m40-10c12-12 23 8 35-2" fill="none" stroke="${cyan}" stroke-width="4"/>`,
      report:`<rect x="27" y="13" width="106" height="79" rx="12" fill="#fff" stroke="${blue}" stroke-width="3"/><path d="M42 31h46m-46 13h76m-76 13h76" stroke="${muted}" stroke-width="3" stroke-linecap="round"/><rect x="42" y="68" width="18" height="12" fill="#d8eef9"/><rect x="67" y="62" width="18" height="18" fill="#dff2e5"/><rect x="92" y="53" width="18" height="27" fill="#ffecc6"/>`,
      calibration:`<path d="M20 76h120M25 22v58" stroke="${muted}" stroke-width="3"/><path d="M30 67c18-34 34 0 48-26 14-27 28 11 55-18" fill="none" stroke="${blue}" stroke-width="4"/><path d="M30 73c21-27 33-8 51-19 19-12 28 0 52-19" fill="none" stroke="${amber}" stroke-width="3" stroke-dasharray="6 5"/><circle cx="105" cy="42" r="8" fill="#fff" stroke="${green}" stroke-width="4"/>`,
      network:`<g fill="#fff" stroke="${blue}" stroke-width="3"><circle cx="27" cy="26" r="8"/><circle cx="73" cy="29" r="8"/><circle cx="47" cy="77" r="8"/><circle cx="115" cy="70" r="8"/><circle cx="137" cy="29" r="8"/></g><g stroke="${muted}" stroke-width="3"><path d="M35 27 65 29M31 34l12 35m10 6 54-4m14-8 12-26M81 33l28 31"/></g>`,
      structure:`<path d="M18 74h124" stroke="${blue}" stroke-width="10"/><path d="M52 31v53m56-53v53" stroke="${ink}" stroke-width="9"/><path d="M52 42h56" stroke="${ink}" stroke-width="7"/><path d="M62 55h36v29H62z" fill="#fff" stroke="${amber}" stroke-width="3"/>`,
      dam:`<path d="M15 76c27-5 34-32 62-32h68v37H15Z" fill="#dceff9"/><path d="M79 24v61" stroke="${ink}" stroke-width="12"/><path d="M89 55h42" stroke="${blue}" stroke-width="5"/><path d="m124 48 10 7-10 7" fill="none" stroke="${blue}" stroke-width="4"/><path d="M26 66c18-7 30 8 48 1" fill="none" stroke="${cyan}" stroke-width="4"/>`,
      flood:`<g stroke="${muted}" opacity=".55"><path d="M20 17v70M45 17v70M70 17v70M95 17v70M120 17v70M145 17v70"/><path d="M15 27h135M15 52h135M15 77h135"/></g><path d="M18 72c22-29 43-17 58-3 14 13 29-27 49-12 10 7 12 17 23 19v11H18Z" fill="#71c9ef" opacity=".7" stroke="${blue}" stroke-width="3"/>`,
      grid:`<g fill="none" stroke="${muted}" stroke-width="2"><rect x="24" y="19" width="112" height="68" rx="8"/><path d="M52 19v68M80 19v68M108 19v68M24 42h112M24 64h112"/></g><rect x="80" y="42" width="28" height="22" fill="#d8eef9" stroke="${blue}" stroke-width="3"/><rect x="108" y="19" width="28" height="23" fill="#dff2e5" stroke="${green}" stroke-width="3"/>`,
      sediment:`<path d="M17 73c23-15 35 8 53-4 20-14 38 6 72-12" fill="none" stroke="${blue}" stroke-width="8"/><g fill="${amber}"><circle cx="39" cy="64" r="4"/><circle cx="58" cy="72" r="5"/><circle cx="85" cy="64" r="4"/><circle cx="112" cy="61" r="5"/><circle cx="132" cy="53" r="4"/></g><path d="M26 29h93" stroke="${green}" stroke-width="5"/><path d="m112 22 12 7-12 7" fill="none" stroke="${green}" stroke-width="4"/>`,
      tracer:`<path d="M20 80h120M24 20v60" stroke="${muted}" stroke-width="3"/><path d="M28 77c16-2 24-4 32-19 12-25 20-36 30-20 12 19 16 31 45 37" fill="none" stroke="${violet}" stroke-width="5"/><circle cx="91" cy="38" r="6" fill="#fff" stroke="${violet}" stroke-width="3"/>`,
      parallel:`<g fill="#fff" stroke="${blue}" stroke-width="3"><rect x="18" y="20" width="33" height="28" rx="6"/><rect x="63" y="20" width="33" height="28" rx="6"/><rect x="108" y="20" width="33" height="28" rx="6"/><rect x="41" y="62" width="33" height="28" rx="6"/><rect x="86" y="62" width="33" height="28" rx="6"/></g><g stroke="${amber}" stroke-width="3"><path d="M51 34h12m33 0h12M65 49v13m30-13v13"/></g>`,
      data:`<ellipse cx="80" cy="26" rx="45" ry="13" fill="#fff" stroke="${blue}" stroke-width="3"/><path d="M35 26v48c0 17 90 17 90 0V26" fill="#fff" stroke="${blue}" stroke-width="3"/><path d="M35 50c0 17 90 17 90 0m-90 22c0 17 90 17 90 0" fill="none" stroke="${muted}" stroke-width="2"/><path d="M131 48h18m-7-7 8 7-8 7" fill="none" stroke="${teal}" stroke-width="4"/>`,
      viewer:`<rect x="17" y="15" width="126" height="78" rx="12" fill="#fff" stroke="${blue}" stroke-width="3"/><rect x="27" y="26" width="62" height="55" rx="6" fill="#e7f4fb"/><path d="M30 68c14-19 27 5 39-8 8-9 12-20 18-25" fill="none" stroke="${blue}" stroke-width="4"/><path d="M98 34h31M98 48h24M98 62h31M98 76h18" stroke="${muted}" stroke-width="3" stroke-linecap="round"/>`,
      input:`<rect x="18" y="15" width="124" height="78" rx="12" fill="#fff" stroke="${blue}" stroke-width="3"/><path d="M29 31h102M29 49h102M29 67h102" stroke="${muted}" stroke-width="2"/><g fill="#d9eef8" stroke="${blue}" stroke-width="2"><rect x="34" y="25" width="26" height="12" rx="3"/><rect x="34" y="43" width="42" height="12" rx="3"/><rect x="34" y="61" width="56" height="12" rx="3"/></g><path d="m111 70 7 7 13-17" fill="none" stroke="${green}" stroke-width="4"/>`,
      viewer1d:`<rect x="14" y="14" width="132" height="78" rx="12" fill="#fff" stroke="${blue}" stroke-width="3"/><path d="M25 68c15-8 28-4 39-18 13-17 25 8 40-3 13-10 19-17 31-8" fill="none" stroke="${blue}" stroke-width="4"/><path d="M25 77h110" stroke="${muted}" stroke-width="2"/><path d="M42 28h75" stroke="${amber}" stroke-width="3" stroke-dasharray="6 4"/><path d="M83 22v60" stroke="${teal}" stroke-width="3"/>`,
      estuary:`<path d="M18 28h124v54H18Z" fill="#dfeff7" stroke="${blue}" stroke-width="3"/><path d="M18 50c28-8 41 11 64 0s33 4 60-5" fill="none" stroke="${cyan}" stroke-width="4"/><path d="M56 28v54M96 28v54" stroke="${muted}" stroke-width="2" stroke-dasharray="5 4"/><path d="M29 70h101" stroke="${violet}" stroke-width="5" opacity=".65"/>`
    };
    return svg(base[type]||base.check,label);
  }

  function programType(card){
    const role=card.dataset.programRole||'';
    if(role==='core')return 'hydrology';
    if(role==='authoring')return 'input';
    if(role==='floodviewer')return 'viewer';
    if(role==='geometry')return 'terrain';
    if(role==='output')return 'data';
    if(role==='viewer1d')return 'viewer1d';
    if(role==='research')return 'estuary';
    const h=card.querySelector('h3')?.textContent||'';
    if(/InputStudio/i.test(h))return 'input';
    if(/FloodViewer/i.test(h))return 'viewer';
    if(/ChannelBed/i.test(h))return 'terrain';
    if(/NetCDF|출력|output/i.test(h))return 'data';
    if(/1차원|1D/.test(h))return 'viewer1d';
    if(/Estuary/i.test(h))return 'estuary';
    return 'hydrology';
  }

  function loadCss(){
    return new Promise(resolve=>{
      if(document.querySelector('link[data-kdrum-experience-v3]')){resolve();return;}
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href=assetBase+'experience-v3.css';
      link.dataset.kdrumExperienceV3='1';
      let done=false;
      const finish=()=>{if(done)return;done=true;resolve();};
      link.addEventListener('load',finish,{once:true});
      link.addEventListener('error',finish,{once:true});
      document.head.appendChild(link);
      setTimeout(finish,2500);
    });
  }

  function enhanceNav(){
    const nav=document.querySelector('.nav');
    if(!nav||nav.dataset.ev3Nav==='1')return;
    const language=nav.querySelector('.language');
    for(const child of [...nav.children])if(child!==language)child.remove();
    for(const [label,href] of copy.nav){
      const a=document.createElement('a');
      a.href=href;
      a.textContent=label;
      if(href==='#references')a.className='ev3-nav-cta';
      nav.insertBefore(a,language||null);
    }
    nav.dataset.ev3Nav='1';
  }

  function enhanceHero(){
    const hero=document.querySelector('.hero');
    if(!hero||hero.dataset.ev3Hero==='1')return;
    hero.dataset.ev3Hero='1';
    hero.classList.add('ev3-hero');
    const actions=hero.querySelector('.actions');
    if(actions){
      actions.innerHTML=ko?
        `<a class="button primary ev3-primary-action" href="${MYWATER}">MyWater에서 무료 다운로드</a><a class="button ev3-secondary-action" href="#capabilities">주요 기능 살펴보기</a><a class="ev3-inline-action" href="#results">결과 개념도 보기 →</a>`:
        `<a class="button primary ev3-primary-action" href="${MYWATER}">Download free from MyWater</a><a class="button ev3-secondary-action" href="#capabilities">Explore capabilities</a><a class="ev3-inline-action" href="#results">See result concepts →</a>`;
    }
    const supporting=hero.querySelector('.supporting');
    if(supporting&&!hero.querySelector('.ev3-proof-list')){
      const proof=document.createElement('div');
      proof.className='ev3-proof-list';
      const values=ko?['K-water 개발','물리적 기반','격자단위 분포형','연속·홍수사상 모의','하천수리·범람 확장']:['Developed by K-water','Physically based','Grid-unit distributed','Continuous & event simulation','River and flood extensions'];
      proof.innerHTML=values.map(x=>`<span>${esc(x)}</span>`).join('');
      supporting.after(proof);
    }
    const visual=hero.querySelector('.hero-visual');
    if(visual&&!visual.querySelector('figcaption')){
      const cap=document.createElement('figcaption');
      cap.textContent=ko?'유역 격자와 하천망을 함께 표현한 K-DRUM 개념 이미지':'Concept view of watershed grids and the river network';
      visual.appendChild(cap);
    }
  }

  function buildOutcomes(){
    if(document.getElementById('outcomes'))return;
    const cap=document.getElementById('capabilities');
    const main=document.querySelector('main');
    if(!cap||!main)return;
    const items=ko?[
      ['유역 유출과 수문곡선','강우가 침투·저류·유출로 전환되는 과정을 격자별로 계산합니다.','hydrology'],
      ['하천 수위·유량','유역에서 유입된 유량을 하천망과 수리조건에 따라 추적합니다.','river'],
      ['홍수범람 공간분포','하천과 범람원의 유량교환 및 침수범위를 공간적으로 검토합니다.','flood'],
      ['물수지와 결과보고','강우·저류·유출·손실을 점검하고 실행결과를 보고서로 정리합니다.','audit']
    ]:[
      ['Watershed runoff and hydrographs','Resolve rainfall, infiltration, storage and runoff by computational cell.','hydrology'],
      ['River water levels and discharge','Route watershed inflow through river networks and hydraulic controls.','river'],
      ['Flood-inundation patterns','Review river–floodplain exchange and spatial inundation.','flood'],
      ['Water balance and reporting','Check rainfall, storage, runoff and losses in consolidated results.','audit']
    ];
    const section=document.createElement('section');
    section.id='outcomes';
    section.className='ev3-outcomes';
    section.innerHTML=`<div class="wrap"><div class="ev3-section-heading"><div><span class="ev3-kicker">${ko?'사용자가 얻는 결과':'What users obtain'}</span><h2>${ko?'K-DRUM으로 확인할 수 있는 것':'What K-DRUM helps you understand'}</h2><p>${ko?'기능 목록보다 먼저, 모형을 이용해 어떤 결과를 얻고 무엇을 판단할 수 있는지 보여줍니다.':'Start with the results and decisions the model supports, before the detailed capability inventory.'}</p></div></div><div class="ev3-outcome-grid">${items.map(([title,desc,type])=>`<article class="ev3-outcome-card ev3-static-card"><figure>${conceptSvg(type,title)}</figure><div><span>${ko?'결과 유형':'Result type'}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p></div></article>`).join('')}</div></div>`;
    cap.before(section);
  }

  function buildResults(){
    if(document.getElementById('results'))return;
    const cap=document.getElementById('capabilities');
    if(!cap)return;
    const items=ko?[
      ['공간분포 결과','강우·토양수분·유출·침수심 등을 격자 지도에서 확인하는 개념 예시입니다.','flood'],
      ['수문곡선과 시계열','지점별 유량·수위와 관측값을 시간축에서 비교하는 개념 예시입니다.','calibration'],
      ['물수지 평가표','유입·저류변화·유출·손실을 함께 점검하는 결과보고 개념 예시입니다.','audit'],
      ['1차원 하천수리 결과','종단면·횡단면과 수위·유량 시계열을 조회하는 별도 뷰어 개념 예시입니다.','viewer1d']
    ]:[
      ['Spatial result maps','Concept illustration for gridded rainfall, soil water, runoff and inundation depth.','flood'],
      ['Hydrographs and time series','Concept illustration for comparing simulated and observed discharge or water level.','calibration'],
      ['Water-balance summary','Concept illustration for reviewing inflow, storage change, outflow and losses.','audit'],
      ['1D hydraulic results','Concept illustration for longitudinal/cross-section and water-level/discharge review.','viewer1d']
    ];
    const section=document.createElement('section');
    section.id='results';
    section.className='ev3-results';
    section.innerHTML=`<div class="wrap"><div class="ev3-section-heading ev3-heading-split"><div><span class="ev3-kicker">${ko?'결과 이해':'Understanding results'}</span><h2>${ko?'결과를 이렇게 읽습니다':'How results are reviewed'}</h2><p>${ko?'아래 그림은 특정 유역의 실제 계산값이 아니라, K-DRUM 결과 형식과 활용방식을 설명하는 개념도입니다.':'These are concept illustrations of result types and workflows, not numerical results from a specific basin.'}</p></div><div class="ev3-concept-note">${copy.concept}</div></div><div class="ev3-result-grid">${items.map(([title,desc,type])=>`<figure class="ev3-result-card ev3-static-card"><div class="ev3-result-visual">${conceptSvg(type,title)}</div><figcaption><span>${copy.concept}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p></figcaption></figure>`).join('')}</div></div>`;
    cap.after(section);
  }

  function enhanceCapabilities(){
    const cap=document.getElementById('capabilities');
    if(!cap)return;
    cap.classList.add('ev3-capabilities');
    const head=cap.querySelector('.catlas-head');
    if(head&&!head.querySelector('.ev3-click-hint')){
      const hint=document.createElement('div');
      hint.className='ev3-click-hint';
      hint.innerHTML=`<span aria-hidden="true">↗</span><p>${copy.clickHint}</p>`;
      head.appendChild(hint);
    }
    for(const tab of cap.querySelectorAll('.catlas-tab')){
      if(tab.querySelector('.ev3-tab-mark'))continue;
      const mark=document.createElement('span');
      mark.className='ev3-tab-mark';
      mark.setAttribute('aria-hidden','true');
      mark.innerHTML=conceptSvg(groupType[tab.dataset.group]||'check','');
      tab.prepend(mark);
    }
    const active=cap.querySelector('.catlas-tab[aria-selected="true"]')?.dataset.group||'forcing';
    cap.dataset.activeGroup=active;
    cap.classList.add('capability-design-v2');
    const groupVisual=cap.querySelector('.catlas-group-visual');
    if(groupVisual){
      groupVisual.classList.add('ev3-group-concept');
      groupVisual.innerHTML=conceptSvg(groupType[active]||'check',cap.querySelector('.catlas-group-head h3')?.textContent||'');
    }
    for(const card of cap.querySelectorAll('.catlas-card')){
      card.classList.add('ev3-interactive-card');
      const title=card.querySelector('h4')?.textContent.trim()||'';
      if(!card.querySelector('.ev3-card-visual')){
        const visual=document.createElement('div');
        visual.className='ev3-card-visual';
        visual.dataset.conceptImage='1';
        visual.innerHTML=conceptSvg(itemType[card.dataset.id]||groupType[active]||'check',title);
        card.prepend(visual);
      }
      if(!card.querySelector('.catlas-symbol')){
        const code=document.createElement('span');
        code.className='catlas-symbol';
        code.setAttribute('aria-hidden','true');
        code.textContent=symbolCode[card.dataset.id]||'K';
        card.appendChild(code);
      }
      if(!card.querySelector('.ev3-card-action')){
        const action=document.createElement('span');
        action.className='ev3-card-action';
        action.innerHTML=`${copy.details}<b aria-hidden="true">→</b>`;
        card.appendChild(action);
      }
      card.setAttribute('aria-label',ko?`${title} 상세 설명 열기`:`Open details for ${title}`);
    }
  }

  function enhanceArchitecture(){
    const section=document.getElementById('architecture');
    if(!section)return;
    section.classList.add('ev3-architecture','architecture-design-v2');
    const wrap=section.querySelector('.wrap');
    if(wrap&&!wrap.querySelector('.ev3-workflow-visual')){
      const visual=document.createElement('figure');
      visual.className='ev3-workflow-visual ev3-static-card';
      visual.innerHTML=`${conceptSvg('exchange',ko?'강우에서 결과분석까지 이어지는 모형 흐름':'Model workflow from rainfall to result review')}<figcaption><span>${copy.concept}</span><strong>${ko?'입력자료 → 유역수문 → 하천수리 → 홍수범람 → 결과분석':'Inputs → watershed hydrology → river hydraulics → floodplain → result review'}</strong></figcaption>`;
      const architecture=wrap.querySelector('.architecture');
      if(architecture)architecture.before(visual);
    }
  }

  function enhanceResearch(){
    const section=document.getElementById('research');
    if(!section)return;
    section.classList.add('ev3-research','research-design-v2');
    const cards=section.querySelectorAll('.grid3 .card');
    const types=['rain','timeline','audit','parallel','groundwater','terrain'];
    cards.forEach((card,i)=>{
      card.classList.add('ev3-static-card','ev3-research-card');
      if(!card.querySelector('.ev3-research-visual')){
        const title=card.querySelector('h3')?.textContent||'';
        const fig=document.createElement('div');
        fig.className='ev3-research-visual';
        fig.dataset.conceptImage='1';
        fig.innerHTML=conceptSvg(types[i%types.length],title);
        card.prepend(fig);
      }
    });
  }

  function enhancePlatform(){
    const section=document.getElementById('platform');
    if(!section)return;
    section.classList.add('ev3-platform','platform-design-v2');
    const grid=section.querySelector('.tool-grid,.grid3,.grid4');
    if(grid)grid.classList.add('program-grid-v2');
    for(const card of section.querySelectorAll('.card')){
      card.classList.add('ev3-static-card','ev3-program-card');
      const title=card.querySelector('h3')?.textContent.trim()||'';
      const meta=programRoles.find(x=>x.match.test(title))||null;
      if(meta){
        card.dataset.programRole=meta.role;
        if(!card.querySelector('.program-role')){
          const role=document.createElement('span');
          role.className='program-role';
          role.textContent=ko?meta.labelKo:meta.labelEn;
          const status=card.querySelector(':scope>.status');
          if(status)status.after(role);else card.prepend(role);
        }
        if(!card.querySelector('.program-code')){
          const code=document.createElement('span');
          code.className='program-code';
          code.setAttribute('aria-hidden','true');
          code.textContent=meta.code;
          card.appendChild(code);
        }
      }
      if(!card.querySelector('.ev3-program-visual')){
        const visualTitle=card.querySelector('h3')?.textContent||'';
        const fig=document.createElement('figure');
        fig.className='ev3-program-visual';
        fig.dataset.conceptImage='1';
        fig.innerHTML=`${conceptSvg(programType(card),visualTitle)}<figcaption>${copy.program}</figcaption>`;
        const heading=card.querySelector('h3');
        if(heading)heading.before(fig);else card.prepend(fig);
      }
    }
  }

  function enhanceReferences(){
    const section=document.getElementById('references');
    if(!section)return;
    section.classList.add('ev3-references','references-design-v2');
    for(const link of section.querySelectorAll('.link-card')){
      link.classList.add('ev3-resource-link');
      if(!link.querySelector('.ev3-link-action')){
        const action=document.createElement('span');
        action.className='ev3-link-action';
        action.innerHTML=`${copy.resource}<b aria-hidden="true">↗</b>`;
        link.appendChild(action);
      }
    }
    const official=section.querySelector('.official');
    if(official){
      official.classList.add('ev3-download-panel','mywater-callout-v2');
      const badge=official.querySelector('.mywater-link-badge');
      const primary=badge?.closest('a');
      if(primary){
        primary.classList.add('ev3-download-primary');
        primary.href=MYWATER;
        primary.removeAttribute('target');
        primary.innerHTML=ko?'<span><b>MyWater K-Series</b><small>K-DRUM 무료 다운로드 페이지</small></span><strong>확인하기 →</strong>':'<span><b>MyWater K-Series</b><small>K-DRUM free download page</small></span><strong>Open →</strong>';
      }
      const info=official.querySelector(':scope>div');
      if(info&&!info.querySelector('.ev3-download-actions')){
        const actions=document.createElement('div');
        actions.className='ev3-download-actions';
        actions.innerHTML=ko?`<a href="${MYWATER}">K-DRUM 다운로드</a><a href="${TERMS}">이용약관 확인</a>`:`<a href="${MYWATER}">Download K-DRUM</a><a href="${TERMS}">Terms of use</a>`;
        info.appendChild(actions);
      }
    }
  }

  function enhanceDialog(){
    const dialog=document.getElementById('catlas-dialog');
    if(!dialog)return;
    dialog.classList.add('ev3-dialog');
    if(dialog.open){
      const doc=dialog.querySelector('.catlas-doc');
      if(doc){
        doc.textContent=ko?'전체 기능 설명서 보기 ↗':'Open the full capability reference ↗';
        doc.classList.add('ev3-dialog-link');
      }
    }
  }

  function applyAll(){
    document.documentElement.classList.add('ev3-experience');
    document.body.classList.add('ev3-experience');
    enhanceNav();
    enhanceHero();
    buildOutcomes();
    enhanceCapabilities();
    buildResults();
    enhanceArchitecture();
    enhanceResearch();
    enhancePlatform();
    enhanceReferences();
    enhanceDialog();
    document.documentElement.dataset.kdrumExperienceV3='ready';
    document.documentElement.dataset.kdrumDesignSystem='ready';
  }

  function scheduleRefresh(){
    [0,40,120,260].forEach(ms=>setTimeout(applyAll,ms));
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('.catlas-tab,.catlas-card'))scheduleRefresh();
  },true);
  document.addEventListener('keydown',event=>{
    if((event.key==='Enter'||event.key===' ')&&event.target.closest('.catlas-tab,.catlas-card'))scheduleRefresh();
  },true);

  function ready(){
    return document.getElementById('capabilities')&&
      document.documentElement.dataset.kdrumCapabilityAtlas==='ready'&&
      document.documentElement.dataset.kdrumPublicCopy==='ready';
  }

  loadCss().then(()=>{
    if(ready()){applyAll();return;}
    let tries=0;
    const timer=setInterval(()=>{
      tries+=1;
      if(ready()||tries>80){clearInterval(timer);applyAll();}
    },75);
  });
})();
