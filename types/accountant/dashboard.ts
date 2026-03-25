// Additional types for dashboard components
export interface Transaction {
  id: string;
  paymentId: string;
  studentName: string;
  class: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  status: 'pending' | 'matched' | 'reconciled' | 'disputed';
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: string;
  color: string;
}

export interface NextAction {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  link: string;
}
