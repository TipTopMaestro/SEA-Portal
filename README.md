# NexusSEA — DNSC Student Esports Academy Management Portal

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

**NexusSEA** is a responsive single-page web application (SPA) architected and built for the **DNSC Student Esports Academy**. It replaces manual spreadsheets and scattered group chats with a centralized, cyber-athletic management platform designed for student sign-ups, dues tracking, competitive tryouts, QR attendance, and multi-stage fiscal governance.

---

## 🎮 Key Features & Core Modules

### 1. 🛡️ HR Management & Role-Based Access Control (RBAC)
- **Clearance Assignment**: Executive officers can elevate or demote members and assign official academy titles (e.g., Head Game Manager, Director of Finance).
- **View Restrictions**: Strict RBAC protection. Non-executive accounts receive clear read-only notices and cannot mutate permissions.
- **Officer Audit Trail**: Real-time, searchable activity log tracking all officer promotions, disbursements, evaluations, and attendance sessions.
- **RBAC Matrix Reference**: Visual capability reference card outlining clearances for all 4 roles.

### 2. 🪪 Registration & Membership Dues
- **Digital Academy Pass**: High-fidelity cyberpunk student varsity card featuring student details, IGN, degree program, and verified QR code.
- **Membership Dues Status Tracker**: Track whether dues are `Paid`, `Pending Verification`, or `Unpaid` across all students.
- **Student Payment Submission**: Direct GCash and treasury settlement verification workflow.
- **Officer Verification**: Finance officers and executives can confirm GCash reference numbers and update statuses in real-time.

### 3. ⚔️ Tryout Evaluation & Dynamic Queueing
- **Free Agent & Team Applications**: Sign-up form supporting individual candidates and 5-man premade rosters across **Valorant, Mobile Legends: Bang Bang, League of Legends, Call of Duty: Mobile, and Tekken 8**.
- **Scouting Queue**: Filterable by game title, competitive division (Varsity vs Academy), and status stages (`Pending`, `Under Review`, `Shortlisted`, `Scheduled`, `Accepted`, `Rejected`).
- **Game Manager Evaluation Panel**: 4-metric scoring rubric (Mechanics, Comms, Game Sense, Coachability) with automatic average score calculation and evaluator commentary.

### 4. 📱 QR-Code Attendance (Mobile-First)
- **Mobile-Optimized Scanner**: Viewfinder with animated optical radar sweep, auto-detection simulation, and manual token fallback.
- **Dynamic Time-Bound QR Generator**: Officers can launch live sessions for scrimmages, campus booths, assemblies, or tournaments with custom TTL countdowns and token rotation.
- **Real-Time Verification**: Instant verification badges, scan timestamps, and duplicate check-in prevention.

### 5. 💰 Finance Tracking & Multi-Stage Approvals
- **Cash Inflows Ledger**: Log dues, academy jersey pre-orders, tournament prize shares, and corporate sponsorships.
- **Disbursement Requests**: Submit expense vouchers with budget justification and receipt/quotation attachments.
- **Multi-Level Approval Workflow**:
  1. `Voucher Submitted` (Requester)
  2. `Finance Verified` (Finance Officer audit)
  3. `Executive Signed` (Executive President authorization)
  4. `Funds Released` (Treasury payout)
  - Full rejection flow with required audit justification.

### 6. 📊 Role-Specific Dashboards & Analytics
- **Executive View**: Macro KPIs, net treasury balance, pending executive sign-offs, and activity feeds.
- **Game Manager View**: Recruitment funnel per game title, active rosters, and pending applicant evaluations.
- **Finance Officer View**: Cash flow summaries, dues collection progress meter, and pending verification queues.
- **General Member View**: Personal digital ID card, dues status alert, tryout application tracking, and scrimmage check-ins.
- **Export Reports**: One-click CSV export available across rosters, queue, attendance logs, and financial vouchers.

---

## 👥 Core User Roles & Demo Accounts

Use the **Fast Role Switcher** in the top navigation bar or log in with the following demo credentials:

| Role | Name | IGN | Student ID / Email | Clearances |
| :--- | :--- | :--- | :--- | :--- |
| **Executive Officer** | Marcus Reyes | `Vanguard` | `2022-00412` / `marcus.reyes@dnsc.edu.ph` | Full HR, executive sign-offs, global audits |
| **Game Manager** | Samantha Cruz | `Aegis` | `2023-01189` / `samantha.cruz@dnsc.edu.ph` | Tryout scoring, scrimmage QR hosting |
| **Finance Officer** | Gabriel Tan | `Ledger` | `2023-00821` / `gabriel.tan@dnsc.edu.ph` | Cash inflows, disbursement review, dues audits |
| **Academy Member** | Kristoff Ramos | `Phoenix` | `2024-02341` / `kristoff.ramos@dnsc.edu.ph` | Digital ID, tryout application, mobile QR scan |

*Demo Password*: Any password with 4+ characters (e.g. `password`).

---

## 🏗️ Folder Structure

```
src/
├── assets/             # Branding icons & media assets
├── components/         # Reusable UI components
│   ├── attendance/     # QRGeneratorModal, QRScannerView
│   ├── common/         # RoleBadge, StatusBadge, StatCard, Modal, ExportButton, EmptyState
│   ├── finance/        # CashInflowModal, DisbursementModal, ApprovalTimeline
│   ├── hr/             # RoleAssignModal, OfficerActivityLog
│   ├── membership/     # DigitalMemberCard, DuesUpdateModal
│   └── tryouts/        # TryoutApplicationModal, EvaluationModal
├── context/
│   ├── AuthContext.jsx         # Global RBAC clearance & user state
│   └── NotificationContext.jsx # Toast notification system
├── layouts/
│   ├── AppLayout.jsx           # Sidebar + Top Header + Main canvas
│   ├── Navbar.jsx              # Brand header + Fast Role Switcher
│   ├── ProtectedRoute.jsx      # Route guard with clearance validation
│   └── Sidebar.jsx             # Role-aware responsive navigation drawer
├── pages/
│   ├── auth/           # LoginPage, RegisterPage
│   ├── attendance/     # AttendancePage
│   ├── dashboard/      # DashboardPage (Role-specific views)
│   ├── finance/        # FinancePage
│   ├── hr/             # HRManagementPage
│   ├── membership/     # MembershipPage
│   ├── tryouts/        # TryoutsPage
│   ├── UnauthorizedPage.jsx # HTTP 403 Restricted clearance view
│   └── NotFoundPage.jsx     # HTTP 404 Out of bounds view
├── services/
│   ├── api.js          # Axios client with JWT/Bearer interceptors for Django REST
│   ├── mockData.js     # DNSC Esports Academy initial dataset
│   └── portalService.js# Persistent data access & business logic
├── App.jsx             # React Router routing configuration
├── index.css           # Tailwind CSS v4 styling & dark esports aesthetics
└── main.jsx            # Application root entry
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Code Linter
```bash
npm run lint
```

---

## 🔌 Python Django REST API Backend Integration

NexusSEA is pre-configured to communicate with a Python Django REST API backend via `src/services/api.js`:
- Set the base URL in `.env`: `VITE_API_BASE_URL=http://localhost:8000/api`
- Automatic Bearer Token injection on every HTTP request.
- Automatic graceful fallback to persistent client-side storage so the application runs immediately without requiring an active backend instance during testing or demonstration.
