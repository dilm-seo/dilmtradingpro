import OpenAI from 'openai';
import { Settings } from '../types/settings';

export async function createOpenAIClient(apiKey: string) {
  return new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });
}

export async function analyzeWithOpenAI(client: OpenAI, content: string, settings: Settings) {
  const messages = [
    {
      role: 'system',
      content: 'Vous êtes un expert en analyse financière. Analysez les actualités et fournissez des insights détaillés.'
    },
    { 
      role: 'user', 
      content: settings.newsAnalysisPrompt 
    },
    { 
      role: 'user', 
      content 
    }
  ];

  const response = await client.chat.completions.create({
    model: settings.model,
    messages,
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    sentiment: result.sentiment || { global: 0, currencies: {} },
    opportunities: result.opportunities || [],
    analysis: result.analysis || {
      mainPoints: [],
      marketContext: '',
      technicalLevels: { support: [], resistance: [] }
    },
    tradingSessions: result.tradingSessions || [],
    impactedCurrencies: result.impactedCurrencies || [],
    volumeActivity: result.volumeActivity || []
  };
}

export async function generatePromptWithOpenAI(client: OpenAI, type: string) {
  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Vous êtes un expert en génération de prompts pour l'analyse financière. 
        Créez un prompt détaillé et précis en français pour ${type}.`
      },
      { 
        role: 'user', 
        content: 'Générez un nouveau prompt' 
      }
    ],
    temperature: 0.8
  });

  return response.choices[0].message.content || '';
}