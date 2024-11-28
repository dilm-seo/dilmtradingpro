import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircleDollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface MarketMetric {
  category: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  pairs: string[];
  description: string;
}

interface MarketSummaryProps {
  data: MarketMetric[];
}

export function MarketSummary({ data }: MarketSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item.category}
            className={`p-4 rounded-lg ${
              item.impact === 'positive'
                ? 'bg-green-50'
                : item.impact === 'negative'
                ? 'bg-red-50'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {item.impact === 'positive' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : item.impact === 'negative' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <CircleDollarSign className="w-5 h-5 text-gray-500" />
              )}
              <span className="font-medium">{item.category}</span>
            </div>
            <div className="text-2xl font-bold mb-2">
              {item.value.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {item.description}
            </div>
            <div className="flex flex-wrap gap-1">
              {item.pairs.map(pair => (
                <span
                  key={pair}
                  className="px-2 py-1 text-xs font-medium bg-white rounded-full shadow-sm"
                >
                  {pair}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name
              ]}
            />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}