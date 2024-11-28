import { useState, useEffect } from 'react';
import { fetchRSSFeed } from '../utils/api';

export function useFeed(refreshInterval = 300000) { // 5 minutes default
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const feed = await fetchRSSFeed();
      setData(feed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}