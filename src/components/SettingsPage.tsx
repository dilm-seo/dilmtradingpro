import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useSettingsStore } from '../store/settings';
import { generatePrompt } from '../utils/openai';

export function SettingsPage() {
  const settings = useSettingsStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGeneratePrompt = async (type: string) => {
    if (!settings.apiKey) {
      alert('Veuillez d\'abord configurer votre clé API OpenAI');
      return;
    }

    setLoading(type);
    try {
      const newPrompt = await generatePrompt(type, settings);
      settings.updateSettings({ [type]: newPrompt });
    } catch (error) {
      alert('Erreur lors de la génération du prompt');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuration OpenAI</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clé API OpenAI
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => settings.updateSettings({ apiKey: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="sk-..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle
            </label>
            <select
              value={settings.model}
              onChange={(e) => settings.updateSettings({ model: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Prompts personnalisés</h2>
        <div className="space-y-6">
          {Object.entries({
            newsAnalysisPrompt: 'Analyse des actualités',
            sentimentPrompt: 'Analyse des sentiments',
            opportunityPrompt: 'Identification des opportunités',
            visualizationPrompt: 'Visualisation des données'
          }).map(([key, label]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <button
                  onClick={() => handleGeneratePrompt(key)}
                  disabled={loading === key}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  {loading === key ? 'Génération...' : 'Générer'}
                </button>
              </div>
              <textarea
                value={settings[key as keyof typeof settings] as string}
                onChange={(e) => settings.updateSettings({ [key]: e.target.value })}
                className="w-full p-2 border rounded-md h-24"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}