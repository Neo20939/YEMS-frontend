// Accountant Portal Types

export interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  email?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  status: 'active' | 'inactive' | 'graduated';
}

export interface FeeType {
  id: string;
  name: string;
  amount: number;
  class: string;
  term: string;
  academicYear: string;
  isOptional?: boolean;
}

export interface Invoice {
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
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  feeType: string;
  description: string;
  amount: number;
}

export interface Payment {
  id: string;
  paymentId: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'cheque';
  reference?: string;
  bankName?: string;
  transactionDate: string;
  recordedDate: string;
  recordedBy: string;
  status: 'pending' | 'matched' | 'reconciled' | 'disputed';
  notes?: string;
}

export interface BankTransaction {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance: number;
  matchedPaymentId?: string;
  status: 'unmatched' | 'matched' | 'reconciled';
  reconciledBy?: string;
  reconciledAt?: string;
}

export interface DashboardKPI {
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  cashBalance: number;
  overdueCount: number;
  pendingReconciliation: number;
}

export interface ClassFeeSummary {
  class: string;
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionPercentage: number;
  studentCount: number;
  paidCount: number;
}

export interface AgingReport {
  current: AgingEntry[];
  days30: AgingEntry[];
  days60: AgingEntry[];
  days90: AgingEntry[];
  days90Plus: AgingEntry[];
}

export interface AgingEntry {
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

export interface FinancialReport {
  id: string;
  reportType: 'monthly' | 'termly' | 'annual';
  period: string;
  generatedAt: string;
  generatedBy: string;
  data: ReportData;
}

export interface ReportData {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  byClass: ClassFeeSummary[];
  byFeeType: FeeTypeSummary[];
  cashFlow: CashFlowData;
  variances: VarianceData;
}

export interface FeeTypeSummary {
  feeType: string;
  billed: number;
  collected: number;
  outstanding: number;
}

export interface CashFlowData {
  openingBalance: number;
  totalInflow: number;
  totalOutflow: number;
  closingBalance: number;
}

export interface VarianceData {
  budgeted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
}

export interface Reminder {
  id: string;
  studentId: string;
  studentName: string;
  guardianPhone: string;
  type: 'sms' | 'email';
  template: string;
  scheduledDate: string;
  sentDate?: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface PaymentPlan {
  id: string;
  studentId: string;
  studentName: string;
  totalAmount: number;
  remainingAmount: number;
  installments: Installment[];
  status: 'active' | 'completed' | 'broken';
  createdAt: string;
  approvedBy: string;
}

export interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'missed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'accountant' | 'finance_officer' | 'principal' | 'registrar';
  permissions: string[];
  lastLogin?: string;
}

export interface ReconciliationWorkflow {
  id: string;
  bankTransactionId: string;
  paymentId?: string;
  status: 'pending' | 'matched' | 'confirmed' | 'completed' | 'rejected';
  matchedBy?: string;
  matchedAt?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  rejectionReason?: string;
}
