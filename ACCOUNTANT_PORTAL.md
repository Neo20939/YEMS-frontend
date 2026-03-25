# Educational Accountant Portal

A comprehensive financial management system designed for educational institutions. Built specifically for Yeshua High School with 450+ students and growing.

![Dashboard](https://img.shields.io/badge/Status-Complete-success)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)

## 🎯 Overview

The Accountant Portal is a standalone financial management module within the Yeshua High School education platform. It provides a solo accountant with all the tools needed to manage fee collection, payment reconciliation, outstanding fees tracking, and financial reporting.

## 📁 Module Structure

```
app/accountant/
├── layout.tsx              # Main layout with sidebar
├── dashboard/
│   └── page.tsx            # Home dashboard with KPIs
├── fee-management/
│   └── page.tsx            # Invoices, batch creation, ledgers
├── reconciliation/
│   └── page.tsx            # Bank transaction matching
├── outstanding/
│   └── page.tsx            # Aging reports and reminders
├── reports/
│   └── page.tsx            # Financial reports generation
└── settings/
    └── page.tsx            # System configuration

components/accountant/
├── AccountantSidebar.tsx   # Navigation sidebar
├── DashboardHeader.tsx     # Dashboard header
├── KPICards.tsx            # KPI statistics cards
├── FeeManagementSection.tsx # Class-wise fee collection
├── TransactionHistory.tsx  # Recent transactions table
├── QuickActions.tsx        # Quick action buttons
└── NextActionsWidget.tsx   # Priority tasks widget

types/accountant/
├── index.ts                # Core TypeScript types
└── dashboard.ts            # Dashboard-specific types

lib/api/
└── accountant.ts           # API client for backend calls
```

## 🚀 Features

### 1. Dashboard (Home Base)

**KPI Cards:**
- Total Collected (₦45.75M)
- Outstanding Fees (₦28.5M)
- Collection Rate (61.6%)
- Cash Balance (₦12.35M)

**Fee Management Section:**
- Real-time collection percentage by class
- Visual progress bars for each class
- Student count and payment status

**Transaction History:**
- Last 10-15 transactions
- Status indicators (pending, matched, reconciled)
- Payment method icons
- Time-based grouping

**Quick Actions:**
- Generate Reports
- View Overdue Students
- Reconciliation
- Audit Logs

**Next Actions Widget:**
- Priority-based task list
- Color-coded by urgency
- Direct links to relevant sections

### 2. Student Fee Management

**Batch Invoice Creation:**
- CSV upload for bulk invoice creation
- Manual entry option
- Auto-generate unique invoice IDs
- Set payment deadlines
- Support for multiple fee types:
  - Tuition fees
  - Accommodation/hostel fees
  - Transport fees
  - Lab fees
  - Activity fees

**Individual Student Ledger:**
- Complete payment history
- Current balance and outstanding amounts
- Payment dates and methods
- Notes for special arrangements
- Print receipts/statements

**Payment Recording:**
- Manual entry (cash, checks, transfers)
- Bank statement import with auto-matching
- Mobile payment integration ready
- Installment tracking

### 3. Payment Reconciliation

**Workflow:**
1. **Unmatched** → Bank deposits that can't be identified
2. **Pending** → Awaiting review
3. **Matched** → Linked to student payments
4. **Confirmed** → Verified by accountant
5. **Reconciled** → Complete

**Features:**
- Real-time bank sync (API integration ready)
- Auto-matching suggestions
- Discrepancy flagging
- Audit trail for all actions
- Support for:
  - Bank transfers
  - Card payments
  - Mobile money
  - Cash deposits
  - Cheques

### 4. Outstanding Fees Tracking

**Aging Report Categories:**
- Current (not yet due)
- 0-30 days overdue
- 30-60 days overdue
- 60-90 days overdue
- 90+ days overdue

**Automated Reminders:**
- SMS/Email at 7 days before due
- On due date reminder
- 14 days overdue alert
- 30 days overdue final notice
- Customizable message templates

**Payment Plans:**
- Set up installment arrangements
- Track payment milestones
- Flag broken plans
- Approval workflow

### 5. Financial Reporting

**Monthly Reports:**
- Revenue Report (billed vs. collected by class)
- Collection Analysis (percentages)
- Cash Flow Statement
- Account Reconciliation
- All exportable as PDF/CSV/Excel

**Compliance Reports:**
- Audit Trail (all transactions with timestamps)
- Voided/Adjusted Invoices (with reasons)
- Exception Reports (unusual transactions)
- User Activity Logs

**Variance Analysis:**
- Budgeted vs. Actual
- Target vs. Achievement
- Term-over-term trends

### 6. Settings & Configuration

**School Information:**
- School details
- Academic year setup
- Current term configuration

**Fee Structure:**
- Define fee types per class
- Annual updates
- Optional vs. mandatory fees

**Payment Methods:**
- Enable/disable payment channels
- Configure transaction fees
- Integration settings

**Notifications:**
- Email notification preferences
- SMS notification settings
- Reminder scheduling
- Custom message templates

**User Roles & Permissions:**
- **Accountant**: Full access (create, approve, reconcile, report)
- **Finance Officer**: View reports, record payments (no delete/void/approval)
- **Principal**: Read-only KPIs and reports
- **Registrar**: View overdue students (no amounts)

**Security:**
- Password policy (12+ characters, complexity)
- Two-factor authentication
- Login history
- IP whitelisting (optional)

**Backup:**
- Automatic daily backups
- Manual backup creation
- Restore from backup
- Data export (CSV, PDF, Excel)

## 🔌 API Integration

The portal includes a comprehensive API client (`lib/api/accountant.ts`) with:

### Endpoints

```typescript
// Dashboard
GET /api/accountant/dashboard/kpis
GET /api/accountant/dashboard/classes
GET /api/accountant/dashboard/transactions
GET /api/accountant/dashboard/actions

// Invoices
GET  /api/accountant/invoices
POST /api/accountant/invoices
POST /api/accountant/invoices/batch
PUT  /api/accountant/invoices/:id
POST /api/accountant/invoices/:id/void

// Students
GET  /api/accountant/students
GET  /api/accountant/students/:id/ledger

// Payments
GET  /api/accountant/payments
POST /api/accountant/payments
POST /api/accountant/payments/record
POST /api/accountant/payments/match

// Reconciliation
GET  /api/accountant/reconciliation/bank
GET  /api/accountant/reconciliation/unmatched
POST /api/accountant/reconciliation/match
POST /api/accountant/reconciliation/:id/confirm
POST /api/accountant/reconciliation/:id/reject
POST /api/accountant/reconciliation/sync

// Outstanding
GET  /api/accountant/outstanding/aging
GET  /api/accountant/outstanding/:category
POST /api/accountant/outstanding/remind
GET  /api/accountant/outstanding/plans
POST /api/accountant/outstanding/plans

// Reports
POST /api/accountant/reports/generate
GET  /api/accountant/reports
GET  /api/accountant/reports/:id/download

// Settings
GET  /api/accountant/settings
PUT  /api/accountant/settings
GET  /api/accountant/settings/fees
PUT  /api/accountant/settings/fees

// Users
GET  /api/accountant/users
POST /api/accountant/users
PUT  /api/accountant/users/:id
GET  /api/accountant/users/roles

// Audit
GET  /api/accountant/audit
GET  /api/accountant/audit/export

// Backup
POST /api/accountant/backup
GET  /api/accountant/backup
POST /api/accountant/backup/:id/restore
```

### Features

- **Retry Logic**: Exponential backoff for failed requests
- **Authentication**: Bearer token + API key support
- **Token Refresh**: Automatic token refresh on 401
- **Error Handling**: Centralized error management
- **Type Safety**: Full TypeScript interfaces

## 🎨 Design System

### Color Palette
- **Primary**: Wine Crimson (`#7B1E3A`)
- **Secondary**: Light Petal Pink (`#F4D4D8`)
- **Background**: Off-White (`#F9F7F2`)
- **Accent**: Soft Sage Green (`#A8B5A0`)

### Status Colors
- **Success**: Emerald (`#10B981`)
- **Warning**: Amber (`#F59E0B`)
- **Danger**: Red (`#EF4444`)
- **Info**: Blue (`#3B82F6`)

### Components
- Rounded corners (12px - 32px)
- Soft shadows
- Hover effects
- Smooth transitions

## 📊 Data Models

### Key Types

```typescript
interface Invoice {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  class: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue' | 'void';
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

interface Payment {
  id: string;
  paymentId: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'cheque';
  reference?: string;
  transactionDate: string;
  status: 'pending' | 'matched' | 'reconciled' | 'disputed';
}

interface BankTransaction {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  matchedPaymentId?: string;
  status: 'unmatched' | 'matched' | 'reconciled';
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Access to the education platform

### Installation

1. Navigate to the project directory:
```bash
cd education
```

2. Install dependencies (if not already done):
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

4. Access the Accountant Portal:
```
http://localhost:3000/accountant
```

## 📱 Responsive Design

The portal is fully responsive:
- **Desktop**: Full sidebar, all features visible
- **Tablet**: Collapsible sidebar, optimized layouts
- **Mobile**: Hamburger menu, touch-friendly interfaces

## 🔐 Security Considerations

1. **Authentication**: Required for all routes
2. **Authorization**: Role-based access control
3. **Audit Trail**: Every action logged with timestamp, user, IP
4. **Data Protection**: No sensitive data in localStorage
5. **Session Management**: Token-based with refresh
6. **Input Validation**: Server-side validation required

## 📈 Scalability

Designed to handle growth:
- Current: 450 students, ~1,350 payment records
- Target: 1000+ students without redesign
- Database indexing on student IDs, invoice IDs
- Pagination for large datasets
- Efficient caching strategies

## 🔄 Workflow Examples

### Recording a Payment

1. Navigate to Fee Management
2. Click "New Invoice" or search for student
3. Select student from ledger
4. Click "Record Payment"
5. Enter amount, method, reference
6. System auto-matches if bank sync enabled
7. Receipt generated automatically

### Reconciling Bank Deposits

1. Navigate to Reconciliation
2. View unmatched bank transactions
3. Click "Match" on a transaction
4. Search/select corresponding payment
5. Confirm match
6. Supervisor confirms (if workflow enabled)
7. Transaction marked as reconciled

### Sending Overdue Reminders

1. Navigate to Outstanding Fees
2. Select aging category (e.g., 30-60 days)
3. Select students (or select all)
4. Click "Send Reminders"
5. Choose SMS or Email
6. System logs all sent reminders
7. Follow-up scheduled automatically

## 📝 Future Enhancements

- [ ] Multi-currency support
- [ ] Predictive collection analytics
- [ ] Mobile app (React Native)
- [ ] Parent portal for payment history
- [ ] Automated late fee calculation
- [ ] Integration with accounting software (QuickBooks, Sage)
- [ ] Advanced reporting with charts
- [ ] Bulk SMS gateway integration
- [ ] Payment plan automation
- [ ] Student withdrawal workflow

## 🤝 Contributing

This is a proprietary system. All changes must be approved by the school administration.

## 📄 License

Proprietary - Yeshua High School. All rights reserved.

## 📞 Support

For technical support, contact the IT department or raise an issue in the project repository.

---

**Built with ❤️ for Yeshua High School**

*Empowering education through technology*
