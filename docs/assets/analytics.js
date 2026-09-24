/* Optional analytics: failure never blocks the public documents. */
(()=>{'use strict';
 const cfg=window.KDRUM_ANALYTICS||{},key='kdrum-analytics-disabled';
 const privacySignal=navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.globalPrivacyControl===true;
 let disabled=true,storageAvailable=true;
 try{disabled=localStorage.getItem(key)==='1';}catch{storageAvailable=false;}
 const allowed=()=>cfg.enabled&&cfg.provider==='goatcounter'&&!disabled&&storageAvailable&&!privacySignal&&location.hostname==='youngteckhur.github.io';
 const ko=()=>document.documentElement.lang==='ko';
 const button=[...document.querySelectorAll('[data-analytics-toggle]')].find(el=>!el.closest('[data-language]')||el.closest('[data-language]').dataset.language===document.documentElement.lang),status=button?.closest('.analytics-notice').querySelector('[data-analytics-status]');
 function renderChoice(){
  if(!button)return;
  button.hidden=false;button.disabled=!storageAvailable||privacySignal;
  button.textContent=ko()?(disabled?'방문 통계 허용':'방문 통계 거부'):(disabled?'Allow analytics':'Disable analytics');
  if(status)status.textContent=ko()?(allowed()?'방문 통계가 활성화되어 있습니다.':'이 페이지의 방문 통계는 비활성 상태입니다.'):(allowed()?'Visitor analytics is enabled.':'Visitor analytics is disabled on this page.');
 }
 if(button)button.addEventListener('click',()=>{
  disabled=!disabled;
  try{localStorage.setItem(key,disabled?'1':'0');}catch{storageAvailable=false;disabled=true;}
  renderChoice();if(!disabled&&storageAvailable)location.reload();
 });
 addEventListener('storage',event=>{if(event.key===key||event.key===null){try{disabled=localStorage.getItem(key)==='1';}catch{storageAvailable=false;disabled=true;}renderChoice();}});
 renderChoice();
 if(!allowed())return;
 const endpoint=String(cfg.goatCounterEndpoint||'').trim();
 if(endpoint!=='https://kdrum-public.goatcounter.com/count')return;
 const count=params=>{if(!allowed())return;try{window.goatcounter?.count?.({...params,referrer:''});}catch{/* Optional metrics must not affect navigation. */}};
 function bindEvents(){
  if(cfg.trackCapabilityOpen!==false)document.querySelectorAll('details.capability').forEach(el=>el.addEventListener('toggle',()=>{
   if(el.open)count({path:'/event/capability/'+el.dataset.feature,title:'capability_open',event:true});
  }));
  document.addEventListener('click',event=>{
   const a=event.target.closest('a[href]');if(!a)return;
   const url=new URL(a.href),href=url.href;
   if(cfg.trackMyWaterClick!==false&&(url.hostname==='water.or.kr'||url.hostname.endsWith('.water.or.kr')))count({path:'/event/mywater-download',title:'mywater_click',event:true});
   else if(cfg.trackMediaOpen!==false&&(/\.(pdf|mp4)(?:$|\?)/i.test(href)||a.classList.contains('media-guide-link')))count({path:'/event/media/'+(/\.pdf/i.test(href)?'pdf':/\.mp4/i.test(href)?'video':'visual_guide'),title:'media_open',event:true});
   else if(cfg.trackLanguageSwitch!==false&&a.hasAttribute('lang'))count({path:'/event/language/'+a.getAttribute('lang'),title:'language_switch',event:true});
  });
 }
 // No automatic pageview: a late script load must still respect a new opt-out.
 window.goatcounter={no_onload:true,path:location.pathname,referrer:''};
 const script=document.createElement('script');script.async=true;
 script.src='https://gc.zgo.at/count.v5.js';
 script.crossOrigin='anonymous';
 script.integrity='sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ';
 script.dataset.goatcounter=endpoint;
 script.addEventListener('load',()=>{if(!allowed())return;count({path:location.pathname});bindEvents();});
 document.head.append(script);
})();
