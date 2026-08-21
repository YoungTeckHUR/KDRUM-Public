(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const existing=document.querySelector('script[data-kdrum-experience-v3]');
  if(existing)return;
  const script=document.createElement('script');
  script.dataset.kdrumExperienceV3='1';
  script.src=(ko?'../assets/':'assets/')+'experience-v3.js';
  document.head.appendChild(script);
})();
