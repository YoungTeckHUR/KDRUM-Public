(()=>{
  const lang=(document.documentElement.lang||'en').toLowerCase();
  const base=lang.startsWith('ko')?'../assets/branding/':'assets/branding/';
  const navMark=document.querySelector('.site-mark');
  const heroMark=document.querySelector('.brand-symbol');

  if(navMark){
    navMark.src=base+'kdrum-symbol-compact.png';
    navMark.dataset.brandAsset='compact';
  }

  if(heroMark){
    heroMark.src=base+'kdrum-symbol-web.png';
    heroMark.dataset.brandAsset='web';
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
        overflow:hidden;
        border-radius:12px;
        background:#fff;
        box-shadow:0 10px 26px rgba(0,0,0,.24);
        flex:none;
      }
      .brand-symbol-frame .brand-symbol{
        width:100%;
        height:100%;
        padding:0;
        border-radius:0;
        background:transparent;
        box-shadow:none;
        object-fit:contain;
        transform:scale(1.16);
        transform-origin:center;
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
          padding:0;
          border-radius:0;
          transform:scale(1.16);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.documentElement.dataset.kdrumBrandRuntime='ready';
})();
