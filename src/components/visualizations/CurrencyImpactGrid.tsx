import React from 'react';
import { CurrencyImpact } from '../../types/settings';

interface CurrencyImpactGridProps {
  currencies: CurrencyImpact[];
}

export function CurrencyImpactGrid({ currencies }: CurrencyImpactGridProps) {
  const getImpactColor = (impact: number) => {
    if (impact >= 0.3) return 'bg-green-100 border-green-200';
    if (impact <= -0.3) return 'bg-red-100 border-red-200';
    return 'bg-yellow-100 border-yellow-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currencies.map((currency) => (
        <div
          key={currency.currency}
          className={`p-4 rounded-lg border-2 ${getImpactColor(currency.impact)}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{currency.currency}</h3>
            <span className="text-sm font-medium">
              Impact: {(currency.impact * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-gray-700">{currency.reason}</p>
        </div>
      ))}
    </div>
  );
}