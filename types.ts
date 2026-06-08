export interface Customer {
  id: string;
  gender: "Male" | "Female";
  age: number;
  subscriptionType: "Basic" | "Pro" | "Premium";
  tenure: number; // months
  monthlyCharges: number;
  supportTickets: number;
  satisfactionScore: number; // 1 to 5
  lastLoginDays: number;
  churn: "Yes" | "No";
  riskScore?: number; // 0 to 100 predicted risk
}

export interface ChurnStats {
  totalCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  churnRate: number; // percentage
  avgSatisfaction: number;
  revenueLost: number;
}

export interface PredictiveMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  featureImportance: { feature: string; importance: number }[];
}

export interface ProjectFile {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: ProjectFile[];
  content?: string;
  icon?: string;
  language?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
