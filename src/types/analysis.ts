import { TradingSession, CurrencyImpact } from './settings';

export interface Analysis {
  id: string;
  timestamp: string;
  newsId: string;
  sentiment: {
    global: number;
    currencies: Record<string, number>;
  };
  opportunities: Array<{
    pair: string;
    direction: 'long' | 'short';
    timeframe: string;
    reason: string;
  }>;
  analysis: {
    mainPoints: string[];
    marketContext: string;
    technicalLevels: {
      support: number[];
      resistance: number[];
    };
  };
  tradingSessions: TradingSession[];
  impactedCurrencies: CurrencyImpact[];
  volumeActivity: Array<{
    hour: number;
    volume: number;
    mainPairs: string[];
    sentiment: number;
  }>;
}

export interface AnalysisState {
  analyses: Analysis[];
  isAnalyzing: boolean;
  error: string | null;
  addAnalysis: (analysis: Analysis) => void;
  setAnalyzing: (status: boolean) => void;
  setError: (error: string | null) => void;
}