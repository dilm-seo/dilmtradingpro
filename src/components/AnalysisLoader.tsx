import React from 'react';
import { Loader2, Brain, BarChart2, LineChart } from 'lucide-react';

interface AnalysisLoaderProps {
  progress: number;
}

export function AnalysisLoader({ progress }: AnalysisLoaderProps) {
  const steps = [
    {
      icon: <Brain className="w-5 h-5" />,
      label: 'Analyse du contexte',
      description: 'Compréhension approfondie des actualités'
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Évaluation des impacts',
      description: 'Mesure des effets sur les devises'
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      label: 'Génération des insights',
      description: 'Création des recommandations'
    }
  ];

  const currentStep = Math.floor((progress / 100) * steps.length);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>

        <h3 className="text-lg font-semibold text-center mb-2">
          Analyse en cours...
        </h3>

        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-1">
            {progress.toFixed(0)}% complété
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                index === currentStep
                  ? 'bg-blue-50 text-blue-700'
                  : index < currentStep
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-400'
              }`}
            >
              {step.icon}
              <div>
                <div className="font-medium">{step.label}</div>
                <div className="text-sm opacity-75">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Cette opération peut prendre quelques minutes...
        </p>
      </div>
    </div>
  );
}