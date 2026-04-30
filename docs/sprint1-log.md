# Sprint 1 Log
## Hope, Inc. CMS — Week 1 & 2

## Sprint Goal
Project setup, full CMS database, Email + Google OAuth, login guard.

## Dates
- Start: Week 1
- End: Week 2

## Tasks Completed
| Task | Member | Status |
|------|--------|--------|
| GitHub repo created with main/dev branches | M1 | ✅ Done |
| Vite + React + Tailwind scaffolded | M1 | ✅ Done |
| Supabase JS client initialized | M1 | ✅ Done |
| React Router v6 + ProtectedRoute | M1 | ✅ Done |
| All placeholder pages wired | M1 | ✅ Done |
| Branch protection rules set | M1 | ✅ Done |
| Login page with email + Google button | M2 | ✅ Done |
| Register page with validation | M2 | ✅ Done |
| App Shell — Navbar + Sidebar | M2 | ✅ Done |
| Auth callback loading page | M2 | ✅ Done |
| Supabase project created | M3 | ✅ Done |
| All 5 tables created and seeded | M3 | ✅ Done |
| 82 customers seeded | M3 | ✅ Done |
| 52 products seeded | M3 | ✅ Done |
| 124 sales seeded | M3 | ✅ Done |
| 250+ salesDetail seeded | M3 | ✅ Done |
| 75 priceHist seeded | M3 | ✅ Done |
| 4 modules + 9 rights seeded | M3 | ✅ Done |
| SUPERADMIN seeded | M3 | ✅ Done |
| SQL saved to /db/migrations | M3 | ✅ Done |
| ERD committed to /docs | M3 | ✅ Done |
| AuthContext.jsx created | M4 | ✅ Done |
| Email signUp + signIn wired | M4 | ✅ Done |
| Google OAuth configured | M4 | ✅ Done |
| Login guard created | M4 | ✅ Done |
| provision_new_user trigger created | M4 | ✅ Done |
| Vitest + React Testing Library installed | M5 | ✅ Done |
| README.md updated | M5 | ✅ Done |
| Sprint 1 log created | M5 | ✅ Done |

## Blockers & Resolutions
| Blocker | Resolution |
|---------|------------|
| PowerShell blocked npm commands | Fixed with Set-ExecutionPolicy |
| Supabase URL had wrong project ID | Fixed by copying correct ID from Settings |
| React Strict Mode caused auth lock | Removed StrictMode from main.jsx |
| Supabase anon key was wrong format | Updated to eyJ... format key |

## Next Sprint Goals (Sprint 2)
- Build real Customer List page with 82 customers
- Add/Edit/Soft-Delete customer functionality
- Wire rights-based button gating
- Build Sales and Products view-only pages
- Set up RLS policies in Supabase
- Build Deleted Customers panel
