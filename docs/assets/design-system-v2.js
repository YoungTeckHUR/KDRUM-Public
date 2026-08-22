(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const base=ko?'../assets/':'assets/';

  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href="#main"]');
    if(!link)return;
    const main=document.getElementById('main');
    if(!main)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(!main.hasAttribute('tabindex'))main.setAttribute('tabindex','-1');
    history.replaceState(null,'','#main');
    main.focus({preventScroll:true});
    main.scrollIntoView({block:'start'});
  },true);

  function addStyle(name,attr){
    if(document.querySelector(`link[${attr}]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=base+name;
    link.setAttribute(attr,'1');
    document.head.appendChild(link);
  }

  function addScript(name,attr,onload){
    const existing=document.querySelector(`script[${attr}]`);
    if(existing){
      if(onload)existing.addEventListener('load',onload,{once:true});
      return existing;
    }
    const script=document.createElement('script');
    script.src=base+name;
    script.setAttribute(attr,'1');
    if(onload)script.addEventListener('load',onload,{once:true});
    document.head.appendChild(script);
    return script;
  }

  addStyle('experience-v3-compat.css','data-kdrum-experience-v3-compat');

  function loadStable(){
    addStyle('experience-v4-stable.css','data-kdrum-experience-v4-stable');
    addScript('experience-v4-stable.js','data-kdrum-experience-v4-stable');
  }

  function loadV4(){
    addStyle('experience-v4.css','data-kdrum-experience-v4');
    if(document.documentElement.dataset.kdrumExperienceV4==='ready'){
      loadStable();
      return;
    }
    addScript('experience-v4.js','data-kdrum-experience-v4',loadStable);
  }

  function loadFinalizer(){
    const existing=document.querySelector('script[data-kdrum-experience-v3-final]');
    if(existing){
      if(document.documentElement.dataset.kdrumExperienceV3Final==='ready')loadV4();
      else existing.addEventListener('load',loadV4,{once:true});
      return;
    }
    addScript('experience-v3-final.js','data-kdrum-experience-v3-final',loadV4);
  }

  const existing=document.querySelector('script[data-kdrum-experience-v3]');
  if(existing){
    if(document.documentElement.dataset.kdrumExperienceV3==='ready')loadFinalizer();
    else existing.addEventListener('load',loadFinalizer,{once:true});
    return;
  }
  addScript('experience-v3.js','data-kdrum-experience-v3',loadFinalizer);
})();
