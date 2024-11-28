import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ChevronDown, ChevronUp, Scan } from 'lucide-react';
import { NewsItem as NewsItemType } from '../types/news';
import { useSettingsStore } from '../store/settings';
import { useAnalysisStore } from '../store/analysis';
import { analyzeNews } from '../utils/openai';

interface NewsItemProps {
  item: NewsItemType;
}

export function NewsItem({ item }: NewsItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true });
  const settings = useSettingsStore();
  const { addAnalysis, setAnalyzing, setError, isAnalyzing } = useAnalysisStore();

  const handleAnalyze = async () => {
    if (!settings.apiKey) {
      alert('Veuillez configurer votre clé API OpenAI dans les paramètres');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeNews(item.description, settings);
      addAnalysis({
        ...result,
        id: Math.random().toString(36).substring(2),
        timestamp: new Date().toISOString(),
        newsId: item.guid
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <article className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Scan className="w-4 h-4" />
            {isAnalyzing ? 'Analyse...' : 'Scanner'}
          </button>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span>{item.creator}</span>
        <span>•</span>
        <time dateTime={item.pubDate}>{timeAgo}</time>
        <span>•</span>
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 mb-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Masquer la description
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Afficher la description
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2">
            <p className="text-gray-700">{item.description}</p>
          </div>
        )}
      </div>
      
      {item.comments && (
        <a
          href={item.comments}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-blue-500 hover:text-blue-600"
        >
          Voir les commentaires
        </a>
      )}
    </article>
  );
}