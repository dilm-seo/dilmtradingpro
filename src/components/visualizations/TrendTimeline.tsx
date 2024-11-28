import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface CurrencyTrend {
  timestamp: string;
  [key: string]: number | string;
}

interface TrendTimelineProps {
  data: CurrencyTrend[];
  currencies: string[];
}

const CURRENCY_COLORS: { [key: string]: string } = {
  EUR: '#3B82F6',
  USD: '#EF4444',
  GBP: '#22C55E',
  JPY: '#F59E0B',
  CHF: '#8B5CF6',
  AUD: '#EC4899',
  CAD: '#14B8A6',
  NZD: '#6366F1'
};

export function TrendTimeline({ data, currencies }: TrendTimelineProps) {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(currencies.slice(0, 4));

  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'HH:mm')
  }));

  const toggleCurrency = (currency: string) => {
    if (selectedCurrencies.includes(currency)) {
      setSelectedCurrencies(selectedCurrencies.filter(c => c !== currency));
    } else {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {currencies.map(currency => (
          <button
            key={currency}
            onClick={() => toggleCurrency(currency)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedCurrencies.includes(currency)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {currency}
          </button>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[-1, 1]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value * 100}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Sentiment']}
              labelFormatter={(label) => `Heure: ${label}`}
            />
            <Legend />
            {selectedCurrencies.map(currency => (
              <Line
                key={currency}
                type="monotone"
                dataKey={currency}
                name={currency}
                stroke={CURRENCY_COLORS[currency] || '#666666'}
                strokeWidth={2}
                dot={{ fill: CURRENCY_COLORS[currency] || '#666666', r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}