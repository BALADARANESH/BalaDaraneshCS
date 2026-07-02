export type RiskLevel = 'Safe' | 'Caution' | 'High' | 'Critical';
export type TransactionStatus = 'Approved' | 'Blocked' | 'Investigating' | 'Flagged';

export interface Transaction {
  id: string;
  timestamp: string;
  merchant: string;
  amount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  category: string;
  device: string;
  location: string;
  flaggedReason: string;
  status: TransactionStatus;
}

export interface FraudAnalysis {
  riskSummary: string;
  anomalies: string[];
  threatVector: string;
  nextSteps: string[];
  confidence: number;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  iconName: string;
}

export type ThemeName = 'sentinel-light' | 'sentinel-dark' | 'electric-precision' | 'sleek-interface';

export interface SecurityInsight {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
}
