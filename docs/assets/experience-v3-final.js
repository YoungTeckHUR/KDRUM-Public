(()=>{
  const ko=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const base=ko?'../assets/':'assets/';
  const MYWATER='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
  const TERMS='https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127';
  const INSTITUTE='https://www.kwater.or.kr/kiwe/main.do';

  function loadFinalCss(){
    if(document.querySelector('link[data-kdrum-experience-v3-final]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=base+'experience-v3-final.css';
    link.dataset.kdrumExperienceV3Final='1';
    document.head.appendChild(link);
  }

  function rebuildDownloadPanel(){
    const official=document.querySelector('#references .official');
    if(!official)return;
    official.classList.add('ev3-download-panel','mywater-callout-v2');

    const info=official.querySelector(':scope>div');
    if(info){
      info.innerHTML=ko?
        `<span class="mywater-kicker">공식 배포 경로</span>
         <h3>K-water 기술 SW 대국민 개방 및 K-DRUM 다운로드</h3>
         <p class="ev3-download-summary"><strong>K-DRUM은 MyWater 물정보포털의 K-Series에서 무료로 내려받아 사용할 수 있습니다.</strong> 다운로드 버전과 사용조건은 MyWater에 게시된 최신 K-Series 안내 및 이용약관을 확인해 주세요.</p>
         <div class="ev3-download-actions"><a href="${MYWATER}">K-DRUM 다운로드</a><a href="${TERMS}">이용약관 확인</a><a class="ev3-download-text-link" href="${INSTITUTE}">K-water 연구원</a></div>`:
        `<span class="mywater-kicker">Official distribution channel</span>
         <h3>K-water public access to technical software and K-DRUM download</h3>
         <p class="ev3-download-summary"><strong>K-DRUM can be downloaded through the MyWater K-Series portal and used free of charge under the published terms.</strong> Please confirm the current version and terms of use on MyWater.</p>
         <div class="ev3-download-actions"><a href="${MYWATER}">Download K-DRUM</a><a href="${TERMS}">Terms of use</a><a class="ev3-download-text-link" href="${INSTITUTE}">K-water Research Institute</a></div>`;
    }

    let primary=official.querySelector(':scope>a.ev3-download-primary');
    if(!primary){
      primary=official.querySelector(':scope>a');
      if(!primary){
        primary=document.createElement('a');
        official.appendChild(primary);
      }
    }
    primary.className='ev3-download-primary';
    primary.href=MYWATER;
    primary.removeAttribute('target');
    primary.removeAttribute('rel');
    primary.setAttribute('aria-label',ko?'MyWater K-Series K-DRUM 무료 다운로드 페이지 열기':'Open the K-DRUM free download page in MyWater K-Series');
    primary.innerHTML=ko?
      '<span><b>MyWater K-Series</b><small>K-DRUM 무료 다운로드 페이지</small></span><strong>확인하기 →</strong>':
      '<span><b>MyWater K-Series</b><small>K-DRUM free download page</small></span><strong>Open →</strong>';
    official.dataset.ev3DownloadFinal='1';
  }

  function finalize(){
    loadFinalCss();
    rebuildDownloadPanel();
    document.documentElement.dataset.kdrumExperienceV3Final='ready';
  }

  let tries=0;
  const timer=setInterval(()=>{
    tries+=1;
    if(document.documentElement.dataset.kdrumExperienceV3==='ready'||tries>120){
      clearInterval(timer);
      finalize();
    }
  },50);
})();
