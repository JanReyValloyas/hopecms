# Sprint 2 Log
## Hope, Inc. CMS — Week 3 & 4

## Sprint Goal
Customer CRUD, Sales Views & Rights Enforcement

## Tasks Completed
| Task | Member | Status |
|------|--------|--------|
| Customer service functions | M1 | ✅ Done |
| Sales service functions | M1 | ✅ Done |
| Product service functions | M1 | ✅ Done |
| UserRightsContext + useRights hook | M4 | ✅ Done |
| CustomerListPage with stamp gating | M2 | ✅ Done |
| AddCustomerModal | M2 | ✅ Done |
| EditCustomerModal | M2 | ✅ Done |
| SoftDeleteConfirmDialog | M2 | ✅ Done |
| CustomerDetailPage + SalesHistoryPanel | M2 | ✅ Done |
| ProductCataloguePage | M2 | ✅ Done |
| DeletedCustomersPage | M2 | ✅ Done |
| SalesPage | M2 | ✅ Done |
| AdminPage with SUPERADMIN protection | M2 | ✅ Done |
| RLS on customer table | M3 | ✅ Done |
| RLS on view-only tables | M3 | ✅ Done |
| product_current_price view | M3 | ✅ Done |
| customer_sales_summary view | M3 | ✅ Done |
| Rights gating on buttons | M4 | ✅ Done |
| Sidebar link gating | M4 | ✅ Done |
| 27-case rights test matrix | M5 | ✅ Done |
| View-only enforcement tests | M5 | ✅ Done |

## Test Results
- Total tests: 29
- Passed: 29
- Failed: 0

## Blockers & Resolutions
| Blocker | Resolution |
|---------|------------|
| Column names lowercase in Supabase | Fixed by using lowercase column names |
| Sales page blank | Fixed salesService.js column names |
| Products not loading | Fixed productService.js column names |

## Next Sprint Goals (Sprint 3)
- Build Admin Module API
- Build CMS Reports pages
- Deploy to Vercel/Netlify
- Final documentation
- 12-slide presentation