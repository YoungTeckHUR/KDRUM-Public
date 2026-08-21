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

  function loadFinalizer(){
    if(document.querySelector('script[data-kdrum-experience-v3-final]'))return;
    const finalizer=document.createElement('script');
    finalizer.dataset.kdrumExperienceV3Final='1';
    finalizer.src=base+'experience-v3-final.js';
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
