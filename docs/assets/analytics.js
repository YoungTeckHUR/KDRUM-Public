/* Optional visitor analytics for the K-DRUM public website.
 * No data is transmitted unless docs/assets/analytics-config.js explicitly enables a provider.
 */
(()=>{'use strict';
 const cfg=window.KDRUM_ANALYTICS||{};
 if(!cfg.enabled||cfg.provider==='none')return;
 if(cfg.respectDoNotTrack!==false&&(navigator.doNotTrack==='1'||window.doNotTrack==='1'))return;

 const lang=()=>document.documentElement.lang||'unknown';
 let emit=()=>{};

 const common=(name,params={})=>emit(name,{
   page_path:location.pathname,
   page_language:lang(),
   ...params
 });

 const bindEvents=()=>{
   if(cfg.trackCapabilityOpen!==false){
     document.querySelectorAll('details.capability').forEach(el=>{
       el.addEventListener('toggle',()=>{
         if(!el.open)return;
         common('capability_open',{
           capability_id:el.dataset.feature||'unknown',
           capability_group:el.dataset.group||'unknown',
           capability_status:el.dataset.status||'unknown'
         });
       });
     });
   }

   document.addEventListener('click',event=>{
     const a=event.target.closest('a[href]');
     if(!a)return;
     const href=a.href||'';

     if(cfg.trackMyWaterClick!==false&&href.includes('water.or.kr/')){
       common('mywater_click',{link_text:a.textContent.trim().slice(0,80)});
       return;
     }

     if(cfg.trackMediaOpen!==false&&(/\.pdf(?:$|\?)/i.test(href)||/\.mp4(?:$|\?)/i.test(href)||a.classList.contains('media-guide-link'))){
       common('media_open',{media_type:/\.pdf/i.test(href)?'pdf':/\.mp4/i.test(href)?'video':'visual_guide'});
       return;
     }

     if(cfg.trackLanguageSwitch!==false&&a.hasAttribute('lang')){
       common('language_switch',{target_language:a.getAttribute('lang')||'unknown'});
     }
   });
 };

 const startGa4=()=>{
   const id=String(cfg.ga4MeasurementId||'').trim();
   if(!/^G-[A-Z0-9]+$/i.test(id))return;
   window.dataLayer=window.dataLayer||[];
   window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
   window.gtag('js',new Date());
   window.gtag('config',id,{send_page_view:true});
   emit=(name,params)=>window.gtag('event',name,params);
   const s=document.createElement('script');
   s.async=true;
   s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
   document.head.append(s);
   bindEvents();
 };

 const startGoatCounter=()=>{
   const endpoint=String(cfg.goatCounterEndpoint||'').trim();
   if(!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/i.test(endpoint))return;
   const s=document.createElement('script');
   s.async=true;
   s.src='https://gc.zgo.at/count.js';
   s.dataset.goatcounter=endpoint;
   s.addEventListener('load',()=>{
     emit=(name,params)=>{
       if(!window.goatcounter?.count)return;
       const feature=params.capability_id?'/event/capability/'+params.capability_id:
         name==='mywater_click'?'/event/mywater-download':
         name==='media_open'?'/event/media/'+(params.media_type||'open'):
         name==='language_switch'?'/event/language/'+(params.target_language||'unknown'):
         '/event/'+name;
       window.goatcounter.count({path:feature,title:name,event:true});
     };
     bindEvents();
   });
   document.head.append(s);
 };

 if(cfg.provider==='ga4')startGa4();
 else if(cfg.provider==='goatcounter')startGoatCounter();
})();
