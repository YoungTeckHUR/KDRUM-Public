# Typography and card balance — 2026-09-19

Baseline: 40ded09b5cc7217153626fff156b652dcffebfdd.

## Rationale
The approved site had 14.88px capability summaries, 15.2px detail text, 15.04px program text, 12px maturity labels and uneven closed-card/link alignment. This pass changes presentation only.

## Change
Use 16px body text in feature details, summaries, programs and research; 18px capability names and 16px detail headings; 13px maturity labels; 14px small captions and concept links; 15px thumbnail descriptions. Improve Korean phrase wrapping, equal-height closed-card rows and bottom-aligned concept links without fixed maximum heights. Reduce excess space before links inside the four supplementary notes.

## Preserved
All public files except the appended stylesheet are byte-identical to baseline: 46 capability records, HTML, JavaScript/search/share behavior, images, PDF/video/QR, SEO and disabled analytics. Hero/section title sizing, page width, image sizing, main/2x2 layout and colors are unchanged. No new images, redesign, external fonts or dependencies.

## Verification
The new audit compares the exact baseline CSS with the candidate on the same pages at seven widths in both languages, checks unchanged content/headings, measured font sizes, closed-card and concept-link alignment, reflow/clipping and two no-JavaScript cases. Existing 184 feature checks, 14 navigation cases, media and live checks remain enabled. The old density audit now explicitly expects 16px card body; its remaining bounds and baseline are unchanged. Final CI/live outcomes are recorded in the PR, not on the public website.

## Rollback
Revert the final PR with a new commit. Never reset history. One-time preparation files are removed before merge.
