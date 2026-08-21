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
      .brand-symbol{
        width:88px;
        height:88px;
        padding:2px;
        border-radius:12px;
        background:#fff;
        object-fit:contain;
        box-shadow:0 10px 26px rgba(0,0,0,.24);
        flex:none;
      }
      @media(max-width:640px){
        .brand-symbol{
          width:64px;
          height:64px;
          padding:2px;
          border-radius:10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.documentElement.dataset.kdrumBrandRuntime='ready';
})();
