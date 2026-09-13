# K-DRUM 공개 홈페이지 한영 문체 검토

문체 정리 비교 기준: `7c04da903d5608bb1926b5e220533d680ba3a809` (PR #50 슬라이드 비율 수정 후).

K-DRUM 개발 주체가 기술을 설명하는 공식 홈페이지 문체로 정리했습니다.
사용자에게 검토 절차를 지시하는 문장은 기술 개요, 입력·계산, 결과 및
적용 범위를 설명하는 문장으로 변경했습니다. 버튼, 확대·키보드 안내 등
실제 UI 조작에 필요한 동작 표현은 유지했습니다.

## 대표 문장 및 제목 15개

| 대상 | 수정 전 | 수정 후 |
|---|---|---|
| 한글 홈 · 기능 제목 | 기능과 적용 범위를 함께 확인하세요. | 주요 기능과 적용 범위 |
| 영문 홈 · 기능 제목 | Explore capabilities and their boundaries. | Capabilities and application scope |
| 한글 기능 상세 제목 | 계산에 연결되는 자료와 과정 | 주요 입력 및 계산 |
| 영문 기능 상세 제목 | How to interpret this capability | Technical overview |
| 한글 기능 상세 · 강우 | 관측소·레이더·격자 강우를 계산격자에 공간적으로 적용합니다. | K-DRUM은 관측소·레이더·격자 강우를 계산격자에 공간적으로 적용합니다. |
| 영문 기능 상세 · 강우 | Apply gauge, radar or gridded rainfall spatially to computational cells. | K-DRUM applies gauge, radar or gridded rainfall spatially to computational cells. |
| 한글 기능 상세 · 실행 리포트 | 관측·예측·결측 시간수를 요약해 강우자료 상태를 실행 리포트에서 확인합니다. | 실행 리포트는 관측·예측·결측 시간수를 요약하여 강우자료 상태를 제공합니다. |
| 영문 기능 상세 · DWNET | Develop cross-section-based dynamic-wave water level/discharge on river networks. | DWNET is under development for cross-section-based dynamic-wave water-level and discharge calculations on river networks. |
| 한글 기능 상세 · 수질 | 현재 생산기능으로 소개하지 않고 재개발 후보로만 표시합니다. | 현재 생산기능에 포함되지 않는 재개발 후보입니다. |
| 한글 연구사례 | 유역에 쌓인 눈이 녹는 과정을 장기유출 모의에 어떻게 반영할까요? | 유역의 적설과 융설을 반영한 장기유출 모의 |
| 영문 결과 설명 | Align units and time intervals before reviewing peaks, timing and recession behavior in observations and calculations. | Hydrographs support comparison of observed and calculated peaks, timing and recession behavior using consistent units and time intervals. |
| 한글 FAQ · 배포 | 실제 배포 버전과 사용조건은 MyWater의 최신 안내와 이용약관을 확인하세요. | 실제 배포 버전과 사용조건은 MyWater의 최신 안내와 이용약관을 기준으로 합니다. |
| 영문 다운로드 | Do not assume every development feature on this website is included in the downloadable package. | The current development line and the distributed package may differ in their included capabilities. |
| 한글 시각자료 · 공개 범위 | 편집 가능한 PPT 원본은 공개 배포본에서 제외합니다. | 편집 가능한 PPT 원본은 공개 배포본에 포함되지 않습니다. |
| 영문 footer | Public technical information. Consult the public documents for capability scope and development status. | K-DRUM public technical information. Public technical documents define capability scope and development status. |

## 검토 범위와 일관성

- 영문 홈, 한글 홈, Visual Guide, Model Guide의 현재 활성 페이지 4개를 검토했습니다.
- 8개 분야와 46개 기능 상세의 한영 설명을 모두 대조했습니다. 공통 제목은
  `주요 입력 및 계산 / Inputs and computation`, `기술 개요 / Technical overview`,
  `개발 및 공개 상태 / Development and availability`로 통일했습니다.
- 연구사례 3개와 FAQ 6개를 한영 모두 검토했습니다. 연구사례의 대화형 질문은
  연구 주제 설명으로 바꾸었고 FAQ의 질문 형식은 유지했습니다.
- 두 언어의 결과 설명, 프로그램, 배포, Model Guide 도입, footer와 미디어
  안내를 검토했습니다. SVG 12개를 검토하여 9개 파일의 텍스트를 정리했습니다.
- 생성된 네 페이지에서 지정 지시형 및 대표 영어 명령형 문장을 검색한
  잔존 후보는 0건입니다. 이 검색은 의미 검토를 대신하지 않으며, 전체
  문장 대조와 독립 검토를 함께 수행했습니다.
- 활성 페이지에서 불러오지 않는 이전 런타임 자료와 원본 PDF·영상·슬라이드는
  이번 문체 변경 대상에서 제외했습니다.

## 기술적 의미 및 구조 보존

- 46개 기능의 ID, 그룹, 상태, 기술명, 시각화 연결은 비교 기준과 동일합니다.
- Core 확립 기능, 구현·QA, 개발, 제한된 개발검증, 연구, 비활성·재개발,
  릴리스 후보, 실험, 별도 개발·미공개 상태를 유지했습니다.
- 기능별 개발 상태와 실제 배포본의 포함 범위는 별개입니다. Core v3.x와
  MyWater 배포본의 차이, 실시간 운영인증의 비보장, 제어된 검증과 실유역
  적용성의 차이를 유지했습니다.
- AI 영상은 실제 K-DRUM 수치모의 결과가 아니라는 한영 문구를 그대로
  유지했습니다. 미디어 18개 상태표 및 파일 대응도 동일합니다.
- 연구사례의 연도, 대상·방법, 논문 제목·출처 링크와 FAQ source ID는
  변경하지 않았습니다. 새 연구 결과나 기능을 추가하지 않았습니다.
- 네 HTML의 요소·속성 구조, URL, canonical/hreflang, 런타임 연결은
  동일합니다. 비교에서는 본문 문체에 해당하는 alt·캡션·접근성 레이블과
  meta description만 제외했습니다.
- SVG 12개의 XML이 유효하며 텍스트 이외 도형·좌표·스타일·속성은 동일합니다.
- 기존 정적 검사의 문장 전체 일치 조건은 이번 승인된 문체 수정에 맞춰
  기능 ID·기술명·그룹·상태·시각화 연결 불변 검사로 조정했습니다.
  한영 요약·상태 설명의 존재 여부와 별도 뷰어 상태도 검사합니다.
  문장의 의미 보존은 자동 검증 결과만으로 단정하지 않고 원문 대조와
  독립 검토를 통해 확인했습니다.

## 검증과 전달

- 로컬 정적 경로·자료·상태 검사 및 `git diff --check`: PASS.
- 한영 홈 × 320/390/768/1440px: PASS. 기능 46개 확장, 검색·필터,
  확대·키보드·모바일 가로 넘침과 no-JavaScript 표시를 검사했습니다.
- Visual Guide 한영 × 390/768/1440px: PASS. 슬라이드 16:9 비율,
  18개 이미지·확대, PDF 응답·링크, MP4 재생·탐색·종료와 언어 전환을 검사했습니다.
- Model Guide의 한영 FAQ 12개와 canonical 검사: PASS.
- SVG 12개의 실제 렌더링 텍스트 경계 검사: PASS. 수정된 도식과 한영 기능
  상세 화면을 이미지로 확인했습니다.
- 최종 커밋의 GitHub CI 결과와 SHA는 PR #50에 기록합니다.

PR #50의 슬라이드 비율 수정에 후속 커밋으로 추가하며 main 병합과 Pages
배포는 수행하지 않습니다. 문체 수정 당시 남아 있던 p18 카드 제목·슬라이드
내용 어긋남은 후속 보완에서 PDF 4-21쪽으로 교정했습니다. 해당 이미지 교정과
타이포그래피 검증은 `PR50_FINAL_REVIEW.md`에 별도로 기록합니다.
