# Sprint 3 Log
## Hope, Inc. CMS — Week 5 & 6

## Sprint Goal
Admin Module, Reports, Deployment & Final Documentation

## Tasks Completed
| Task | Member | Status |
|------|--------|--------|
| product_revenue SQL view | M3 | ✅ Done |
| RLS for Admin Module | M3 | ✅ Done |
| Reports API service | M1 | ✅ Done |
| CustomerSalesSummaryPage | M2 | ✅ Done |
| TopCustomersPage with bar chart | M2 | ✅ Done |
| ProductRevenuePage | M2 | ✅ Done |
| Reports links in sidebar | M2 | ✅ Done |
| Final UI polish | M2 | ✅ Done |
| Deploy to Vercel | M1 | ✅ Done |
| Final RLS audit | M3 | ✅ Done |
| Sprint 3 test cases | M5 | ✅ Done |
| User Manual | M5 | ✅ Done |
| Sprint 3 log | M5 | ✅ Done |

## Test Results
- Sprint 1 tests: 6 passed
- Sprint 2 tests: 29 passed
- Sprint 3 tests: 8 passed
- Total: 43 tests passing

## Deployment
- Platform: Vercel
- URL: https://hopecms.vercel.app

## Blockers & Resolutions
| Blocker | Resolution |
|---------|------------|
| Report pages force logout | Fixed by granting SELECT on views |
| RLS blocking updates | Fixed with combined USING + WITH CHECK policies |