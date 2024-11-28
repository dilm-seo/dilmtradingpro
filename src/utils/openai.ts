import OpenAI from 'openai';
import { Settings } from '../types/settings';
import { sleep } from './helpers';

export async function createOpenAIClient(apiKey: string) {
  return new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });
}

export async function analyzeNews(content: string, settings: Settings, retries = 3) {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      const client = await createOpenAIClient(settings.apiKey);
      
      const messages = [
        {
          role: 'system',
          content: 'Vous êtes un expert en analyse financière. Analysez les actualités et fournissez une réponse en JSON.'
        },
        {
          role: 'user',
          content: `Analysez cette actualité et fournissez une réponse JSON avec la structure suivante:
          {
            "sentiment": {
              "global": number (-1 à 1),
              "currencies": { [devise: string]: number (-1 à 1) }
            },
            "opportunities": [
              {
                "pair": string,
                "direction": "long" | "short",
                "timeframe": string,
                "reason": string
              }
            ],
            "analysis": {
              "mainPoints": string[],
              "marketContext": string,
              "technicalLevels": {
                "support": number[],
                "resistance": number[]
              }
            },
            "tradingSessions": [
              {
                "session": string,
                "impact": number,
                "analysis": string
              }
            ],
            "impactedCurrencies": [
              {
                "currency": string,
                "impact": number,
                "reason": string
              }
            ],
            "volumeActivity": [
              {
                "hour": number,
                "volume": number,
                "sentiment": number,
                "mainPairs": string[]
              }
            ]
          }

          Contenu à analyser: ${content}`
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
        sentiment: {
          global: result.sentiment?.global || 0,
          currencies: result.sentiment?.currencies || {}
        },
        opportunities: Array.isArray(result.opportunities) ? result.opportunities : [],
        analysis: {
          mainPoints: Array.isArray(result.analysis?.mainPoints) ? result.analysis.mainPoints : [],
          marketContext: result.analysis?.marketContext || '',
          technicalLevels: {
            support: Array.isArray(result.analysis?.technicalLevels?.support) ? result.analysis.technicalLevels.support : [],
            resistance: Array.isArray(result.analysis?.technicalLevels?.resistance) ? result.analysis.technicalLevels.resistance : []
          }
        },
        tradingSessions: Array.isArray(result.tradingSessions) ? result.tradingSessions : [],
        impactedCurrencies: Array.isArray(result.impactedCurrencies) ? result.impactedCurrencies : [],
        volumeActivity: Array.isArray(result.volumeActivity) ? result.volumeActivity : []
      };
    } catch (error) {
      attempt++;
      console.error(`Tentative ${attempt} échouée:`, error);
      
      if (attempt === retries) {
        throw new Error('Échec de l\'analyse après plusieurs tentatives');
      }
      
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
  
  throw new Error('Échec inattendu de l\'analyse');
}

export async function analyzeBatch(news: any[], settings: Settings, onProgress: (progress: number) => void) {
  const batchSize = 3;
  const results = [];
  let processedCount = 0;

  for (let i = 0; i < news.length; i += batchSize) {
    const batch = news.slice(i, i + batchSize);
    
    for (const item of batch) {
      try {
        await sleep(3000); // Increased pause between analyses
        const result = await analyzeNews(
          `${item.title}\n${item.description}`,
          settings
        );
        
        if (result) {
          results.push({
            ...result,
            id: Math.random().toString(36).substring(2),
            timestamp: new Date().toISOString(),
            newsId: item.guid
          });
        }
      } catch (error) {
        console.error(`Erreur d'analyse pour l'item:`, error);
      }
      
      processedCount++;
      onProgress((processedCount / news.length) * 100);
    }
  }

  if (results.length === 0) {
    throw new Error('Aucune analyse n\'a pu être effectuée');
  }

  return results;
}

export async function generatePrompt(type: string, settings: Settings): Promise<string> {
  const client = await createOpenAIClient(settings.apiKey);
  
  const response = await client.chat.completions.create({
    model: settings.model,
    messages: [
      {
        role: 'system',
        content: `Vous êtes un expert en génération de prompts pour l'analyse financière. 
        Créez un prompt détaillé et précis en français pour ${type}.`
      },
      {
        role: 'user',
        content: 'Générez un nouveau prompt optimisé pour l\'analyse des marchés financiers.'
      }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content || '';
}