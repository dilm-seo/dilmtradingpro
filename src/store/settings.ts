import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  apiKey: string;
  model: string;
  newsAnalysisPrompt: string;
  sentimentPrompt: string;
  opportunityPrompt: string;
  visualizationPrompt: string;
  tradingSessionPrompt: string;
  currencyImpactPrompt: string;
}

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  apiKey: '',
  model: 'gpt-4-turbo-preview',
  newsAnalysisPrompt: "Analysez cette actualité financière et fournissez un résumé détaillé en français des points clés et de leur impact potentiel sur les marchés. Concentrez-vous sur les implications concrètes pour les traders.",
  sentimentPrompt: "Analysez le sentiment de marché de manière précise en tenant compte du contexte global, des implications à court et moyen terme. Fournissez une note entre -1 (très négatif) et 1 (très positif).",
  opportunityPrompt: "Identifiez les opportunités de trading concrètes basées sur cette actualité. Précisez les paires de devises, niveaux de prix, et la direction du trade.",
  visualizationPrompt: "Générez une représentation visuelle des données clés sous forme de graphique ou tableau.",
  tradingSessionPrompt: "Évaluez l'impact de ces actualités sur les différentes sessions de trading (Asiatique, Européenne, Américaine) avec un score d'impact de -1 à 1.",
  currencyImpactPrompt: "Identifiez les devises les plus impactées par ces actualités, avec un score d'impact de -1 à 1 et une explication détaillée."
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'settings-storage',
    }
  )
);