# Hope, Inc. — Customer Management System (CMS)

> A full-stack Customer Management System built for Hope, Inc. as a BS Information Technology capstone project.

**🌐 Live Demo:** https://hopecms-589r.vercel.app

---

## 📌 Project Overview

The Hope, Inc. CMS is a 6-week capstone project that manages customer records, sales history, product catalogue, and user access rights. It enforces a strict rights-based access control system with three user types and nine granular permissions.

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | Frontend framework |
| Vite | Latest | Build tool |
| Tailwind CSS | v3 | UI styling |
| Supabase | v2 | Database + Authentication |
| React Router | v6 | Client-side routing |
| Lucide React | Latest | Icons |
| Vitest | Latest | Unit testing |
| Vercel | — | Deployment |

---

## 📁 Project Structure

hopecms/
├── src/
│   ├── components/
│   │   └── AppShell.jsx          # Layout: sidebar + navbar
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth state + login guard
│   │   └── UserRightsContext.jsx  # Rights loading + useRights hook
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── AuthCallbackPage.jsx
│   │   ├── CustomersPage.jsx      # Full CRUD
│   │   ├── CustomerDetailPage.jsx # Sales drill-down
│   │   ├── SalesPage.jsx          # View only
│   │   ├── ProductsPage.jsx       # View only
│   │   ├── DeletedCustomersPage.jsx
│   │   └── AdminPage.jsx
│   ├── services/
│   │   ├── customerService.js
│   │   ├── salesService.js
│   │   └── productService.js
│   └── tests/
│       ├── sprint1-auth-flows.test.jsx
│       ├── sprint2-rights.test.jsx
│       └── sprint3-reports.test.jsx
├── db/
│   └── migrations/
│       ├── 01_initial_schema.sql
│       ├── 02_rights_seed.sql
│       ├── 03_verify_seed.sql
│       ├── 04_trigger_provision_user.sql
│       ├── 05_rls_customer.sql
│       ├── 06_rls_view_only.sql
│       ├── 07_view_product_current_price.sql
│       ├── 08_view_customer_sales_summary.sql
│       └── 09_view_product_revenue.sql
├── docs/
│   ├── ERD.md
│   ├── sprint1-log.md
│   ├── sprint2-log.md
│   ├── sprint3-log.md
│   └── user-manual.md
├── .github/
│   └── pull_request_template.md
├── .env.example
├── vercel.json
└── README.md

---

## 🗄️ Database Design

### HopeDB Tables (5 tables)

| Table | Role | CRUD? | Records |
|---|---|---|---|
| customer | Primary managed entity | Full CRUD (no hard delete) | 82 rows |
| sales | Purchase transactions | View only | 124 rows |
| salesDetail | Line items per transaction | View only | ~268 rows |
| product | Product catalogue | View only | 57 rows |
| priceHist | Price history per product | View only | 68 rows |

> ⚠️ Only `customer` has `record_status` and `stamp` columns added. All other tables are used as-is from HopeDB.

### Rights Tables (5 tables)

| Table | Purpose |
|---|---|
| user | CMS user accounts (USER / ADMIN / SUPERADMIN) |
| Module | 4 modules: Cust_Mod, Sales_Mod, Prod_Mod, Adm_Mod |
| rights | 9 rights: CUST_VIEW/ADD/EDIT/DEL, SALES_VIEW, SD_VIEW, PROD_VIEW, PRICE_VIEW, ADM_USER |
| user_module | Links users to modules |
| UserModule_Rights | Stores each user's right value (0 or 1) |

### SQL Views

| View | Purpose |
|---|---|
| product_current_price | Latest priceHist entry per product |
| customer_sales_summary | Total transactions + spend per customer |

---

## 🔐 Rights Matrix

| Right | SUPERADMIN | ADMIN | USER |
|---|---|---|---|
| CUST_VIEW | ✅ 1 | ✅ 1 | ✅ 1 |
| CUST_ADD | ✅ 1 | ✅ 1 | ❌ 0 |
| CUST_EDIT | ✅ 1 | ✅ 1 | ❌ 0 |
| CUST_DEL | ✅ 1 | ❌ 0 | ❌ 0 |
| SALES_VIEW | ✅ 1 | ✅ 1 | ✅ 1 |
| SD_VIEW | ✅ 1 | ✅ 1 | ✅ 1 |
| PROD_VIEW | ✅ 1 | ✅ 1 | ✅ 1 |
| PRICE_VIEW | ✅ 1 | ✅ 1 | ✅ 1 |
| ADM_USER | ✅ 1 | ✅ 1 | ❌ 0 |

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/JanReyValloyas/hopecms.git
cd hopecms
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env`:

### 4. Run development server
```bash
npm run dev
```

### 5. Open in browser

---

## 🧪 Running Tests

```bash
npx vitest run
```

| Sprint | Test File | Tests | Status |
|---|---|---|---|
| Sprint 1 | sprint1-auth-flows.test.jsx | 6 | ✅ Passing |
| Sprint 2 | sprint2-rights.test.jsx | 23 | ✅ Passing |
| Sprint 3 | sprint3-reports.test.jsx | 8 | ✅ Passing |
| **Total** | | **37** | ✅ **All Passing** |

---

## 📋 Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code — auto deploys to Vercel |
| `dev` | Stable development base |
| `feat/*` | New features (e.g. feat/ui-login-page) |
| `fix/*` | Bug fixes |
| `db/*` | Database migrations and views |
| `test/*` | Test files |
| `docs/*` | Documentation updates |

> ⚠️ No direct pushes to `main` or `dev`. All changes require Pull Requests.

---

## 🏃 Sprint Summary

### Sprint 1 — Weeks 1 & 2 — Project Setup, Database & Authentication
- ✅ GitHub repo with branching strategy
- ✅ Vite + React 18 + Tailwind scaffolded
- ✅ Supabase project + all 10 tables seeded
- ✅ Email + Google OAuth authentication
- ✅ Login guard (blocks INACTIVE users)
- ✅ provision_new_user() trigger

### Sprint 2 — Weeks 3 & 4 — Customer CRUD & Rights Enforcement
- ✅ Full Customer CRUD (Add, Edit, Soft Delete, Recover)
- ✅ Sales drill-down (Customer → Transactions → Line Items)
- ✅ Product Catalogue (view-only)
- ✅ Rights-gated buttons and sidebar links
- ✅ RLS policies on all tables
- ✅ SQL views: product_current_price, customer_sales_summary

### Sprint 3 — Weeks 5 & 6 — Reports, Deployment & Documentation
- ✅ Customer Sales Summary report page
- ✅ Deployed to Vercel
- ✅ Final RLS audit and security fixes
- ✅ User manual completed
- ✅ 37 tests passing

---

## 👥 Team Members

| Member | Role |
|---|---|
| M1 | Project Lead / Full-Stack Developer |
| M2 | Frontend Developer (UI/UX) |
| M3 | Backend / Database Engineer |
| M4 | Rights & Authentication Specialist |
| M5 | QA / Documentation Specialist |

---

## 🚀 Deployment

- **Platform:** Vercel
- **URL:** https://hopecms-589r.vercel.app
- **Branch:** main (auto-deploy on merge)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

*© 2026 Hope, Inc. Customer Management System — BS Information Technology Capstone Project*
