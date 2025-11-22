export interface Invoice {
  userId: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid';
  dueDate?: string;
  createdAt: string;
  pdfKey?: string;
}

export interface Customer {
  userId: string;
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
}
