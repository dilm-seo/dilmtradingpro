import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Analysis } from '../types/analysis';

interface NewsTickerProps {
  analysis: Analysis | null;
}

export function NewsTicker({ analysis }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const opportunities = analysis?.opportunities || [];

  useEffect(() => {
    if (opportunities.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % opportunities.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [opportunities.length]);

  if (!analysis || opportunities.length === 0) {
    return null;
  }

  const getConfidenceScore = (opportunity: typeof opportunities[0]) => {
    // Calculate confidence based on sentiment and market context
    const baseSentiment = Math.abs(analysis.sentiment?.global || 0);
    const matchingCurrency = opportunity.pair.split('/')[0];
    const currencySentiment = Math.abs(analysis.sentiment?.currencies?.[matchingCurrency] || 0);
    
    // Weighted score calculation
    const score = (baseSentiment * 0.4 + currencySentiment * 0.6) * 100;
    return Math.min(Math.round(score), 100);
  };

  const currentOpportunity = opportunities[currentIndex];
  const confidenceScore = getConfidenceScore(currentOpportunity);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentOpportunity.direction.toLowerCase() === 'long' ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
          <span className="font-medium">
            {currentOpportunity.direction.toUpperCase()} {currentOpportunity.pair}
          </span>
          <span className="text-blue-200">|</span>
          <span className="text-sm">
            Confiance: <span className="font-bold">{confidenceScore}%</span>
          </span>
          <span className="text-blue-200">|</span>
          <span className="text-sm italic">
            {currentOpportunity.reason}
          </span>
        </div>
        
        {opportunities.length > 1 && (
          <div className="flex space-x-1">
            {opportunities.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-blue-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}