<div align="center">

# 🖥️ Product Catalog - Admin Panel

### A production-grade admin dashboard built with Next.js 15, TypeScript & Tailwind CSS

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br/>

> A fully-featured, type-safe **admin dashboard** that connects to the [Product Catalog REST API](https://github.com/6ixline/nodejs-express-rest-api) - built with the latest Next.js App Router, server-side route protection, and a clean component architecture.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Architecture](#-architecture)
- [Authentication Flow](#-authentication-flow)
- [Component System](#-component-system)
- [API Integration](#-api-integration)
- [Related Project](#-related-project)

---

## 🔍 Overview

This is the **frontend admin panel** for the Product Catalog platform. It provides a full management interface for admins to handle dealers, products, enquiries, internal users, and platform metrics - all in a responsive, dark-mode-ready dashboard.

Built with the **Next.js 15 App Router** and **React 19**, it uses the latest patterns including route groups, middleware-based auth guards, and server/client component separation.

Key design decisions:
- ✅ **Type-safe throughout** - every API response, form, and component is fully typed with TypeScript
- ✅ **Smart data fetching** - TanStack Query handles caching, pagination, and background refetching
- ✅ **Token refresh handled automatically** - Axios interceptors silently refresh expired tokens
- ✅ **Route protection at the edge** - Next.js middleware guards all protected routes before render
- ✅ **Form validation with schema** - React Hook Form + Zod for runtime-safe form handling

---

## ✨ Features

<table>
<tr>
<td>

**📊 Dashboard**
- Live metrics - Dealers, Products, Enquiries, Internal Users
- Real-time count cards with navigation shortcuts
- Dark mode support across all components
- Responsive grid layout

</td>
<td>

**👥 User Management**
- Dealer management - full CRUD + bulk delete
- Internal user management - full CRUD
- Paginated data tables with search & sort
- Bulk selection and bulk status updates

</td>
</tr>
<tr>
<td>

**📦 Product Management**
- Product listing with advanced filters (make, category, status)
- Create / edit product forms with validation
- Bulk delete and bulk status update
- Reference code and keyword search

</td>
<td>

**📩 Enquiry Management**
- View all enquiries with filters
- Update status, priority, and remarks
- Bulk delete enquiries
- Enquiry detail view

</td>
</tr>
<tr>
<td>

**🔐 Auth & Security**
- Cookie-based JWT authentication
- Middleware route protection (Next.js edge)
- Silent token refresh via Axios interceptor
- Redirect to original page after login
- Change password flow

</td>
<td>

**🎨 UI & UX**
- Light / Dark theme toggle with context
- Collapsible sidebar with hover expand
- Toast notifications (Sonner)
- SweetAlert2 for delete confirmations
- Fully responsive mobile layout

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Routing, SSR, middleware |
| **Language** | TypeScript 5 | Full type safety |
| **UI Library** | React 19 | Component rendering |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Data Fetching** | TanStack Query v5 | Server state, caching, pagination |
| **Tables** | TanStack Table v8 | Headless table logic |
| **Forms** | React Hook Form + Zod | Form state + schema validation |
| **HTTP Client** | Axios | API calls + interceptors |
| **Charts** | ApexCharts | Dashboard data visualizations |
| **Calendar** | FullCalendar | Event calendar UI |
| **UI Components** | MUI v7 | Material components |
| **Icons** | Lucide React, Heroicons, FontAwesome | Icon sets |
| **Toasts** | Sonner | Non-blocking notifications |
| **Alerts** | SweetAlert2 | Confirmation dialogs |
| **File Upload** | React Dropzone | Drag & drop file input |
| **Date Handling** | date-fns, Flatpickr | Date formatting & pickers |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (Dashboard)/                    # Route group - protected pages
│   │   ├── layout.tsx                  # Dashboard shell (sidebar + header)
│   │   ├── page.tsx                    # Home - dashboard metrics
│   │   ├── dealer/
│   │   │   ├── page.tsx                # Dealer listing table
│   │   │   └── form/[[...id]]/page.tsx # Create / edit dealer (optional ID)
│   │   ├── internal-user/
│   │   │   ├── page.tsx
│   │   │   └── form/[[...id]]/page.tsx
│   │   ├── product/
│   │   │   ├── page.tsx
│   │   │   └── form/[[...id]]/page.tsx
│   │   ├── enquiry/
│   │   │   ├── page.tsx
│   │   │   └── form/[[...id]]/page.tsx
│   │   └── change-password/page.tsx
│   ├── login/
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Public login page
│   ├── layout.tsx                      # Root layout (theme provider, query client)
│   ├── globals.css
│   └── not-found.tsx                   # 404 page
│
├── layout/
│   ├── AppSidebar.tsx                  # Collapsible sidebar with nav items
│   ├── AppHeader.tsx                   # Top bar with notifications & user menu
│   └── Backdrop.tsx                    # Mobile sidebar backdrop
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx               # Login form with RHF + Zod
│   │   └── SignUpForm.tsx
│   ├── dashboard/
│   │   ├── DashboardMetrics.tsx        # Live metric cards
│   │   ├── MonthlySalesChart.tsx       # ApexCharts bar chart
│   │   ├── StatisticsChart.tsx         # ApexCharts line chart
│   │   ├── CountryMap.tsx              # jVectorMap world map
│   │   ├── DemographicCard.tsx
│   │   ├── MonthlyTarget.tsx
│   │   └── RecentOrders.tsx
│   ├── tables/
│   │   ├── DataTable.tsx               # Reusable TanStack Table wrapper
│   │   ├── AdvanceTable.tsx
│   │   ├── BasicTableOne.tsx
│   │   └── Pagination.tsx
│   ├── form/
│   │   ├── input/                      # InputField, TextArea, Checkbox, Radio, etc.
│   │   ├── form-elements/              # DropZone, FileInput, ToggleSwitch, etc.
│   │   └── switch/, date-picker.tsx
│   ├── ui/
│   │   ├── alert/, badge/, button/     # Primitive UI components
│   │   ├── dropdown/, modal/
│   │   ├── loader/Loader.tsx
│   │   └── images/, video/
│   ├── user/Form.tsx                   # Reusable user create/edit form
│   └── common/                         # PageBreadCrumb, ThemeToggle, etc.
│
├── hooks/                              # TanStack Query custom hooks
│   ├── useProducts.ts
│   ├── useDeleteProduct.ts
│   ├── useBulkDeleteProduct.ts
│   ├── useEnquiry.ts
│   ├── useDeleteEnquiry.ts
│   ├── useBulkDeleteEnquiry.ts
│   ├── useUser.ts
│   ├── useDeleteUser.ts
│   ├── useBulkDeleteUser.ts
│   ├── useDashboardStats.ts
│   ├── useAdminUser.ts
│   ├── useModal.ts
│   └── useGoBack.ts
│
├── services/                           # Axios API call functions (typed)
│   ├── productServices.ts
│   ├── userServices.ts
│   ├── enquiryServices.ts
│   ├── dashboardServices.ts
│   ├── makeCategoryServices.ts
│   ├── fileUploadServices.ts
│   ├── cityServices.ts
│   └── propertyServices.ts
│
├── types/                              # TypeScript interfaces
│   ├── productTypes.ts
│   ├── userTypes.ts
│   ├── enquiryTypes.ts
│   ├── dashboardTypes.ts
│   ├── formTypes.ts
│   ├── makeCategoryTypes.ts
│   ├── paginationType.ts
│   └── fileTypes.ts
│
├── validations/                        # Zod schemas
│   ├── productSchema.ts
│   ├── userSchema.ts
│   └── citySchema.ts
│
├── context/
│   ├── SidebarContext.tsx              # Sidebar expand/collapse state
│   └── ThemeContext.tsx                # Light/dark theme state
│
├── utils/
│   ├── axiosInstance.ts               # Axios + token refresh interceptor
│   ├── ReactQueryProvider.tsx         # TanStack Query client provider
│   └── utils.ts
│
└── middleware.ts                       # Next.js edge middleware - route auth guard
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- The [Product Catalog REST API](https://github.com/6ixline/nodejs-express-rest-api) running locally or deployed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/product-catalog-admin.git
cd product-catalog-admin

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your API URL (see section below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

Create a `.env.local` file at the root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> The app proxies all `/api/*` requests to the backend via Next.js rewrites, keeping credentials secure and avoiding CORS issues.

---

## 📄 Pages & Routes

| Route | Description | Auth |
|-------|-------------|:----:|
| `/login` | Admin login page | 🌐 Public |
| `/` | Dashboard - live metrics overview | 🔒 |
| `/dealer` | Dealer listing - paginated table with search | 🔒 |
| `/dealer/form` | Create new dealer | 🔒 |
| `/dealer/form/[id]` | Edit existing dealer | 🔒 |
| `/internal-user` | Internal user listing | 🔒 |
| `/internal-user/form` | Create internal user | 🔒 |
| `/internal-user/form/[id]` | Edit internal user | 🔒 |
| `/product` | Product listing - filters, search, bulk actions | 🔒 |
| `/product/form` | Create product | 🔒 |
| `/product/form/[id]` | Edit product | 🔒 |
| `/enquiry` | Enquiry listing with status filters | 🔒 |
| `/enquiry/form/[id]` | View & update enquiry | 🔒 |
| `/change-password` | Admin change password | 🔒 |

> 🔒 = Protected by Next.js middleware - unauthenticated users are redirected to `/login`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser                               │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Next.js App Router                     │    │
│  │                                                  │    │
│  │  middleware.ts ──► checks admin_token cookie     │    │
│  │       │                                          │    │
│  │       ▼                                          │    │
│  │  Route Group (Dashboard)/layout.tsx              │    │
│  │  ├── AppSidebar (SidebarContext)                 │    │
│  │  ├── AppHeader  (UserDropdown, Notifications)    │    │
│  │  └── Page Component                              │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  Custom Hook (TanStack Query)                    │    │
│  │  e.g. useProducts()                              │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  Service Function (Axios)                        │    │
│  │  e.g. getAllProducts()                           │    │
│  │         │                                        │    │
│  └─────────┼────────────────────────────────────────┘    │
│            │                                              │
└────────────┼──────────────────────────────────────────────┘
             │  HTTP (proxied via Next.js /api/*)
             ▼
┌─────────────────────────────────────────────────────────┐
│         Node.js + Express REST API                       │
│         github.com/6ixline/nodejs-express-rest-api       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
User visits protected route
         │
         ▼
middleware.ts checks admin_token cookie
         │
    ┌────┴────┐
    │         │
  Missing   Present
    │         │
    ▼         ▼
Redirect   Allow request
to /login  to proceed
with ?redirect=original_path
    │
    ▼
User logs in → API sets admin_token cookie (HttpOnly)
    │
    ▼
Redirect back to original path
```

**Silent Token Refresh** - handled automatically in `axiosInstance.ts`:

```
API call returns 401
        │
        ▼
Axios interceptor catches error
        │
        ▼
POST /api/admin/auth/refresh-token
        │
   ┌────┴────┐
   │         │
Success    Failure
   │         │
   ▼         ▼
Retry    Redirect to /login
original  (preserving current path)
request
```

---

## 🧩 Component System

Built on a layered component architecture:

| Layer | Location | Examples |
|-------|----------|---------|
| **Primitives** | `components/ui/` | Button, Badge, Alert, Avatar, Modal, Loader |
| **Form Inputs** | `components/form/input/` | InputField, TextArea, Checkbox, SearchableSelect, FileInput |
| **Data Display** | `components/tables/` | DataTable (TanStack), Pagination |
| **Dashboard Widgets** | `components/dashboard/` | DashboardMetrics, MonthlySalesChart, CountryMap |
| **Layout** | `layout/` | AppSidebar, AppHeader, Backdrop |

---

## 🔌 API Integration

All API communication follows a consistent 3-layer pattern:

```
Page / Component
      │
      ▼
Custom Hook (TanStack Query)   ← caching, loading & error states
      │
      ▼
Service Function (Axios)       ← typed HTTP calls
      │
      ▼
axiosInstance                  ← base URL, credentials, token refresh
```

---

## 🔗 Related Project

This admin panel is the frontend for the **Product Catalog REST API**:

> 🔧 **[nodejs-express-rest-api](https://github.com/6ixline/nodejs-express-rest-api)** - Node.js + Express 5 + MySQL backend with multi-role JWT auth, bulk Excel import, and 40+ REST endpoints.

Together they form a complete, production-ready full-stack system.

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 License

Distributed under the **ISC License**.

---

<div align="center">

Built with ❤️ using Next.js & TypeScript

**[⬆ Back to top](#️-product-catalog--admin-panel)**

</div>