import React from 'react';
import { Analysis } from '../types/analysis';
import { SentimentGauge } from './visualizations/SentimentGauge';
import { TrendTimeline } from './visualizations/TrendTimeline';
import { VolumeHeatmap } from './visualizations/VolumeHeatmap';
import { OpportunityCloud } from './visualizations/OpportunityCloud';
import { TradingSessionsImpact } from './visualizations/TradingSessionsImpact';
import { CurrencyImpactGrid } from './visualizations/CurrencyImpactGrid';
import { MarketInsights } from './visualizations/MarketInsights';
import { MarketSummary } from './visualizations/MarketSummary';
import { KeywordTrends } from './visualizations/KeywordTrends';

interface DashboardGridProps {
  analysis: Analysis;
  analyses: Analysis[];
}

export function DashboardGrid({ analysis, analyses }: DashboardGridProps) {
  if (!analysis || !analyses) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucune donnée d'analyse disponible</p>
      </div>
    );
  }

  const opportunities = analysis.opportunities || [];
  const mainPoints = analysis.analysis?.mainPoints || [];
  const volumeActivity = analysis.volumeActivity || [];
  const tradingSessions = analysis.tradingSessions || [];
  const impactedCurrencies = analysis.impactedCurrencies || [];
  const currencies = analysis.sentiment?.currencies || {};

  const timelineData = analyses
    .filter(a => a && a.sentiment && a.timestamp)
    .slice(0, 10)
    .map(a => ({
      timestamp: a.timestamp,
      ...a.sentiment.currencies
    }))
    .reverse();

  // Prepare market metrics for MarketSummary
  const marketMetrics = [
    {
      category: 'Sentiment Global',
      value: (analysis.sentiment?.global || 0) * 100,
      impact: analysis.sentiment?.global > 0 ? 'positive' : analysis.sentiment?.global < 0 ? 'negative' : 'neutral',
      pairs: Object.keys(currencies),
      description: 'Sentiment général du marché basé sur les actualités récentes'
    },
    {
      category: 'Volatilité',
      value: Math.abs((analysis.sentiment?.global || 0) * 150),
      impact: Math.abs(analysis.sentiment?.global || 0) > 0.5 ? 'negative' : 'positive',
      pairs: opportunities.map(o => o.pair),
      description: 'Niveau de volatilité attendu sur les principales paires'
    },
    {
      category: 'Opportunités',
      value: opportunities.length * 10,
      impact: opportunities.length > 0 ? 'positive' : 'neutral',
      pairs: opportunities.map(o => o.pair),
      description: `${opportunities.length} opportunités de trading identifiées`
    }
  ];

  // Extract keywords from analysis
  const keywords = mainPoints.reduce((acc, point) => {
    const words = point.split(' ')
      .filter(word => word.length > 4)
      .map(word => ({
        text: word,
        count: 1,
        sentiment: analysis.sentiment?.global || 0
      }));
    return [...acc, ...words];
  }, [] as Array<{ text: string; count: number; sentiment: number }>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Résumé du marché</h2>
          <MarketSummary data={marketMetrics} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment actuel</h2>
          <SentimentGauge 
            globalValue={analysis.sentiment?.global || 0} 
            currencyValues={currencies}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {timelineData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Évolution du sentiment</h2>
            <TrendTimeline 
              data={timelineData}
              currencies={Object.keys(currencies)}
            />
          </div>
        )}

        {volumeActivity.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Activité horaire</h2>
            <VolumeHeatmap data={volumeActivity} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tradingSessions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Sessions de trading</h2>
            <TradingSessionsImpact sessions={tradingSessions} />
          </div>
        )}

        {impactedCurrencies.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Impact sur les devises</h2>
            <CurrencyImpactGrid currencies={impactedCurrencies} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Opportunités</h2>
            <OpportunityCloud 
              opportunities={opportunities.map(o => 
                `${o.pair} - ${o.direction.toUpperCase()} - ${o.timeframe} - ${o.reason}`
              )} 
            />
          </div>
        )}

        {keywords.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Mots-clés tendance</h2>
            <KeywordTrends keywords={keywords} />
          </div>
        )}
      </div>

      {mainPoints.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Analyse détaillée du marché</h2>
          <MarketInsights analysis={mainPoints.join('\n')} />
        </div>
      )}
    </div>
  );
}