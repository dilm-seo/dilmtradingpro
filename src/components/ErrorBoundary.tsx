import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../store/settings';
import { createErrorBoundaryHandler } from '../utils/debugger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  debugInfo: {
    analysis?: string;
    solution?: string;
  } | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      debugInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      debugInfo: null
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const settings = useSettingsStore.getState();
    const handler = createErrorBoundaryHandler(settings);
    await handler(error, errorInfo);
    
    this.setState({
      errorInfo,
      debugInfo: {
        analysis: 'Analyse en cours...',
        solution: 'Recherche de solutions...'
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 rounded-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Une erreur est survenue
          </h2>
          
          <div className="w-full max-w-2xl space-y-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-red-600 mb-2">Message d'erreur:</h3>
              <p className="text-gray-700 font-mono text-sm">
                {this.state.error?.message || 'Erreur inconnue'}
              </p>
            </div>

            {this.state.debugInfo && (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-blue-600 mb-2">Analyse:</h3>
                  <p className="text-gray-700">
                    {this.state.debugInfo.analysis}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-green-600 mb-2">Solution proposée:</h3>
                  <p className="text-gray-700">
                    {this.state.debugInfo.solution}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}