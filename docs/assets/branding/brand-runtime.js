(()=>{
  const lang=(document.documentElement.lang||'en').toLowerCase();
  const ko=lang.startsWith('ko');
  const base=ko?'../assets/branding/':'assets/branding/';
  const navMark=document.querySelector('.site-mark');
  const heroMark=document.querySelector('.brand-symbol');

  if(navMark){
    navMark.src=base+'kdrum-symbol-compact.png';
    navMark.dataset.brandAsset='compact';
  }

  if(heroMark){
    heroMark.src=base+'kdrum-symbol-compact.png';
    heroMark.dataset.brandAsset='compact-hero';
    if(!heroMark.parentElement?.classList.contains('brand-symbol-frame')){
      const frame=document.createElement('span');
      frame.className='brand-symbol-frame';
      heroMark.before(frame);
      frame.appendChild(heroMark);
    }
  }

  if(!document.getElementById('kdrum-brand-balance')){
    const style=document.createElement('style');
    style.id='kdrum-brand-balance';
    style.textContent=`
      .site-mark{
        width:32px;
        height:32px;
        padding:1px;
        border-radius:6px;
        background:#fff;
        object-fit:contain;
        flex:none;
      }
      .brand-symbol-frame{
        width:82px;
        height:82px;
        display:grid;
        place-items:center;
        overflow:visible;
        border-radius:12px;
        background:#fff;
        box-shadow:0 10px 26px rgba(0,0,0,.24);
        flex:none;
      }
      .brand-symbol-frame .brand-symbol{
        width:100%;
        height:100%;
        padding:1px;
        border-radius:11px;
        background:#fff;
        box-shadow:none;
        object-fit:contain;
        transform:none;
        flex:none;
      }
      .mywater-link-badge{
        width:112px;
        min-height:112px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:2px;
        padding:10px 8px;
        border-radius:9px;
        background:#fff;
        color:#075795;
        text-align:center;
        line-height:1.2;
        box-shadow:0 5px 18px rgba(0,0,0,.18);
      }
      .mywater-link-badge strong{font-size:1rem;color:#075795}
      .mywater-link-badge span{font-size:.82rem;font-weight:800;color:#0b6cae}
      .mywater-link-badge small{margin-top:5px;font-size:.7rem;font-weight:800;color:#31566e}
      @media(max-width:640px){
        .brand-symbol-frame{
          width:60px;
          height:60px;
          border-radius:9px;
        }
        .brand-symbol-frame .brand-symbol{
          width:100%;
          height:100%;
          padding:1px;
          border-radius:8px;
          transform:none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.documentElement.dataset.kdrumBrandRuntime='ready';

  function finalizePublicCopy(){
    const viewer=document.querySelector('[data-kdrum-1d-viewer],[data-kdrum1d-viewer]');
    if(viewer)viewer.setAttribute('data-kdrum-1d-viewer','1');

    const official=document.querySelector('#references .official');
    const oldImage=official?.querySelector('img');
    const link=oldImage?.closest('a');
    if(link&&oldImage){
      link.href='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
      link.target='_blank';
      link.rel='noopener';
      link.setAttribute('aria-label',ko?'MyWater K-Series에서 K-DRUM 확인':'Open K-DRUM in MyWater K-Series');
      const badge=document.createElement('span');
      badge.className='mywater-link-badge';
      badge.innerHTML=ko
        ?'<strong>MyWater</strong><span>K-Series</span><small>K-DRUM 확인 →</small>'
        :'<strong>MyWater</strong><span>K-Series</span><small>Open K-DRUM →</small>';
      oldImage.replaceWith(badge);
    }

    document.documentElement.dataset.kdrumPublicCopyLinked='ready';
  }

  function loadPublicCopy(){
    const existing=document.querySelector('script[data-kdrum-public-copy]');
    if(existing){
      if(document.documentElement.dataset.kdrumPublicCopy==='ready')finalizePublicCopy();
      else existing.addEventListener('load',finalizePublicCopy,{once:true});
      return;
    }
    const copy=document.createElement('script');
    copy.dataset.kdrumPublicCopy='1';
    copy.src=(ko?'../assets/':'assets/')+'public-copy-runtime-v2.js';
    copy.addEventListener('load',finalizePublicCopy,{once:true});
    document.head.appendChild(copy);
  }

  function loadViewerRuntime(){
    const existing=document.querySelector('script[data-kdrum-viewer-runtime]');
    if(existing){
      if(document.documentElement.dataset.kdrumViewerRuntime==='ready')loadPublicCopy();
      else existing.addEventListener('load',loadPublicCopy,{once:true});
      return;
    }
    const viewer=document.createElement('script');
    viewer.dataset.kdrumViewerRuntime='1';
    viewer.src=(ko?'../assets/':'assets/')+'public-viewer-runtime.js';
    viewer.addEventListener('load',loadPublicCopy,{once:true});
    document.head.appendChild(viewer);
  }

  const existingAtlas=document.querySelector('script[data-kdrum-capability-atlas]');
  if(!existingAtlas){
    const atlas=document.createElement('script');
    atlas.dataset.kdrumCapabilityAtlas='1';
    atlas.src=(ko?'../assets/':'assets/')+'capability-atlas.js';
    atlas.addEventListener('load',loadViewerRuntime,{once:true});
    document.head.appendChild(atlas);
  }else if(document.documentElement.dataset.kdrumCapabilityAtlas==='ready'){
    loadViewerRuntime();
  }else{
    existingAtlas.addEventListener('load',loadViewerRuntime,{once:true});
  }
})();
