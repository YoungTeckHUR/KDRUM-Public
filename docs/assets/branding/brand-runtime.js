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
    // The approved compact asset trims presentation whitespace while retaining
    // the reviewed symbol artwork, so the hero does not need transform-based cropping.
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

  // Load the comprehensive capability atlas after branding has stabilized.
  // The atlas is bilingual and derives its asset path from the document language.
  if(!document.querySelector('script[data-kdrum-capability-atlas]')){
    const atlas=document.createElement('script');
    atlas.dataset.kdrumCapabilityAtlas='1';
    atlas.src=(ko?'../assets/':'assets/')+'capability-atlas.js';
    document.head.appendChild(atlas);
  }
})();