# Browser comparison fixtures

`layout-before-2fc00db.css` is an exact copy of `docs/assets/site.css` from
commit `2fc00db164a0d6d6d8ef6e78ebed745317d0a7ae`, before the PR #50 laptop
typography update. Its SHA-256 with LF line endings is
`077de95bd118ae8d560e9bf4a296f63f679aaaaa14b17b4707b60e39c79ec8c2`.

The layout audit supplies this stylesheet only inside an isolated comparison
browser context. Current copy and corrected images remain identical between
the before/after captures. The website never loads this file. Keeping the
fixture in Git makes the comparison reproducible after a squash merge or
deletion of the original PR branch.
