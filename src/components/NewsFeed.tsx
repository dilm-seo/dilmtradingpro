import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useFeed } from '../hooks/useFeed';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { NewsItem } from './NewsItem';

export function NewsFeed() {
  const { data, loading, error, refetch } = useFeed();
  const [expandAll, setExpandAll] = useState(false);

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data?.title}</h1>
          <p className="text-gray-600">{data?.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {expandAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand All
              </>
            )}
          </button>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {data?.item.map((item: any) => (
          <NewsItem 
            key={`${item.guid}-${item.pubDate}`} 
            item={item} 
          />
        ))}
      </div>
    </div>
  );
}