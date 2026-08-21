(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const base=ko?'../assets/':'assets/';

  if(!document.querySelector('link[data-kdrum-experience-v3-compat]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=base+'experience-v3-compat.css';
    link.dataset.kdrumExperienceV3Compat='1';
    document.head.appendChild(link);
  }

  function loadV4(){
    if(!document.querySelector('link[data-kdrum-experience-v4]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href=base+'experience-v4.css';
      link.dataset.kdrumExperienceV4='1';
      document.head.appendChild(link);
    }
    if(document.querySelector('script[data-kdrum-experience-v4]'))return;
    const script=document.createElement('script');
    script.dataset.kdrumExperienceV4='1';
    script.src=base+'experience-v4.js';
    document.head.appendChild(script);
  }

  function loadFinalizer(){
    const existing=document.querySelector('script[data-kdrum-experience-v3-final]');
    if(existing){loadV4();return;}
    const finalizer=document.createElement('script');
    finalizer.dataset.kdrumExperienceV3Final='1';
    finalizer.src=base+'experience-v3-final.js';
    finalizer.addEventListener('load',loadV4,{once:true});
    document.head.appendChild(finalizer);
  }

  const existing=document.querySelector('script[data-kdrum-experience-v3]');
  if(existing){loadFinalizer();return;}
  const script=document.createElement('script');
  script.dataset.kdrumExperienceV3='1';
  script.src=base+'experience-v3.js';
  script.addEventListener('load',loadFinalizer,{once:true});
  document.head.appendChild(script);
})();