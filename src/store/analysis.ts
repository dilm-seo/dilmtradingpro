import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Analysis, AnalysisState } from '../types/analysis';

const initialState: Omit<AnalysisState, 'addAnalysis' | 'setAnalyzing' | 'setError'> = {
  analyses: [],
  isAnalyzing: false,
  error: null
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      ...initialState,
      addAnalysis: (analysis: Analysis) => 
        set((state) => ({ 
          analyses: [analysis, ...state.analyses].slice(0, 50),
          error: null
        })),
      setAnalyzing: (status: boolean) => set({ isAnalyzing: status }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'analysis-storage',
      version: 1,
      partialize: (state) => ({
        analyses: state.analyses?.map(analysis => ({
          ...analysis,
          id: analysis.id,
          timestamp: analysis.timestamp,
          newsId: analysis.newsId,
          sentiment: {
            global: analysis.sentiment?.global || 0,
            currencies: analysis.sentiment?.currencies || {}
          },
          opportunities: (analysis.opportunities || []).map(o => ({
            pair: o.pair,
            direction: o.direction,
            reason: o.reason,
            timeframe: o.timeframe
          })),
          analysis: {
            mainPoints: analysis.analysis?.mainPoints || [],
            marketContext: analysis.analysis?.marketContext || '',
            technicalLevels: {
              support: analysis.analysis?.technicalLevels?.support || [],
              resistance: analysis.analysis?.technicalLevels?.resistance || []
            }
          },
          tradingSessions: analysis.tradingSessions || [],
          impactedCurrencies: analysis.impactedCurrencies || [],
          volumeActivity: analysis.volumeActivity || []
        })) || []
      })
    }
  )
);