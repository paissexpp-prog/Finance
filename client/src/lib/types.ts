export interface User {
  id: string;
  username: string;
  role: 'owner' | 'user';
  createdAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalExpense: number;
  totalIncome: number;
}

export interface YearlyStats {
  year: number;
  totalExpense: number;
}
