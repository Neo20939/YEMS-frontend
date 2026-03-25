# Accountant Portal - Quick Start Guide

## 🚀 Getting Started

### Access the Portal

1. **Navigate to the application:**
   ```
   http://localhost:3000
   ```

2. **Select "Accountant Portal"** from the home page

3. **Or go directly to:**
   ```
   http://localhost:3000/accountant
   ```

## 📱 Portal Navigation

The Accountant Portal has 6 main sections accessible from the sidebar:

### 1. **Dashboard** (`/accountant`)
Your financial overview at a glance.

**What you'll see:**
- **KPI Cards**: Total collected, outstanding fees, collection rate, cash balance
- **Fee Collection by Class**: Progress bars showing collection percentage for each class
- **Quick Actions**: Shortcuts to common tasks
- **Next Actions**: Priority tasks that need your attention
- **Recent Transactions**: Last 10-15 payment activities

**Quick Tips:**
- Click on any class in the fee section to view details
- Use the search bar to find students or invoices quickly
- Check the "Next Actions" widget daily for urgent tasks

### 2. **Fee Management** (`/accountant/fee-management`)
Manage student invoices and payments.

**Tabs:**
- **Invoices**: View, search, and filter all invoices
- **Batch Creation**: Upload CSV to create multiple invoices at once
- **Student Ledger**: View individual student payment history

**Common Tasks:**

**Create a Single Invoice:**
1. Click "New Invoice" button
2. Select student
3. Add fee items (tuition, transport, etc.)
4. Set due date
5. Save

**Batch Create Invoices:**
1. Go to "Batch Creation" tab
2. Prepare CSV with columns: `student_id,student_name,class,fee_type,amount,due_date`
3. Click "Select File" or drag and drop
4. Review and confirm

**Record a Payment:**
1. Search for student in invoice list
2. Click "View" on their invoice
3. Click "Record Payment"
4. Enter amount, payment method, reference
5. Save

### 3. **Reconciliation** (`/accountant/reconciliation`)
Match bank deposits with student payments.

**Workflow:**
```
Unmatched → Pending → Matched → Confirmed → Reconciled
```

**Common Tasks:**

**Match a Bank Deposit:**
1. Filter by "Unmatched" to see unidentified deposits
2. Click "Match" on a transaction
3. Search for corresponding payment
4. Select and confirm match

**Review Pending Matches:**
1. Filter by "Pending"
2. Click "Review" to see details
3. Confirm or reject the match

**Sync with Bank:**
1. Click "Sync Bank" button (top right)
2. Wait for latest transactions to load
3. Review new unmatched deposits

### 4. **Outstanding Fees** (`/accountant/outstanding`)
Track overdue payments and send reminders.

**Aging Categories:**
- **Current**: Not yet due
- **0-30 Days**: Recently overdue
- **30-60 Days**: Moderately overdue
- **60-90 Days**: Seriously overdue
- **90+ Days**: Critical

**Common Tasks:**

**View Overdue Students:**
1. Click on an aging category tab
2. See list of students in that category
3. Total amount displayed at top

**Send Reminders:**
1. Select students using checkboxes (or select all)
2. Click "Send Reminders" button
3. Choose SMS or Email
4. Message sent automatically

**View Student Details:**
1. Click "View" button on any student row
2. See complete payment history
3. Set up payment plan if needed

### 5. **Reports** (`/accountant/reports`)
Generate and export financial reports.

**Report Categories:**
- **Monthly Reports**: Revenue, collection analysis, cash flow
- **Term Reports**: Termly summaries and comparisons
- **Compliance Reports**: Audit trails, exception reports
- **Variance Analysis**: Budget vs. actual

**Common Tasks:**

**Generate Monthly Report:**
1. Select period from dropdown (top right)
2. Click "Monthly Reports" tab
3. Click "Generate" on desired report
4. Download as PDF/CSV/Excel

**Export Audit Trail:**
1. Go to "Compliance Reports" tab
2. Click "Export" on "Audit Trail"
3. Select date range
4. Download

**View Collection Charts:**
1. Scroll to "Collection by Class" section
2. Visual progress bars for each class
3. Click "View Chart" for detailed analytics

### 6. **Settings** (`/accountant/settings`)
Configure the portal to your needs.

**Sections:**

**School Info:**
- Update school details
- Set academic year
- Configure current term

**Fee Structure:**
- Define fee types per class
- Set amounts for tuition, transport, etc.
- Add optional fees

**Payment Methods:**
- Enable/disable payment channels
- Configure bank details
- Set transaction fees

**Notifications:**
- Email notification preferences
- SMS notification settings
- Reminder schedules

**User Roles:**
- Add/remove users
- Assign permissions
- View login history

**Security:**
- Password policy
- Two-factor authentication
- Login history

**Backup:**
- Automatic backups (daily at 2 AM)
- Manual backup creation
- Restore from backup
- Export all data

## 💡 Pro Tips

### Daily Workflow

**Morning:**
1. Check Dashboard → Next Actions widget
2. Review overnight bank deposits (Reconciliation)
3. Match any pending payments

**Afternoon:**
4. Record new payments (Fee Management)
5. Follow up on overdue accounts (Outstanding)

**End of Month:**
6. Generate monthly reports (Reports)
7. Export audit trail (Reports → Compliance)
8. Create backup (Settings → Backup)

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Quick search |
| `Ctrl + /` | Open help |
| `Esc` | Close modal/dropdown |

### Best Practices

1. **Reconcile Daily**: Match bank deposits every day to avoid backlog
2. **Send Reminders Early**: Start at 7 days before due date
3. **Document Everything**: Add notes for special payment arrangements
4. **Regular Backups**: Create manual backups before major changes
5. **Review Audit Logs**: Check user activity weekly
6. **Export Reports**: Keep monthly PDFs for records

## 🔐 Security Tips

- Never share your login credentials
- Log out when stepping away from your desk
- Enable two-factor authentication
- Review login history regularly
- Report suspicious activity immediately

## 📞 Need Help?

- **Documentation**: See `ACCOUNTANT_PORTAL.md` for detailed guide
- **Technical Support**: Contact IT department
- **Training**: Schedule a session with the system administrator

## 🎯 Key Metrics to Watch

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Collection Rate | > 85% | Send more reminders |
| Reconciliation | < 5 unmatched | Clear backlog daily |
| Overdue (90+ days) | < 5% | Set up payment plans |
| Cash Balance | 3 months operating | Review collection strategy |

---

**Happy Managing! 📊**

*Your financial success is our priority*
