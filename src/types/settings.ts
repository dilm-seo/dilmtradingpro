export interface Settings {
  apiKey: string;
  model: string;
  newsAnalysisPrompt: string;
  sentimentPrompt: string;
  opportunityPrompt: string;
  visualizationPrompt: string;
  tradingSessionPrompt: string;
  currencyImpactPrompt: string;
}

export interface PromptGeneration {
  role: string;
  content: string;
}

export interface OpenAIResponse {
  sentiment: string;
  opportunities: string[];
  analysis: string;
  tradingSessions: TradingSession[];
  impactedCurrencies: CurrencyImpact[];
}

export interface TradingSession {
  session: 'Asian' | 'European' | 'American';
  impact: number;
  analysis: string;
}

export interface CurrencyImpact {
  currency: string;
  impact: number;
  reason: string;
}