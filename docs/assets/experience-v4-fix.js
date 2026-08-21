(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const actionText=ko?'상세 설명 열기':'Open detailed explanation';
  const groupDiagram={forcing:'radar',hydrology:'runoff',terrain:'terrain',audit:'balance',river:'river',flood:'flood',transport:'transport',platform:'program'};
  const colors={blue:'#0069b4',cyan:'#17a7d1',teal:'#148b77',green:'#4c9960',amber:'#bd7414',violet:'#6559b5',ink:'#17364d',muted:'#7d9bad',line:'#bfd4e0',water:'#cfeefa',soil:'#ead8bd'};
  const esc=value=>String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));

  function groupSvg(group,label){
    const c=colors;
    const art={
      forcing:`<g stroke="${c.line}"><path d="M178 24v78M214 24v78M250 24v78M160 43h108M160 64h108M160 85h108"/></g><path d="M28 42c7-17 29-19 39-5 15-18 43-6 42 15 17-3 30 9 27 25H35c-22 0-27-25-7-35Z" fill="#fff" stroke="${c.blue}" stroke-width="4"/><g stroke="${c.cyan}" stroke-width="4" stroke-linecap="round"><path d="M55 81l-7 18"/><path d="M80 81l-7 18"/><path d="M105 81l-7 18"/></g><g fill="#fff" stroke="${c.blue}" stroke-width="3"><circle cx="171" cy="35" r="7"/><circle cx="223" cy="74" r="7"/></g><path d="M136 65h19" stroke="${c.amber}" stroke-width="5"/><path d="m149 57 11 8-11 8" fill="none" stroke="${c.amber}" stroke-width="4"/>`,
      hydrology:`<g stroke="${c.cyan}" stroke-width="4" stroke-linecap="round"><path d="M43 20v25"/><path d="M72 15v30"/><path d="M101 22v23"/></g><path d="M18 57h155" stroke="${c.green}" stroke-width="6"/><path d="M18 82h155M18 108h155" stroke="${c.amber}" stroke-width="2" stroke-dasharray="7 5"/><g stroke="${c.blue}" stroke-width="4"><path d="M52 46v57"/><path d="M96 46v45"/></g><path d="M173 98c31-28 50 8 74-15 21-20 37 0 57-10" fill="none" stroke="${c.blue}" stroke-width="9" stroke-linecap="round"/><path d="M177 113c30-12 50 7 76-5 23-11 34 5 52-2" fill="none" stroke="${c.teal}" stroke-width="3"/>`,
      terrain:`<path d="M18 106 75 41l43 51 43-72 47 55 37-32 59 63Z" fill="#dfeee1" stroke="${c.green}" stroke-width="4"/><path d="M19 108c41-28 72 3 101-22 36-31 68 8 101-18 24-19 47-13 83 2" fill="none" stroke="${c.blue}" stroke-width="9"/><path d="M45 118h235" stroke="${c.ink}" stroke-width="2"/><path d="M48 118 92 80l38 23 43-37 48 52" fill="none" stroke="${c.amber}" stroke-width="3"/>`,
      audit:`<path d="M40 16v55" stroke="${c.cyan}" stroke-width="6"/><path d="m30 60 10 13 10-13" fill="none" stroke="${c.cyan}" stroke-width="5"/><rect x="86" y="35" width="134" height="70" rx="14" fill="#fff" stroke="${c.blue}" stroke-width="4"/><text x="153" y="67" text-anchor="middle" fill="${c.ink}" font-size="20" font-weight="800">ΔS</text><text x="153" y="90" text-anchor="middle" fill="${c.muted}" font-size="11">storage change</text><path d="M220 62h60" stroke="${c.blue}" stroke-width="6"/><path d="m269 52 13 10-13 10" fill="none" stroke="${c.blue}" stroke-width="5"/><path d="M153 105v26" stroke="${c.amber}" stroke-width="6"/><g fill="${c.ink}" font-size="11" font-weight="700"><text x="28" y="14">P</text><text x="267" y="48">Q</text><text x="165" y="129">ET</text></g>`,
      river:`<path d="M20 96c45-42 78 9 118-24 46-39 76 16 144-27" fill="none" stroke="${c.blue}" stroke-width="11" stroke-linecap="round"/><path d="M75 76V36M142 64V25M229 55V20" stroke="${c.ink}" stroke-width="2"/><g fill="#fff" stroke="${c.blue}" stroke-width="3"><circle cx="75" cy="76" r="7"/><circle cx="142" cy="64" r="7"/><circle cx="229" cy="55" r="7"/></g><path d="M242 92h42v30h-42z" fill="${c.water}" stroke="${c.teal}" stroke-width="3"/><path d="M263 91V66l16 25" fill="none" stroke="${c.ink}" stroke-width="4"/>`,
      flood:`<path d="M24 82h118" stroke="${c.blue}" stroke-width="12"/><path d="M174 27h118v90H174z" fill="${c.water}" stroke="${c.cyan}" stroke-width="3"/><g stroke="#fff"><path d="M203 27v90M232 27v90M261 27v90M174 49h118M174 72h118M174 95h118"/></g><path d="M142 59h32" stroke="${c.teal}" stroke-width="5"/><path d="m163 49 13 10-13 10" fill="none" stroke="${c.teal}" stroke-width="4"/><path d="M174 96h-32" stroke="${c.violet}" stroke-width="4"/><path d="m153 86-13 10 13 10" fill="none" stroke="${c.violet}" stroke-width="4"/><text x="73" y="70" text-anchor="middle" fill="#fff" font-size="17" font-weight="800">1D</text><text x="233" y="77" text-anchor="middle" fill="${c.ink}" font-size="17" font-weight="800">2D</text>`,
      transport:`<path d="M20 75c44-38 78 10 117-22 45-37 82 18 164-29" fill="none" stroke="${c.blue}" stroke-width="11"/><g fill="${c.amber}">${[0,1,2,3,4,5].map(i=>`<circle cx="${55+i*37}" cy="${65-(i%2)*12}" r="${5+(i%3)}"/>`).join('')}</g><path d="M38 122h245M38 88v34" stroke="${c.muted}" stroke-width="2"/><path d="M42 116c20-1 30-10 46-23 19-16 31-2 47 8 20 13 39-8 74-5 25 2 39-9 68-2" fill="none" stroke="${c.violet}" stroke-width="4"/>`,
      program:`<rect x="22" y="36" width="72" height="58" rx="10" fill="#fff" stroke="${c.blue}" stroke-width="3"/><rect x="124" y="24" width="72" height="82" rx="10" fill="#fff" stroke="${c.teal}" stroke-width="3"/><rect x="226" y="36" width="72" height="58" rx="10" fill="#fff" stroke="${c.violet}" stroke-width="3"/><path d="M94 65h30M196 65h30" stroke="${c.amber}" stroke-width="5"/><path d="m113 56 12 9-12 9m102-18 12 9-12 9" fill="none" stroke="${c.amber}" stroke-width="4"/><g fill="${c.ink}" font-size="11" font-weight="800"><text x="58" y="69" text-anchor="middle">INPUT</text><text x="160" y="69" text-anchor="middle">CORE</text><text x="262" y="69" text-anchor="middle">VIEW</text></g>`
    };
    return `<svg viewBox="0 0 320 140" role="img" aria-label="${esc(label)}" data-diagram="${groupDiagram[group]||'program'}" focusable="false"><rect x="1" y="1" width="318" height="138" rx="16" fill="#f3f8fb" stroke="#bfd4e0"/>${art[group]||art.program}</svg>`;
  }

  function refreshCapabilities(){
    const section=document.getElementById('capabilities');
    if(!section)return;
    const selected=section.querySelector('.catlas-tab[aria-selected="true"]');
    const group=selected?.dataset.group||section.dataset.activeGroup||'forcing';
    section.dataset.activeGroup=group;
    const cards=[...section.querySelectorAll('.catlas-card')];
    cards.forEach(card=>{
      card.querySelectorAll('.ev3-card-visual,.ev3-card-action').forEach(node=>node.remove());
      let action=card.querySelector('.ev4-card-action');
      if(!action){
        action=document.createElement('span');
        action.className='ev4-card-action';
        action.innerHTML=`<span>${actionText}</span><b aria-hidden="true">→</b>`;
        card.append(action);
      }
      const title=card.querySelector('h4,h3')?.textContent.trim()||'';
      card.classList.add('ev4-action-card');
      card.dataset.ev4Interactive='1';
      card.setAttribute('aria-label',`${title}. ${actionText}`);
    });
    const visual=section.querySelector('.catlas-group-visual');
    if(visual){
      const title=section.querySelector('.catlas-group-head h3')?.textContent.trim()||'';
      visual.innerHTML=groupSvg(group,title);
      visual.dataset.ev4Group=group;
    }
  }

  function collapseHistory(){
    const research=document.getElementById('research');
    if(!research)return;
    if(research.querySelector('details.ev4-history'))return;
    let timeline=research.querySelector('.timeline,.ev3-timeline,.research-timeline,[class*="history-timeline"],[class*="research-timeline"]');
    if(!timeline){
      const event=research.querySelector('.event');
      const parent=event?.parentElement;
      if(parent&&parent!==research&&!parent.matches('.grid3,.wrap'))timeline=parent;
    }
    if(!timeline)return;
    const previous=timeline.previousElementSibling;
    if(previous&&/^H[234]$/.test(previous.tagName)&&/연혁|history|timeline/i.test(previous.textContent))previous.remove();
    const details=document.createElement('details');
    details.className='ev4-history';
    const summary=document.createElement('summary');
    summary.textContent=ko?'연구 연혁 보기':'View research timeline';
    timeline.before(details);
    details.append(summary,timeline);
  }

  function refreshAll(){
    refreshCapabilities();
    collapseHistory();
    document.documentElement.dataset.kdrumExperienceV4Fix='ready';
  }

  function scheduleRefresh(){
    [0,30,90,180,360].forEach(delay=>setTimeout(refreshAll,delay));
    requestAnimationFrame(()=>{
      refreshAll();
      requestAnimationFrame(refreshAll);
    });
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('#capabilities .catlas-tab'))scheduleRefresh();
    if(event.target.closest('#ev4-tab-research'))scheduleRefresh();
  },true);

  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    if(document.documentElement.dataset.kdrumExperienceV4==='ready'||attempts>240){
      clearInterval(timer);
      scheduleRefresh();
    }
  },50);
})();