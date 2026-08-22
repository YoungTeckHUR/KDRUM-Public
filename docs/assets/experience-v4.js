(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const MYWATER='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
  const TERMS='https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127';
  const INSTITUTE='https://www.kwater.or.kr/kiwe/main.do';

  const text=ko?{
    heroEyebrow:'분포형 강우유출 · 하천수리 · 홍수범람해석',
    heroSupport:'강우와 유역 상태에서 하천·범람원 흐름과 결과평가까지 하나의 계산체계로 연결합니다.',
    download:'MyWater에서 무료 다운로드',
    capability:'주요 기능 보기',
    results:'결과 형식 보기',
    tabs:[
      ['overview','개요'],
      ['capabilities','주요 기능'],
      ['results','결과'],
      ['programs','프로그램'],
      ['research','연구·자료'],
      ['download','다운로드']
    ],
    outcomeTitle:'K-DRUM으로 확인하는 결과',
    outcomeIntro:'모형의 세부기능보다 먼저, 사용자가 확인할 수 있는 핵심 결과를 정리했습니다.',
    capabilityTitle:'K-DRUM 주요 기능',
    capabilityIntro:'분야를 선택한 뒤 파란색 ‘상세 설명 열기’를 누르면 계산개념·현재 상태·주의사항이 열립니다.',
    openDetail:'상세 설명 열기',
    resultsTitle:'결과 형식',
    resultsIntro:'아래 그림은 특정 유역의 실제 계산값이 아니라 결과의 형태와 해석방식을 설명하는 모식도입니다.',
    architectureTitle:'해석 흐름',
    architectureIntro:'입력자료에서 유역수문, 하천수리, 홍수범람, 결과분석으로 이어지는 기본 흐름입니다.',
    programsTitle:'해석 및 지원 프로그램',
    programsIntro:'각 카드는 프로그램의 역할과 공개상태를 설명하는 정보카드이며, 선택형 버튼이 아닙니다.',
    researchTitle:'연구 및 적용',
    researchIntro:'공개된 연구주제와 주요 적용분야를 간결하게 정리했습니다.',
    history:'연구 연혁 보기',
    resourcesTitle:'연구자료',
    resourcesIntro:'논문, 기능, 개발현황과 모형 사용범위를 별도 문서에서 확인할 수 있습니다.',
    downloadTitle:'K-DRUM 다운로드',
    downloadBody:'K-water 기술 SW 대국민 개방정책에 따라 K-DRUM은 MyWater K-Series에서 무료로 내려받아 사용할 수 있습니다.',
    downloadAction:'MyWater에서 K-DRUM 다운로드',
    terms:'이용약관 확인',
    institute:'K-water 연구원',
    official:'공식 배포 경로',
    staticLabel:'정보',
    resultNames:['유역 유출과 수문곡선','하천 수위·유량','홍수범람 공간분포','물수지와 결과보고'],
    resultSummaries:[
      '강우·침투·저류·유출의 공간분포와 지점 유량을 확인합니다.',
      '하천망의 수위·유량과 수리조건에 따른 흐름을 확인합니다.',
      '하천–범람원 교환과 침수범위·침수심을 공간적으로 확인합니다.',
      '강우·저류변화·유출·손실을 점검하고 실행결과를 정리합니다.'
    ],
    resultGalleryNames:['공간분포도','수문곡선·시계열','물수지 평가','1차원 하천수리 결과'],
    resultGallerySummaries:[
      '강우·토양수분·유출·침수심 등의 격자분포를 지도에서 확인합니다.',
      '계산값과 관측값의 유량·수위 변화를 시간축에서 비교합니다.',
      '유입, 저장량 변화, 유출과 손실의 균형을 확인합니다.',
      '종단면·횡단면과 수위·유량 시계열을 함께 검토합니다.'
    ]
  }:{
    heroEyebrow:'Distributed rainfall-runoff · river hydraulics · flood inundation',
    heroSupport:'Connect rainfall and watershed states to river/floodplain flow and result evaluation in one workflow.',
    download:'Free download from MyWater',
    capability:'View capabilities',
    results:'View result formats',
    tabs:[
      ['overview','Overview'],
      ['capabilities','Capabilities'],
      ['results','Results'],
      ['programs','Programs'],
      ['research','Research & resources'],
      ['download','Download']
    ],
    outcomeTitle:'What K-DRUM helps you evaluate',
    outcomeIntro:'Start with the main results users can inspect before the detailed capability inventory.',
    capabilityTitle:'K-DRUM capabilities',
    capabilityIntro:'Choose a domain, then use the blue “Open detailed explanation” action to view the process, maturity and cautions.',
    openDetail:'Open detailed explanation',
    resultsTitle:'Result formats',
    resultsIntro:'The diagrams below explain result types and interpretation; they are not numerical outputs from a specific basin.',
    architectureTitle:'Analysis workflow',
    architectureIntro:'The core path runs from forcing data through watershed hydrology, river hydraulics, floodplain flow and result review.',
    programsTitle:'Analysis and support programs',
    programsIntro:'These are informational program-role cards, not selectable action cards.',
    researchTitle:'Research and applications',
    researchIntro:'A concise view of public research themes and application areas.',
    history:'View research timeline',
    resourcesTitle:'Research resources',
    resourcesIntro:'Open separate documents for publications, capabilities, development status and model scope.',
    downloadTitle:'Download K-DRUM',
    downloadBody:'Under K-water’s public-access policy for technical software, K-DRUM is available free of charge through MyWater K-Series.',
    downloadAction:'Download K-DRUM from MyWater',
    terms:'Terms of use',
    institute:'K-water Research Institute',
    official:'Official distribution',
    staticLabel:'Information',
    resultNames:['Watershed runoff & hydrographs','River stage & discharge','Flood-inundation patterns','Water balance & reporting'],
    resultSummaries:[
      'Inspect spatial rainfall, infiltration, storage and runoff with point discharge.',
      'Inspect stage and discharge through the river network under hydraulic controls.',
      'Inspect river–floodplain exchange, inundation extent and depth.',
      'Check rainfall, storage change, runoff and losses in the run summary.'
    ],
    resultGalleryNames:['Spatial maps','Hydrographs & time series','Water-balance review','1D hydraulic results'],
    resultGallerySummaries:[
      'Map gridded rainfall, soil water, runoff and inundation depth.',
      'Compare simulated and observed discharge or water level through time.',
      'Review inflow, storage change, outflow and losses as one balance.',
      'Review longitudinal/cross-section results with stage/discharge time series.'
    ]
  };

  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const svg=(body,label,type)=>`<svg viewBox="0 0 320 180" role="img" aria-label="${esc(label)}" data-diagram="${esc(type)}" focusable="false"><rect x="1" y="1" width="318" height="178" rx="18" fill="#f3f8fb" stroke="#bfd4e0"/>${body}</svg>`;
  const c={blue:'#0069b4',cyan:'#17a7d1',teal:'#148b77',green:'#4c9960',amber:'#bd7414',violet:'#6559b5',ink:'#17364d',muted:'#7d9bad',line:'#bfd4e0',soft:'#e4f0f6',water:'#cfeefa',soil:'#ead8bd',red:'#b34b4b'};

  function diagram(type,label=''){
    const common={
      runoff:`
        <g stroke="${c.line}" stroke-width="1"><path d="M26 34h118v92H26z"/><path d="M55 34v92M84 34v92M113 34v92M26 57h118M26 80h118M26 103h118"/></g>
        <path d="M35 44c18-20 48-13 58 2 20-10 45 4 45 23" fill="none" stroke="${c.muted}" stroke-width="3"/>
        <g stroke="${c.cyan}" stroke-width="3" stroke-linecap="round"><path d="M45 28l-4 12"/><path d="M72 23l-4 12"/><path d="M101 26l-4 12"/><path d="M128 21l-4 12"/></g>
        <path d="M31 112c22-16 34 8 50-4 17-12 27 7 46-5 7-4 12-5 17-5" fill="none" stroke="${c.blue}" stroke-width="5" stroke-linecap="round"/>
        <path d="M176 138h118M176 35v103" fill="none" stroke="${c.muted}" stroke-width="2"/>
        <path d="M180 125c24-2 35-4 49-24 11-16 15-45 31-31 11 9 10 37 30 44" fill="none" stroke="${c.blue}" stroke-width="5" stroke-linecap="round"/>
        <path d="M180 120c35-7 48-17 60-32 14-17 31-8 50 23" fill="none" stroke="${c.teal}" stroke-width="2.5" stroke-dasharray="6 4"/>`,
      river:`
        <path d="M24 116c54-40 86 14 129-24 47-42 83 21 143-25" fill="none" stroke="${c.blue}" stroke-width="13" stroke-linecap="round"/>
        <path d="M24 91c54-40 86 14 129-24 47-42 83 21 143-25" fill="none" stroke="${c.muted}" stroke-width="2" stroke-dasharray="5 5"/>
        <g fill="#fff" stroke="${c.blue}" stroke-width="3"><circle cx="65" cy="89" r="8"/><circle cx="151" cy="76" r="8"/><circle cx="245" cy="68" r="8"/></g>
        <g stroke="${c.ink}" stroke-width="2"><path d="M65 47v33"/><path d="M151 34v33"/><path d="M245 27v32"/></g>
        <g fill="${c.ink}" font-size="12" font-weight="700"><text x="51" y="40">H,Q</text><text x="137" y="28">H,Q</text><text x="231" y="21">H,Q</text></g>
        <path d="M31 151h258" stroke="${c.line}" stroke-width="2"/><path d="M36 151c30-2 48-18 70-11 26 9 38-24 67-19 34 6 44-25 91-14" fill="none" stroke="${c.teal}" stroke-width="4"/>`,
      flood:`
        <g stroke="${c.line}" stroke-width="1"><path d="M23 28h274v124H23z"/><path d="M68 28v124M113 28v124M158 28v124M203 28v124M248 28v124M23 59h274M23 90h274M23 121h274"/></g>
        <path d="M31 102c52-47 78-2 121-34 46-35 76 16 138-24" fill="none" stroke="${c.blue}" stroke-width="9" stroke-linecap="round"/>
        <path d="M64 125c23-28 52-29 72-8 18 19 49 18 68-4 22-26 49-17 66-1v27H64z" fill="${c.water}" opacity=".9" stroke="${c.cyan}" stroke-width="2"/>
        <g><rect x="245" y="32" width="14" height="15" fill="#d8f3f8"/><rect x="245" y="47" width="14" height="15" fill="#8fd4e7"/><rect x="245" y="62" width="14" height="15" fill="#2fa6d3"/><rect x="245" y="77" width="14" height="15" fill="#0069b4"/><text x="266" y="45" fill="${c.ink}" font-size="10">depth</text></g>`,
      balance:`
        <path d="M45 26v56" stroke="${c.cyan}" stroke-width="6" stroke-linecap="round"/><path d="m35 68 10 14 10-14" fill="none" stroke="${c.cyan}" stroke-width="5"/>
        <rect x="86" y="49" width="145" height="78" rx="15" fill="#fff" stroke="${c.blue}" stroke-width="3"/>
        <text x="158" y="82" text-anchor="middle" fill="${c.ink}" font-size="20" font-weight="800">ΔS</text>
        <text x="158" y="105" text-anchor="middle" fill="${c.muted}" font-size="11">soil · snow · deep storage</text>
        <path d="M231 76h55" stroke="${c.blue}" stroke-width="6" stroke-linecap="round"/><path d="m275 66 13 10-13 10" fill="none" stroke="${c.blue}" stroke-width="5"/>
        <path d="M158 127v34" stroke="${c.amber}" stroke-width="6" stroke-linecap="round"/><path d="m148 150 10 13 10-13" fill="none" stroke="${c.amber}" stroke-width="5"/>
        <g fill="${c.ink}" font-size="12" font-weight="700"><text x="34" y="22">P</text><text x="276" y="62">Q</text><text x="171" y="158">ET / loss</text></g>
        <text x="35" y="155" fill="${c.ink}" font-size="13" font-weight="700">P = Q + ET + ΔS</text>`,
      spatial:`
        <g stroke="#fff" stroke-width="2">${[0,1,2,3,4].map(r=>[0,1,2,3,4,5].map((q,i)=>{const x=22+i*40,y=25+r*27;const fills=['#e8f6fa','#bfe7f2','#86d0e3','#39a9d2','#0878c9'];return `<rect x="${x}" y="${y}" width="40" height="27" fill="${fills[(r+i)%fills.length]}"/>`}).join('')).join('')}</g>
        <path d="M35 133c38-32 69 13 101-21 38-40 67 19 119-28" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <g><rect x="260" y="35" width="12" height="18" fill="#e8f6fa"/><rect x="260" y="53" width="12" height="18" fill="#bfe7f2"/><rect x="260" y="71" width="12" height="18" fill="#86d0e3"/><rect x="260" y="89" width="12" height="18" fill="#39a9d2"/><rect x="260" y="107" width="12" height="18" fill="#0878c9"/></g>`,
      hydrograph:`
        <path d="M40 145h245M40 25v120" stroke="${c.muted}" stroke-width="2"/>
        <path d="M43 132c25-1 38-5 57-19 21-16 31-70 56-72 20-2 24 58 49 68 26 10 42-2 75 11" fill="none" stroke="${c.blue}" stroke-width="5" stroke-linecap="round"/>
        <path d="M43 136c25-5 40-11 58-26 20-17 34-54 55-58 22-4 27 50 48 61 27 14 47 6 76 14" fill="none" stroke="${c.teal}" stroke-width="3" stroke-dasharray="7 5"/>
        <circle cx="156" cy="41" r="5" fill="${c.blue}"/><path d="M156 34v-13" stroke="${c.ink}" stroke-width="2"/><text x="164" y="25" fill="${c.ink}" font-size="11">peak</text>
        <g fill="${c.ink}" font-size="11"><text x="12" y="33">Q/H</text><text x="273" y="162">t</text><text x="210" y="36">simulated</text><text x="210" y="52">observed</text></g>`,
      balanceReview:`
        <rect x="24" y="22" width="272" height="136" rx="13" fill="#fff" stroke="${c.line}" stroke-width="2"/>
        <g fill="${c.ink}" font-size="12" font-weight="700"><text x="43" y="48">P</text><text x="43" y="73">Q</text><text x="43" y="98">ET</text><text x="43" y="123">ΔS</text></g>
        <g><rect x="75" y="37" width="165" height="12" rx="6" fill="#dceff7"/><rect x="75" y="62" width="118" height="12" rx="6" fill="${c.blue}"/><rect x="75" y="87" width="72" height="12" rx="6" fill="${c.amber}"/><rect x="75" y="112" width="48" height="12" rx="6" fill="${c.teal}"/></g>
        <path d="M248 44h28v80h-28" fill="none" stroke="${c.green}" stroke-width="4"/><path d="m258 116 8 8 14-17" fill="none" stroke="${c.green}" stroke-width="4" stroke-linecap="round"/>`,
      viewer1d:`
        <rect x="18" y="20" width="178" height="65" rx="8" fill="#fff" stroke="${c.line}" stroke-width="2"/>
        <path d="M27 72c34-32 56-20 81-39 30-22 48 12 78-5" fill="none" stroke="${c.muted}" stroke-width="3"/>
        <path d="M27 60c34-21 56-10 81-24 30-17 48 12 78 2" fill="none" stroke="${c.blue}" stroke-width="4"/>
        <rect x="205" y="20" width="97" height="65" rx="8" fill="#fff" stroke="${c.line}" stroke-width="2"/>
        <path d="M218 71c15-38 26-38 37 0 12-31 24-33 35 0" fill="none" stroke="${c.ink}" stroke-width="3"/><path d="M215 56h75" stroke="${c.blue}" stroke-width="4"/>
        <rect x="18" y="96" width="284" height="62" rx="8" fill="#fff" stroke="${c.line}" stroke-width="2"/>
        <path d="M30 145h256M30 107v38" stroke="${c.muted}" stroke-width="1.5"/><path d="M34 140c28-1 42-4 61-23 21-22 35-2 57 9 29 14 48-10 76-13 24-2 36 15 53 17" fill="none" stroke="${c.blue}" stroke-width="4"/>`,
      engine:`
        <rect x="66" y="35" width="188" height="110" rx="15" fill="#fff" stroke="${c.blue}" stroke-width="3"/>
        <g fill="${c.soft}" stroke="${c.line}"><rect x="88" y="58" width="44" height="30" rx="5"/><rect x="138" y="58" width="44" height="30" rx="5"/><rect x="188" y="58" width="44" height="30" rx="5"/><rect x="88" y="96" width="44" height="30" rx="5"/><rect x="138" y="96" width="44" height="30" rx="5"/><rect x="188" y="96" width="44" height="30" rx="5"/></g>
        <path d="M42 72h24M42 108h24M254 90h25" stroke="${c.teal}" stroke-width="5" stroke-linecap="round"/>`,
      input:`
        <path d="M48 42h82l14 16h128v86H48z" fill="#fff" stroke="${c.blue}" stroke-width="3"/>
        <g stroke="${c.line}"><path d="M75 75h55M75 96h92M75 117h73"/><path d="M199 72v54M219 72v54M239 72v54M179 87h80M179 107h80"/></g>
        <path d="m225 122 8 8 16-20" fill="none" stroke="${c.green}" stroke-width="5"/>`,
      viewer:`
        <rect x="35" y="29" width="250" height="118" rx="12" fill="#fff" stroke="${c.blue}" stroke-width="3"/>
        <rect x="49" y="43" width="108" height="88" rx="6" fill="${c.soft}"/><path d="M57 113c28-31 44 1 68-25 12-13 18-15 27-17" fill="none" stroke="${c.blue}" stroke-width="5"/>
        <path d="M174 119h91M174 55v64" stroke="${c.muted}" stroke-width="2"/><path d="M178 111c16-1 27-9 39-25 12-17 25 14 45 8" fill="none" stroke="${c.teal}" stroke-width="4"/>`,
      terrain:`
        <path d="M24 132 80 66l38 35 40-70 46 51 42-33 50 83Z" fill="#dfeee1" stroke="${c.green}" stroke-width="3"/>
        <path d="M24 133c37-27 69 1 95-22 33-30 66 5 98-21 22-18 45-14 79 4" fill="none" stroke="${c.blue}" stroke-width="8"/>
        <path d="M92 144 123 111l28 19 27-22 30 36" fill="none" stroke="${c.ink}" stroke-width="2"/>`,
      netcdf:`
        <path d="M70 25h124l38 38v92H70z" fill="#fff" stroke="${c.blue}" stroke-width="3"/><path d="M194 25v38h38" fill="none" stroke="${c.blue}" stroke-width="3"/>
        <g stroke="${c.line}">${[0,1,2,3].map(r=>[0,1,2,3].map(q=>`<rect x="${96+q*26}" y="${76+r*17}" width="26" height="17" fill="${(r+q)%2?'#e0f0f6':'#c9e6f1'}"/>`).join('')).join('')}</g>
        <text x="151" y="145" text-anchor="middle" fill="${c.ink}" font-size="18" font-weight="800">NC</text>`,
      estuary:`
        <path d="M20 66h280v80H20z" fill="${c.water}"/><path d="M20 66c60 8 110-4 155-18 45-14 82-14 125-6" fill="none" stroke="${c.blue}" stroke-width="4"/>
        <path d="M20 146c62-18 113-23 168-13 43 8 73 3 112-15" fill="none" stroke="${c.ink}" stroke-width="4"/>
        <g stroke="${c.teal}" stroke-width="2"><path d="M80 75v52"/><path d="M145 64v68"/><path d="M210 56v73"/><path d="M270 52v66"/></g>
        <path d="M40 99h235" stroke="${c.violet}" stroke-width="3" stroke-dasharray="7 5"/>`,
      radar:`
        <circle cx="160" cy="90" r="55" fill="none" stroke="${c.cyan}" stroke-width="3"/><circle cx="160" cy="90" r="36" fill="none" stroke="${c.cyan}" stroke-width="3"/><circle cx="160" cy="90" r="17" fill="none" stroke="${c.cyan}" stroke-width="3"/>
        <path d="M160 90 238 47A90 90 0 0 1 248 116Z" fill="${c.water}" opacity=".8"/><path d="M160 90 224 134A80 80 0 0 1 121 156Z" fill="#b7e2ef" opacity=".8"/>
        <path d="M50 135c35-30 62-4 91-30 37-33 69 4 123-22" fill="none" stroke="${c.blue}" stroke-width="5"/>`,
      snow:`
        <path d="M26 142 96 57l42 48 44-78 54 75 57-44v84Z" fill="#dceff7" stroke="${c.muted}" stroke-width="3"/><path d="m96 57 16 18 14-8m56-40 22 30 18-12" fill="none" stroke="#fff" stroke-width="8"/>
        <g stroke="${c.cyan}" stroke-width="3"><path d="M54 30v22m-11-11h22"/><path d="M262 31v22m-11-11h22"/></g><path d="M155 123c12 11 12 23 0 33-12-10-12-22 0-33Z" fill="${c.blue}"/>`,
      parallel:`
        <g stroke="${c.line}">${[0,1,2].map(r=>[0,1,2,3,4].map(q=>`<rect x="${38+q*48}" y="${36+r*34}" width="42" height="28" rx="3" fill="${(r+q)%2?'#e3f1f6':'#c7e4ee'}"/>`).join('')).join('')}</g>
        <path d="M160 25v130" stroke="${c.blue}" stroke-width="4" stroke-dasharray="7 5"/><path d="M60 151h200" stroke="${c.teal}" stroke-width="4"/>
        <g fill="${c.ink}" font-size="11"><text x="65" y="168">rank 0</text><text x="212" y="168">rank 1</text></g>`,
      swgw:`
        <path d="M20 55h280v30H20z" fill="${c.water}"/><path d="M20 85h280v70H20z" fill="${c.soil}"/>
        <path d="M32 70c46-28 85 14 128-16 45-31 81 13 127-18" fill="none" stroke="${c.blue}" stroke-width="6"/>
        <path d="M80 75v54M160 75v64M240 75v49" stroke="${c.teal}" stroke-width="4" stroke-dasharray="7 5"/>
        <path d="m74 117 6 13 6-13m68 9 6 13 6-13m68-14 6 13 6-13" fill="none" stroke="${c.teal}" stroke-width="3"/>`,
      wildfire:`
        <path d="M25 137 94 59l38 46 47-77 49 65 68-38v82Z" fill="#e9dec9" stroke="${c.amber}" stroke-width="3"/>
        <path d="M106 104c-18-23 5-35-3-56 25 13 38 34 24 55 20-13 33 12 16 34h-45c-15-12-11-25 8-33Z" fill="#e7773d" stroke="${c.red}" stroke-width="3"/>
        <g stroke="${c.cyan}" stroke-width="4"><path d="M222 30l-6 18"/><path d="M249 26l-6 18"/><path d="M276 34l-6 18"/></g><path d="M179 132c32-25 57 8 99-19" fill="none" stroke="${c.blue}" stroke-width="6"/>`,
      transport:`
        <path d="M30 105c42-36 73 9 111-21 45-35 80 19 149-27" fill="none" stroke="${c.blue}" stroke-width="11" stroke-linecap="round"/>
        <g fill="${c.amber}">${[0,1,2,3,4,5].map(i=>`<circle cx="${65+i*36}" cy="${94-(i%2)*12}" r="${5+(i%3)}"/>`).join('')}</g>
        <path d="M72 139h177" stroke="${c.muted}" stroke-width="2"/><path d="M75 136c20-1 31-10 47-24 18-16 30-2 46 8 18 12 37-9 75-3" fill="none" stroke="${c.violet}" stroke-width="4"/>`,
      program:`
        <rect x="40" y="31" width="240" height="118" rx="14" fill="#fff" stroke="${c.blue}" stroke-width="3"/>
        <rect x="55" y="46" width="60" height="38" rx="6" fill="${c.soft}"/><rect x="128" y="46" width="137" height="38" rx="6" fill="${c.soft}"/><rect x="55" y="96" width="210" height="38" rx="6" fill="${c.soft}"/>
        <path d="M73 65h26M147 65h78M73 115h128" stroke="${c.teal}" stroke-width="4" stroke-linecap="round"/>`
    };
    return svg(common[type]||common.program,label,type);
  }

  const programType={
    core:'engine',authoring:'input',floodviewer:'viewer',geometry:'terrain',
    output:'netcdf',viewer1d:'viewer1d',research:'estuary'
  };

  function replaceVisual(card,type,label,extraClass=''){
    card.querySelectorAll('.ev4-visual,.ev3-card-visual,.ev3-program-visual,.ev3-research-visual').forEach(node=>node.remove());
    const visual=document.createElement('div');
    visual.className=`ev4-visual ${extraClass}`.trim();
    visual.dataset.conceptImage='1';
    visual.innerHTML=diagram(type,label);
    card.prepend(visual);
    return visual;
  }

  function trimRepeatedLabels(scope){
    if(!scope)return;
    const repeated=new Set(ko?['개념 예시','결과 유형','구성 프로그램','정보']:['Concept illustration','Result type','Program component','Information']);
    scope.querySelectorAll('small,span,p').forEach(node=>{
      if(repeated.has(node.textContent.trim())&&node.children.length===0)node.remove();
    });
  }

  function updateHero(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    hero.classList.add('ev4-hero');
    const eyebrow=hero.querySelector('.eyebrow');
    if(eyebrow)eyebrow.textContent=text.heroEyebrow;
    const supporting=hero.querySelector('.supporting');
    if(supporting)supporting.textContent=text.heroSupport;
    hero.querySelectorAll('.unit-chain,.ev3-hero-facts,.ev3-hero-note').forEach(node=>node.remove());
    let facts=hero.querySelector('.ev4-facts');
    if(!facts){
      facts=document.createElement('div');
      facts.className='ev4-facts';
      const values=ko?['K-water 개발','물리적 기반','격자단위 분포형','연속·홍수사상 모의']:['Developed by K-water','Physically based','Grid-unit distributed','Continuous & event simulation'];
      facts.innerHTML=values.map(value=>`<span>${esc(value)}</span>`).join('');
      supporting?.after(facts);
    }
    const actions=hero.querySelector('.actions');
    if(actions){
      actions.innerHTML=`
        <a class="button primary ev4-download-hero" href="${MYWATER}">${esc(text.download)}</a>
        <a class="button ev4-tab-link" href="#capabilities" data-ev4-tab-link="capabilities">${esc(text.capability)}</a>
        <a class="ev4-inline-link ev4-tab-link" href="#results" data-ev4-tab-link="results">${esc(text.results)} →</a>`;
    }
  }

  function updateHeader(){
    const nav=document.querySelector('.nav');
    if(!nav)return;
    const language=nav.querySelector('.language')?.cloneNode(true);
    nav.innerHTML='';
    const download=document.createElement('a');
    download.className='ev3-nav-cta ev4-header-download';
    download.href=MYWATER;
    download.textContent=ko?'무료 다운로드':'Free download';
    nav.append(download);
    if(language)nav.append(language);
  }

  function updateOutcomes(){
    const section=document.getElementById('outcomes');
    if(!section)return;
    section.classList.add('ev4-section','ev4-outcomes');
    const h=section.querySelector('h2'); if(h)h.textContent=text.outcomeTitle;
    const intro=section.querySelector('.section-intro'); if(intro)intro.textContent=text.outcomeIntro;
    const cards=[...section.querySelectorAll('.ev3-outcome-card,.card')].slice(0,4);
    const types=['runoff','river','flood','balance'];
    cards.forEach((card,index)=>{
      card.classList.add('ev4-static-card');
      card.dataset.static='1';
      replaceVisual(card,types[index],text.resultNames[index]);
      const heading=card.querySelector('h3,h4'); if(heading)heading.textContent=text.resultNames[index];
      const p=card.querySelector('p'); if(p)p.textContent=text.resultSummaries[index];
      card.removeAttribute('tabindex');
      card.removeAttribute('role');
    });
    trimRepeatedLabels(section);
  }

  function updateResults(){
    const section=document.getElementById('results');
    if(!section)return;
    section.classList.add('ev4-section','ev4-results');
    const h=section.querySelector('h2'); if(h)h.textContent=text.resultsTitle;
    const intro=section.querySelector('.section-intro'); if(intro)intro.textContent=text.resultsIntro;
    const cards=[...section.querySelectorAll('.ev3-result-card,.card')].slice(0,4);
    const types=['spatial','hydrograph','balanceReview','viewer1d'];
    cards.forEach((card,index)=>{
      card.classList.add('ev4-static-card');
      card.dataset.static='1';
      replaceVisual(card,types[index],text.resultGalleryNames[index]);
      const heading=card.querySelector('h3,h4'); if(heading)heading.textContent=text.resultGalleryNames[index];
      const p=card.querySelector('p'); if(p)p.textContent=text.resultGallerySummaries[index];
    });
    trimRepeatedLabels(section);
  }

  function updateArchitecture(){
    const section=document.getElementById('architecture');
    if(!section)return;
    section.classList.add('ev4-section','ev4-architecture');
    const h=section.querySelector('h2'); if(h)h.textContent=text.architectureTitle;
    const intro=section.querySelector('.section-intro'); if(intro)intro.textContent=text.architectureIntro;
    section.querySelectorAll('.unit-chain').forEach(node=>node.remove());
  }

  function updatePrograms(){
    const section=document.getElementById('platform');
    if(!section)return;
    section.classList.add('ev4-section','ev4-programs');
    const h=section.querySelector('h2'); if(h)h.textContent=text.programsTitle;
    const intro=section.querySelector('.section-intro'); if(intro)intro.textContent=text.programsIntro;
    const cards=[...section.querySelectorAll('.ev3-program-card,.program-grid-v2>.card,.tool-grid>.card')];
    cards.forEach(card=>{
      const role=card.dataset.programRole||'';
      card.classList.add('ev4-static-card','ev3-program-card');
      card.dataset.static='1';
      replaceVisual(card,programType[role]||'program',card.querySelector('h3,h4')?.textContent||'', 'ev3-program-visual');
      card.style.cursor='default';
      card.removeAttribute('tabindex');
      card.removeAttribute('role');
      card.querySelectorAll('.ev3-card-action,.ev4-card-action').forEach(node=>node.remove());
    });
    trimRepeatedLabels(section);
  }

  function researchType(card,index){
    const title=(card.querySelector('h3,h4')?.textContent||'').toLowerCase();
    if(/radar|레이더|홍수유출/.test(title))return 'radar';
    if(/snow|융설|장기유출/.test(title))return 'snow';
    if(/drought|가뭄|water cycle|물순환/.test(title))return 'balance';
    if(/parallel|병렬/.test(title))return 'parallel';
    if(/groundwater|지하수/.test(title))return 'swgw';
    if(/wildfire|산불/.test(title))return 'wildfire';
    return ['radar','snow','balance','parallel','swgw','wildfire'][index%6];
  }

  function updateResearch(){
    const section=document.getElementById('research');
    if(!section)return;
    section.classList.add('ev4-section','ev4-research');
    const h=section.querySelector('h2'); if(h)h.textContent=text.researchTitle;
    const intro=section.querySelector('.section-intro'); if(intro)intro.textContent=text.researchIntro;
    const cards=[...section.querySelectorAll('.grid3>.card')].slice(0,6);
    cards.forEach((card,index)=>{
      card.classList.add('ev4-static-card');
      card.dataset.static='1';
      replaceVisual(card,researchType(card,index),card.querySelector('h3,h4')?.textContent||'', 'ev4-research-visual');
      card.style.cursor='default';
      card.querySelectorAll('.research-code,.ev3-card-action,.ev4-card-action').forEach(node=>node.remove());
    });
    const timeline=section.querySelector('.timeline');
    if(timeline&&!timeline.closest('details.ev4-history')){
      const details=document.createElement('details');
      details.className='ev4-history';
      const summary=document.createElement('summary');
      summary.textContent=text.history;
      timeline.before(details);
      details.append(summary,timeline);
    }
  }

  function updateCapabilities(){
    const section=document.getElementById('capabilities');
    if(!section)return;
    section.classList.add('ev4-section','ev4-capabilities');
    const h=section.querySelector('h2'); if(h)h.textContent=text.capabilityTitle;
    const intro=section.querySelector('.catlas-head p,.section-intro'); if(intro)intro.textContent=text.capabilityIntro;
    let hint=section.querySelector('.ev3-click-hint');
    if(!hint){
      hint=document.createElement('p');
      hint.className='ev3-click-hint ev4-click-hint';
      section.querySelector('.catlas-head')?.after(hint);
    }
    hint.textContent=ko?'파란색 ‘상세 설명 열기’를 누르면 해당 기능의 설명이 열립니다.':'Use the blue “Open detailed explanation” action to open a capability.';
    const cards=[...section.querySelectorAll('.catlas-card')];
    cards.forEach(card=>{
      card.classList.add('ev4-action-card');
      card.dataset.ev4Interactive='1';
      card.querySelectorAll('.ev3-card-visual').forEach(node=>node.remove());
      let action=card.querySelector('.ev4-card-action');
      if(!action){
        card.querySelectorAll('.ev3-card-action').forEach(node=>node.remove());
        action=document.createElement('span');
        action.className='ev4-card-action';
        action.innerHTML=`<span>${esc(text.openDetail)}</span><b aria-hidden="true">→</b>`;
        card.append(action);
      }
      const title=card.querySelector('h4,h3')?.textContent.trim()||'';
      card.setAttribute('aria-label',`${title}. ${text.openDetail}`);
    });
    const group=section.dataset.activeGroup||section.querySelector('.catlas-tab[aria-selected="true"]')?.dataset.group||'forcing';
    const groupType={forcing:'radar',hydrology:'runoff',terrain:'terrain',audit:'balance',river:'river',flood:'flood',transport:'transport',platform:'program'};
    const visual=section.querySelector('.catlas-group-visual');
    if(visual){
      const title=section.querySelector('.catlas-group-head h3')?.textContent||'';
      visual.innerHTML=diagram(groupType[group]||'program',title);
      visual.dataset.ev4Group=group;
    }
  }

  function updateResources(){
    const references=document.getElementById('references');
    if(!references)return null;
    const links=references.querySelector('.links');
    const resources=document.createElement('section');
    resources.id='resources';
    resources.className='ev4-section ev4-resources';
    const wrap=document.createElement('div');
    wrap.className='wrap';
    wrap.innerHTML=`<h2>${esc(text.resourcesTitle)}</h2><p class="section-intro">${esc(text.resourcesIntro)}</p>`;
    if(links)wrap.append(links);
    resources.append(wrap);
    resources.querySelectorAll('.ev3-resource-link,.link-card').forEach(card=>{
      card.classList.add('ev4-resource-link');
      const action=card.querySelector('.ev3-link-action');
      if(action)action.textContent=ko?'자료 열기 ↗':'Open resource ↗';
    });
    return resources;
  }

  function updateDownload(){
    const references=document.getElementById('references');
    const official=references?.querySelector('.official');
    if(!references||!official)return;
    references.classList.add('ev4-section','ev4-download-section');
    references.querySelector('.wrap>h2')?.remove();
    references.querySelector('.section-intro')?.remove();
    official.className='official ev3-download-panel mywater-callout-v2 ev4-download-panel';
    official.innerHTML=`
      <div class="ev4-download-copy">
        <span class="mywater-kicker">${esc(text.official)}</span>
        <h2>${esc(text.downloadTitle)}</h2>
        <p>${esc(text.downloadBody)}</p>
        <div class="ev3-download-actions ev4-download-actions">
          <a class="ev3-download-primary ev4-download-primary" href="${MYWATER}">${esc(text.downloadAction)} <span aria-hidden="true">→</span></a>
          <a href="${TERMS}">${esc(text.terms)}</a>
          <a href="${INSTITUTE}">${esc(text.institute)}</a>
        </div>
      </div>
      <div class="ev4-download-mark" aria-hidden="true">${diagram('netcdf','MyWater K-Series')}</div>`;
  }

  function buildTabs(resources){
    const main=document.getElementById('main');
    const hero=document.querySelector('.hero');
    if(!main||!hero||document.getElementById('ev4-shell'))return;
    const sections={
      outcomes:document.getElementById('outcomes'),
      architecture:document.getElementById('architecture'),
      capabilities:document.getElementById('capabilities'),
      results:document.getElementById('results'),
      programs:document.getElementById('platform'),
      research:document.getElementById('research'),
      references:document.getElementById('references')
    };
    document.getElementById('features')?.remove();
    document.getElementById('functions')?.remove();

    const shell=document.createElement('div');
    shell.id='ev4-shell';
    shell.innerHTML=`
      <div class="ev4-tab-wrap">
        <div class="wrap">
          <div class="ev4-tabs" role="tablist" aria-label="${ko?'홈페이지 내용 선택':'Choose homepage content'}">
            ${text.tabs.map(([id,label],index)=>`<button type="button" class="ev4-tab${id==='download'?' ev4-tab-download':''}" role="tab" id="ev4-tab-${id}" aria-controls="ev4-panel-${id}" aria-selected="${index===0}" data-tab="${id}">${esc(label)}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="ev4-panels"></div>`;
    main.prepend(shell);
    const panels=shell.querySelector('.ev4-panels');
    const makePanel=id=>{
      const panel=document.createElement('section');
      panel.className='ev4-panel';
      panel.id=`ev4-panel-${id}`;
      panel.dataset.panel=id;
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('aria-labelledby',`ev4-tab-${id}`);
      if(id!=='overview')panel.hidden=true;
      panels.append(panel);
      return panel;
    };
    const overview=makePanel('overview');
    const capabilities=makePanel('capabilities');
    const results=makePanel('results');
    const programs=makePanel('programs');
    const research=makePanel('research');
    const download=makePanel('download');
    [sections.outcomes,sections.architecture].filter(Boolean).forEach(node=>overview.append(node));
    if(sections.capabilities)capabilities.append(sections.capabilities);
    if(sections.results)results.append(sections.results);
    if(sections.programs)programs.append(sections.programs);
    [sections.research,resources].filter(Boolean).forEach(node=>research.append(node));
    if(sections.references)download.append(sections.references);

    const mapHash=value=>{
      const id=String(value||'').replace(/^#/,'');
      const map={overview:'overview',outcomes:'overview',architecture:'overview',capabilities:'capabilities',results:'results',platform:'programs',programs:'programs',research:'research',resources:'research',references:'download',download:'download'};
      return map[id]||'overview';
    };
    const activate=(id,{updateHash=true,scroll=false}={})=>{
      const safe=text.tabs.some(([key])=>key===id)?id:'overview';
      shell.querySelectorAll('.ev4-tab').forEach(tab=>{
        const selected=tab.dataset.tab===safe;
        tab.setAttribute('aria-selected',String(selected));
        tab.tabIndex=selected?0:-1;
      });
      shell.querySelectorAll('.ev4-panel').forEach(panel=>{
        panel.hidden=panel.dataset.panel!==safe;
      });
      document.documentElement.dataset.ev4ActiveTab=safe;
      if(updateHash)history.replaceState(null,'',`#${safe}`);
      if(scroll)shell.querySelector('.ev4-tab-wrap')?.scrollIntoView({behavior:'smooth',block:'start'});
    };

    shell.querySelectorAll('.ev4-tab').forEach(tab=>{
      tab.addEventListener('click',()=>activate(tab.dataset.tab,{updateHash:true}));
      tab.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        const tabs=[...shell.querySelectorAll('.ev4-tab')];
        let index=tabs.indexOf(tab);
        if(event.key==='Home')index=0;
        else if(event.key==='End')index=tabs.length-1;
        else index=(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        tabs[index].focus();
        activate(tabs[index].dataset.tab,{updateHash:true});
      });
    });
    document.addEventListener('click',event=>{
      const link=event.target.closest('[data-ev4-tab-link],a[href^="#"]');
      if(!link)return;
      const requested=link.dataset.ev4TabLink||mapHash(link.getAttribute('href'));
      if(!text.tabs.some(([id])=>id===requested))return;
      event.preventDefault();
      activate(requested,{updateHash:true,scroll:true});
    });
    window.addEventListener('hashchange',()=>activate(mapHash(location.hash),{updateHash:false}));
    activate(mapHash(location.hash),{updateHash:false});
  }

  function bindDynamicUpdates(){
    const capabilities=document.getElementById('capabilities');
    if(capabilities&&!capabilities.dataset.ev4Bound){
      capabilities.dataset.ev4Bound='1';
      capabilities.addEventListener('click',event=>{
        if(event.target.closest('.catlas-tab'))setTimeout(updateCapabilities,0);
        if(event.target.closest('.catlas-card'))setTimeout(()=>{
          const dialog=document.getElementById('catlas-dialog');
          if(dialog?.open){
            dialog.classList.add('ev4-dialog');
            const graphic=dialog.querySelector('.catlas-graphic');
            if(graphic&&!graphic.querySelector('.ev4-diagram-label')){
              const label=document.createElement('span');
              label.className='ev4-diagram-label';
              label.textContent=ko?'해석 개념도':'Process diagram';
              graphic.prepend(label);
            }
          }
        },0);
      },true);
    }
  }

  function finalize(){
    if(document.documentElement.dataset.kdrumExperienceV4==='ready')return;
    document.documentElement.classList.add('ev4-experience');
    updateHeader();
    updateHero();
    updateOutcomes();
    updateResults();
    updateArchitecture();
    updatePrograms();
    updateResearch();
    updateCapabilities();
    const resources=updateResources();
    updateDownload();
    buildTabs(resources);
    bindDynamicUpdates();
    document.documentElement.dataset.kdrumDesignSystem='ready';
    document.documentElement.dataset.kdrumExperienceV4='ready';
  }

  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    const ready=document.documentElement.dataset.kdrumExperienceV3Final==='ready'&&
      document.documentElement.dataset.kdrumCapabilityAtlas==='ready'&&
      document.getElementById('outcomes')&&document.getElementById('results')&&document.getElementById('platform');
    if(ready||attempts>240){
      clearInterval(timer);
      finalize();
    }
  },50);
})();