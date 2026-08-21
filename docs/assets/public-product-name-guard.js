(()=>{
  if(!(document.documentElement.lang||'').toLowerCase().startsWith('ko'))return;
  function fix(){
    const card=document.querySelector('.catlas-card[data-id="viewer"] h4');
    if(card&&card.textContent!=='FloodViewer')card.textContent='FloodViewer';
    const dlg=document.getElementById('catlas-dialog');
    if(dlg?.open){
      const title=dlg.querySelector('#catlas-title');
      if(title?.textContent==='Flood뷰어')title.textContent='FloodViewer';
    }
  }
  fix();
  document.addEventListener('click',e=>{
    if(e.target.closest('.catlas-tab')||e.target.closest('.catlas-card[data-id="viewer"]'))queueMicrotask(fix);
  });
  document.documentElement.dataset.kdrumProductNames='ready';
})();