import React from 'react';
import { TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';

interface OpportunityCloudProps {
  opportunities: string[];
}

export function OpportunityCloud({ opportunities = [] }: OpportunityCloudProps) {
  if (!Array.isArray(opportunities)) {
    console.error('Invalid opportunities data:', opportunities);
    return null;
  }

  const getOpportunityType = (text: string): 'bullish' | 'bearish' | 'neutral' => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('long') || lowerText.includes('hausse')) return 'bullish';
    if (lowerText.includes('short') || lowerText.includes('baisse')) return 'bearish';
    return 'neutral';
  };

  const getOpportunityIcon = (type: 'bullish' | 'bearish' | 'neutral') => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <MinusCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {opportunities.map((opportunity, index) => {
        const type = getOpportunityType(opportunity);
        return (
          <div
            key={index}
            className={`
              p-4 rounded-lg flex items-start gap-3
              ${type === 'bullish' ? 'bg-green-50' : ''}
              ${type === 'bearish' ? 'bg-red-50' : ''}
              ${type === 'neutral' ? 'bg-yellow-50' : ''}
            `}
          >
            {getOpportunityIcon(type)}
            <p className="text-sm">{opportunity}</p>
          </div>
        );
      })}
    </div>
  );
}