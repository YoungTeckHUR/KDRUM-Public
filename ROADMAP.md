# K-DRUM 개선·확장 계획 / Refinement and extension roadmap

**Reviewed: 2026-10-28**

## Completed calculation foundation / 완료된 계산 기능

1D river-network hydraulics, 2D local-inertial inundation and two-way exchange are complete; they are not future milestones. Full SWE is complete within supported configurations. Existing watershed hydrology, state/output and conservation functions provide the foundation.

1D 하천수리·2D 국부관성 범람·양방향 연계는 완료 기능이며 향후 개발 예정 항목으로 다시 표시하지 않습니다. Full SWE는 지원 구성 안에서 선택합니다.

## Further work / 후속 개선

Refine computational performance and diagnostics without conflating speed with numerical accuracy. Expand basin-specific application evidence through measured geometry, observed stage/flow and inundation comparisons. Improve user-facing setup, error recovery and result interpretation in the new K-DRUM Studio, keeping prior InputStudio and separate Viewer provenance clear.

계산 효율·진단·사용성을 개선하고 유역별 단면·관측자료·침수 비교 사례를 확충합니다. 새 K-DRUM Studio의 프로젝트·제어·실행·분석 연결은 별도 도구 개발 과제입니다.

## Research / 연구 기능

Sediment/tracer and the independent Estuary2DV model retain explicit research scope. The inactive water-quality process module requires separate redevelopment before it is described as available.

## Publication / 공개

Update implementation, validation and distribution independently. Official installation packages and licensing follow [MyWater](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list); technical pages should not imply that every current option is bundled in an older official release.
