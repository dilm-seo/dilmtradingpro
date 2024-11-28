import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CurrencySentiment {
  [key: string]: number;
}

interface SentimentGaugeProps {
  globalValue: number;
  currencyValues: CurrencySentiment;
}

export function SentimentGauge({ globalValue, currencyValues }: SentimentGaugeProps) {
  const normalizedValue = Math.max(-1, Math.min(1, globalValue));
  const percentage = ((normalizedValue + 1) / 2) * 100;
  
  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];

  const getColor = (value: number) => {
    if (value >= 0.3) return '#22c55e';
    if (value <= -0.3) return '#ef4444';
    return '#eab308';
  };

  return (
    <div className="space-y-4">
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={getColor(normalizedValue)} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-2 text-center">
          <div className="text-3xl font-bold">{(normalizedValue * 100).toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Sentiment Global</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(currencyValues).map(([currency, value]) => (
          <div
            key={currency}
            className={`p-2 rounded-lg ${getColor(value) === '#22c55e' ? 'bg-green-50' : getColor(value) === '#ef4444' ? 'bg-red-50' : 'bg-yellow-50'}`}
          >
            <div className="text-sm font-medium">{currency}</div>
            <div className="text-lg font-bold">{(value * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}