(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const downloadLabel=ko?'MyWater에서 K-DRUM 다운로드':'Download K-DRUM from MyWater';

  function removeExtraVisuals(selector){
    document.querySelectorAll(selector).forEach(card=>{
      const keep=card.querySelector(':scope > .ev4-visual');
      [...card.children].forEach(child=>{
        if(child===keep)return;
        if(child.querySelector?.('svg'))child.remove();
      });
    });
  }

  function cleanHero(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    hero.querySelectorAll('.ev3-hero-facts,.hero-facts,.ev3-hero-note,.hero-note,.unit-chain').forEach(node=>node.remove());
    const facts=[...hero.querySelectorAll('.ev4-facts')];
    facts.slice(1).forEach(node=>node.remove());
  }

  function cleanStaticCards(){
    removeExtraVisuals('#outcomes .ev4-static-card');
    removeExtraVisuals('#results .ev4-static-card');
    removeExtraVisuals('#platform .ev3-program-card');
    removeExtraVisuals('#research .ev4-static-card');
  }

  function cleanArchitecture(){
    const section=document.getElementById('architecture');
    const wrap=section?.querySelector('.wrap');
    if(!section||!wrap)return;
    [...section.querySelectorAll('svg')].forEach(svg=>{
      if(svg.closest('.arch'))return;
      let node=svg;
      while(node.parentElement&&node.parentElement!==wrap)node=node.parentElement;
      if(node.parentElement===wrap&&!node.matches('.architecture'))node.remove();
    });
  }

  function cleanResearchHeading(){
    const research=document.getElementById('research');
    if(!research)return;
    const details=research.querySelector('details.ev4-history');
    if(!details){
      const placeholder=document.createElement('details');
      placeholder.className='ev4-history';
      placeholder.hidden=true;
      placeholder.dataset.emptyHistory='1';
      research.append(placeholder);
    }
    research.querySelectorAll('h2,h3,h4').forEach(heading=>{
      const value=heading.textContent.trim();
      if((value==='연구 연혁'||/^Research (history|timeline)$/i.test(value))&&!heading.closest('details.ev4-history'))heading.remove();
    });
  }

  function downloadDiagram(){
    return `<svg viewBox="0 0 260 150" role="img" aria-label="MyWater K-Series download" data-diagram="download" focusable="false">
      <rect x="1" y="1" width="258" height="148" rx="18" fill="#f4f9fc" stroke="#b9d5e3"/>
      <path d="M58 52c5-18 22-28 39-22 11-18 42-16 50 5 20-7 40 8 38 29 17 1 27 11 27 25H52c-28 0-30-31 6-37Z" fill="#fff" stroke="#0069b4" stroke-width="4"/>
      <path d="M130 62v43" stroke="#148b77" stroke-width="8" stroke-linecap="round"/>
      <path d="m112 91 18 18 18-18" fill="none" stroke="#148b77" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M86 119h88" stroke="#0069b4" stroke-width="5" stroke-linecap="round"/>
      <text x="130" y="139" text-anchor="middle" fill="#17364d" font-size="12" font-weight="800">MyWater · K-Series</text>
    </svg>`;
  }

  function cleanDownload(){
    const primary=document.querySelector('#references .ev4-download-primary');
    if(primary){
      primary.innerHTML=`<span class="ev4-download-label">${downloadLabel}</span><span class="ev4-download-arrow" aria-hidden="true">→</span>`;
      primary.setAttribute('aria-label',downloadLabel);
    }
    const mark=document.querySelector('#references .ev4-download-mark');
    if(mark)mark.innerHTML=downloadDiagram();
  }

  function stabilizeCapabilities(){
    const section=document.getElementById('capabilities');
    if(!section)return;
    const selected=section.querySelector('.catlas-tab[aria-selected="true"]');
    const group=selected?.dataset.group||'';
    const expected={forcing:'radar',hydrology:'runoff',terrain:'terrain',audit:'balance',river:'river',flood:'flood',transport:'transport',platform:'program'}[group];
    section.querySelectorAll('.catlas-card').forEach(card=>{
      card.querySelectorAll('.ev3-card-visual,.ev3-card-action').forEach(node=>node.remove());
    });
    const visual=section.querySelector('.catlas-group-visual');
    const current=visual?.querySelector('svg[data-diagram]')?.dataset.diagram;
    if(expected&&current!==expected){
      document.dispatchEvent(new CustomEvent('kdrum-v4-refresh-capabilities'));
      const tab=selected;
      if(tab&&!tab.dataset.ev4PolishPulse){
        tab.dataset.ev4PolishPulse='1';
        tab.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:false,view:window}));
        setTimeout(()=>delete tab.dataset.ev4PolishPulse,0);
      }
    }
  }

  function polish(){
    cleanHero();
    cleanStaticCards();
    cleanArchitecture();
    cleanResearchHeading();
    cleanDownload();
    stabilizeCapabilities();
    document.documentElement.dataset.kdrumExperienceV4Polish='ready';
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('.catlas-tab,.ev4-tab'))[0,30,90,180,360].forEach(delay=>setTimeout(polish,delay));
  },true);

  let attempts=0;
  const readyTimer=setInterval(()=>{
    attempts+=1;
    if(document.documentElement.dataset.kdrumExperienceV4Fix==='ready'||attempts>240){
      clearInterval(readyTimer);
      [0,60,180,420].forEach(delay=>setTimeout(polish,delay));
      setInterval(()=>{
        if(document.documentElement.dataset.ev4ActiveTab==='capabilities')polish();
      },180);
    }
  },50);
})();