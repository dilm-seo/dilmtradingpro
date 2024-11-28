import React from 'react';
import { Hash } from 'lucide-react';

interface Keyword {
  text: string;
  count: number;
  sentiment: number;
}

interface KeywordTrendsProps {
  keywords: Keyword[];
}

export function KeywordTrends({ keywords }: KeywordTrendsProps) {
  const maxCount = Math.max(...keywords.map(k => k.count));

  const getFontSize = (count: number) => {
    const size = (count / maxCount) * 24 + 12;
    return size + 'px';
  };

  const getColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-600';
    if (sentiment < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">Mots-clés tendance</h3>
      </div>

      <div className="flex flex-wrap gap-4 justify-center p-4">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className={`${getColor(keyword.sentiment)} hover:opacity-75 transition-opacity cursor-default`}
            style={{ fontSize: getFontSize(keyword.count) }}
            title={`Mentions: ${keyword.count}`}
          >
            {keyword.text}
          </span>
        ))}
      </div>
    </div>
  );
}