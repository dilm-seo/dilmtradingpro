import React, { useState, useEffect } from 'react';
import { Scan } from 'lucide-react';
import { useSettingsStore } from '../store/settings';
import { useAnalysisStore } from '../store/analysis';
import { useFeed } from '../hooks/useFeed';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { analyzeBatch } from '../utils/openai';
import { AnalysisLoader } from './AnalysisLoader';
import { DashboardGrid } from './DashboardGrid';
import { Analysis } from '../types/analysis';
import { retryWithBackoff } from '../utils/helpers';

export function Dashboard() {
  const { data: feedData, loading: feedLoading, error: feedError } = useFeed();
  const settings = useSettingsStore();
  const { analyses, isAnalyzing, error: analysisError, addAnalysis, setAnalyzing, setError } = useAnalysisStore();
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (analyses && analyses.length > 0) {
      setLatestAnalysis(analyses[0]);
    }
  }, [analyses]);

  const handleGlobalScan = async () => {
    if (!settings.apiKey) {
      alert('Veuillez configurer votre clé API OpenAI dans les paramètres');
      return;
    }

    if (!feedData?.item?.length) {
      alert('Aucune actualité disponible à analyser');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      const results = await retryWithBackoff(() => 
        analyzeBatch(
          feedData.item.slice(0, 10),
          settings,
          (progress) => setProgress(progress)
        )
      );
      
      results.forEach(result => {
        if (result) addAnalysis(result);
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'analyse globale');
    } finally {
      setAnalyzing(false);
      setProgress(0);
    }
  };

  if (feedLoading) {
    return <LoadingSpinner />;
  }

  if (feedError) {
    return <ErrorMessage message={feedError.message} />;
  }

  return (
    <div className="space-y-6">
      {isAnalyzing && <AnalysisLoader progress={progress} />}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <button
          onClick={handleGlobalScan}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Scan className="w-5 h-5" />
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser maintenant'}
        </button>
      </div>

      {analysisError && <ErrorMessage message={analysisError} />}

      {!latestAnalysis && !isAnalyzing && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Cliquez sur "Analyser maintenant" pour obtenir des insights sur les dernières actualités
          </p>
        </div>
      )}

      {latestAnalysis && <DashboardGrid analysis={latestAnalysis} analyses={analyses} />}
    </div>
  );
}