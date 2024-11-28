import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface MarketInsightsProps {
  analysis: string;
}

export function MarketInsights({ analysis }: MarketInsightsProps) {
  const getInsightType = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('risque') || lowerText.includes('attention')) return 'warning';
    if (lowerText.includes('hausse') || lowerText.includes('positif')) return 'positive';
    if (lowerText.includes('baisse') || lowerText.includes('négatif')) return 'negative';
    return 'neutral';
  };

  const insights = analysis.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const type = getInsightType(insight);
        return (
          <div
            key={index}
            className={`
              p-4 rounded-lg flex items-start gap-3
              ${type === 'positive' ? 'bg-green-50 border-l-4 border-green-400' : ''}
              ${type === 'negative' ? 'bg-red-50 border-l-4 border-red-400' : ''}
              ${type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}
              ${type === 'neutral' ? 'bg-gray-50 border-l-4 border-gray-400' : ''}
            `}
          >
            {type === 'positive' && <TrendingUp className="w-5 h-5 text-green-500" />}
            {type === 'negative' && <TrendingDown className="w-5 h-5 text-red-500" />}
            {type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
            <p className="text-sm flex-1">{insight}</p>
          </div>
        );
      })}
    </div>
  );
}