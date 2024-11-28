import React from 'react';
import { TradingSession } from '../../types/settings';
import { Sun, Sunrise, Sunset } from 'lucide-react';

interface TradingSessionsImpactProps {
  sessions: TradingSession[];
}

export function TradingSessionsImpact({ sessions }: TradingSessionsImpactProps) {
  const getSessionIcon = (session: string) => {
    switch (session) {
      case 'Asian':
        return <Sunrise className="w-6 h-6" />;
      case 'European':
        return <Sun className="w-6 h-6" />;
      case 'American':
        return <Sunset className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 0.3) return 'bg-green-100 text-green-800';
    if (impact <= -0.3) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <div
          key={session.session}
          className="p-4 rounded-lg bg-white shadow-sm border"
        >
          <div className="flex items-center gap-3 mb-3">
            {getSessionIcon(session.session)}
            <h3 className="font-semibold">{session.session}</h3>
          </div>
          <div className={`inline-block px-2 py-1 rounded-full text-sm ${getImpactColor(session.impact)}`}>
            Impact: {(session.impact * 100).toFixed(0)}%
          </div>
          <p className="mt-2 text-sm text-gray-600">{session.analysis}</p>
        </div>
      ))}
    </div>
  );
}