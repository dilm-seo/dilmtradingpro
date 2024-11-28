import React from 'react';
import { Activity } from 'lucide-react';

interface VolumeData {
  hour: number;
  volume: number;
  sentiment: number;
  mainPairs: string[];
}

interface VolumeHeatmapProps {
  data: VolumeData[];
}

export function VolumeHeatmap({ data }: VolumeHeatmapProps) {
  const getIntensityColor = (volume: number, sentiment: number) => {
    const alpha = Math.min(1, volume / 100);
    const r = sentiment > 0 ? 34 : sentiment < 0 ? 239 : 234;
    const g = sentiment > 0 ? 197 : sentiment < 0 ? 68 : 179;
    const b = sentiment > 0 ? 94 : sentiment < 0 ? 68 : 8;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">Volume d'activité par heure</h3>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {data.map((item) => (
          <div
            key={item.hour}
            className="aspect-square rounded-lg p-2 flex flex-col items-center justify-center relative group"
            style={{
              backgroundColor: getIntensityColor(item.volume, item.sentiment),
            }}
          >
            <div className="text-sm font-medium text-gray-900">
              {item.hour}h
            </div>
            <div className="text-xs text-gray-700">
              {item.volume}%
            </div>
            
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max p-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="text-xs font-medium mb-1">Paires actives:</div>
              <div className="flex flex-wrap gap-1">
                {item.mainPairs.map(pair => (
                  <span
                    key={pair}
                    className="px-1.5 py-0.5 text-xs bg-gray-100 rounded"
                  >
                    {pair}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Positif</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Négatif</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Neutre</span>
        </div>
      </div>
    </div>
  );
}