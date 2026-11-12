# 토양온도·하천수온 / Soil and river temperature

## 2026-11-13 정본 개발 현황 / Latest canonical-development status

2026년 11월 12일 기준 Core **v3.0.5.18**의 실제 섬진강 335시간 결합 실행에서 유역 운동파·선택 1D 하천수리·토양/하천수온·보존성 Dye가 함께 실행되고 지원 재시작을 비교했습니다. **완료된 실행에도 물수지 경고(2.416%)가 보고**되었습니다. 이는 관측 온도 정확도 인증이 아니며, 기존 Viewer의 실제 온도 표시 및 MyWater 공식 배포 포함을 보장하지 않습니다. / Canonical development Core **v3.0.5.18** exercised coupled watershed routing, selected river hydraulics, soil/river temperature and conservative Dye during a 335-hour Seomjin run with selected restart checks. **The completed run retained a 2.416% water-balance warning.** This is neither observation-based thermal accuracy certification nor confirmation of temperature rendering or inclusion in the current MyWater package.

[최신 개발·검증 현황 / Latest development and evidence](DEVELOPMENT_UPDATE_20261113.md).

## 2026-11-05 최초 시험기록 / Original trial evidence (retained)

Updated 2026-11-05. 기능 구현 · 시험유역 동작 확인 · 정식 배포 예정.
Implemented in a development candidate; trial-basin operation checked; official distribution planned.
This feature is not presented as part of the current MyWater installer.

## 계산 범위 / Implemented scope

- A/B/C/D soil temperatures: moisture-dependent thermal properties, atmospheric and interlayer conduction, snow insulation.
- River temperature: sensible heat associated with meltwater, runoff and soil-water input, heat transport using accepted 1D hydraulic water volumes, and linear air–water heat exchange.
- Initial states: generation using representative or actual prestart meteorology; compatible initial-state storage and reuse.
- Results: four soil-layer temperature fields and one river-temperature field in NetCDF. Actual temperature rendering in the existing Viewer has not been verified.

기온·토양수분·적설에 따른 지온과 유출수의 현열을 하천수온에 연결합니다. 직접 단파·장파복사, 증발·승화 잠열, 하상전도와 동결·하천결빙은 현재 범위에 포함하지 않습니다.
Direct shortwave/longwave radiation, evaporation/sublimation latent heat coupling, conductive riverbed exchange and freezing/river ice are not included.

## 홈페이지 그래프의 시험조건 / Chart conditions

Source: the model developer's recorded native Seomjin climate trials, reviewed 2026-11-04, with follow-up 2026-11-05 checks. The displayed warm-versus-baseline results were unchanged by the later snow warm-up aggregation correction. The public charts use recorded endpoint values, not interpolated or generated time series.

- Simulation period: 2020-07-29 00:00–12:00; 36 accepted 20-minute intervals; 12 hourly NetCDF frames.
- Baseline and warm cases use active evapotranspiration (I_EVA=1).
- Warm forcing: shift post-initial hourly air temperature and dewpoint together by +15°C. Preserve the first record. Dewpoint depression is retained; relative humidity is not prescribed constant.
- Soil comparison: one fixed cell (flattened NetCDF position 60, 1-based); four layers.
- River comparison: one fixed river cell (flattened NetCDF position 49434, 1-based) and the arithmetic mean over 548 wet river cells. These are not the same spatial statistic, not independent trials and not volume-weighted means.
- Positions above are output-array positions, not DWNET CellIDs.

| 12 h endpoint quantity | Warm − baseline [°C] |
|---|---:|
| Soil A, fixed cell | 5.6757965 |
| Soil B, fixed cell | 1.3896446 |
| Soil C, fixed cell | 0.2219543 |
| Soil D, fixed cell | 0.000816345 |
| River, fixed cell | 0.4426861 |
| River, arithmetic mean of 548 wet cells | 2.9064604 |

토양 표층은 크게, 깊은 층은 작게 반응한 단기 민감도 결과입니다. 하천의 한 격자와 전체 유효 하천격자 평균이 다른 것은 위치별 수리·열 조건이 다르기 때문이며, 두 값을 같은 지점의 변화로 읽지 않습니다.
These short trials show stronger upper-soil than deep-soil responses. River temperatures vary spatially; a point response and a spatial average must not be read as changes at the same location.

## 확인한 항목과 남은 검증 / Evidence and remaining validation

Trial-basin ON/OFF runs, cool/warm forcing, cold-to-warm transition and sunshine-duration cases completed. Checks covered valid temperature fields, units, masks and time coordinates. Generated and reused initial-state runs produced matching output variables in the tested configurations. Focused native tests covered soil conduction, insulation, sensible heat transport and atmospheric warming/cooling. Follow-up focused two-rank communication and a short structure-free synthetic restart test also passed; they do not establish full-basin MPI or reservoir restart support.

일조시간 시험은 수문·증발산을 통한 간접 반응을 검토한 것으로, 직접 일사 가열을 검증한 시험이 아닙니다. 초기 하천 측방유입 정보가 부족한 경우 토양 기반 초기수온 추정 경로를 사용하므로 관측 초기수온과 같다고 가정하지 않습니다.
Sunshine-duration trials concern indirect hydrologic/ET response, not direct radiative heating. A soil-based initial river-temperature estimate may be used where initial lateral information is incomplete; it is not an observed initial temperature.

관측 지온·수온 정확도, 장기 계절 반응, 실유역 다중-rank MPI 동등성, 지원 유역의 장시간 재시작과 Viewer 실제 표출은 후속 검증 항목입니다. 이 자료는 구현 및 시험 반응의 설명이며 정확도 인증이나 정식 배포 완료 안내가 아닙니다.
Observed soil/river-temperature accuracy, long-term seasonal behavior, real-basin multi-rank parity, longer supported-basin restarts and actual Viewer temperature rendering remain separate verification items.
