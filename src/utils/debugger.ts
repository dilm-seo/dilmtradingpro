import OpenAI from 'openai';
import { Settings } from '../types/settings';
import { createOpenAIClient } from './openai';
import { sleep } from './helpers';

interface DebugResult {
  error: string;
  analysis: string;
  solution: string;
  code?: string;
}

export async function analyzeError(
  error: Error,
  context: string,
  settings: Settings
): Promise<DebugResult> {
  try {
    const client = await createOpenAIClient(settings.apiKey);
    
    const response = await client.chat.completions.create({
      model: settings.model,
      messages: [
        {
          role: 'system',
          content: `Vous êtes un expert en débogage React et TypeScript. Analysez l'erreur fournie et proposez une solution détaillée. Répondez en JSON avec les champs suivants: error (description), analysis (analyse détaillée), solution (étapes de résolution), code (correction suggérée si nécessaire).`
        },
        {
          role: 'user',
          content: `Erreur: ${error.message}\nStack: ${error.stack}\nContexte: ${context}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur lors de l\'analyse du bug:', error);
    return {
      error: 'Erreur interne',
      analysis: 'Impossible d\'analyser l\'erreur',
      solution: 'Veuillez réessayer plus tard'
    };
  }
}

export function createErrorBoundaryHandler(settings: Settings) {
  return async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      const debugResult = await analyzeError(error, errorInfo.componentStack, settings);
      console.group('🔍 Analyse de l\'erreur par IA');
      console.log('Description:', debugResult.error);
      console.log('Analyse:', debugResult.analysis);
      console.log('Solution proposée:', debugResult.solution);
      if (debugResult.code) {
        console.log('Code suggéré:', debugResult.code);
      }
      console.groupEnd();
    } catch (e) {
      console.error('Erreur lors du débogage:', e);
    }
  };
}

export async function validateCode(
  code: string,
  settings: Settings
): Promise<{ isValid: boolean; suggestions: string[] }> {
  try {
    const client = await createOpenAIClient(settings.apiKey);
    
    const response = await client.chat.completions.create({
      model: settings.model,
      messages: [
        {
          role: 'system',
          content: `Vous êtes un expert en validation de code React et TypeScript. Analysez le code fourni pour détecter les problèmes potentiels. Répondez en JSON avec les champs suivants: isValid (boolean), suggestions (array de recommandations).`
        },
        {
          role: 'user',
          content: `Code à analyser:\n${code}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Erreur lors de la validation du code:', error);
    return {
      isValid: false,
      suggestions: ['Impossible de valider le code']
    };
  }
}