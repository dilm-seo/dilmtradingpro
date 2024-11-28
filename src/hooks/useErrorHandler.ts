import { useCallback } from 'react';
import { useSettingsStore } from '../store/settings';
import { analyzeError } from '../utils/debugger';

export function useErrorHandler() {
  const settings = useSettingsStore();

  const handleError = useCallback(async (error: Error, context?: string) => {
    if (!settings.apiKey) {
      console.error('Clé API OpenAI non configurée');
      return;
    }

    try {
      const analysis = await analyzeError(error, context || '', settings);
      
      console.group('🔍 Analyse de l\'erreur');
      console.log('Description:', analysis.error);
      console.log('Analyse:', analysis.analysis);
      console.log('Solution:', analysis.solution);
      if (analysis.code) {
        console.log('Code suggéré:', analysis.code);
      }
      console.groupEnd();

      return analysis;
    } catch (e) {
      console.error('Erreur lors de l\'analyse:', e);
    }
  }, [settings]);

  return handleError;
}