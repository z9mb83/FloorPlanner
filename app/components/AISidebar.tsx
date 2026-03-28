'use client';

import { useState } from 'react';
import { RoomType, ROOM_NAMES, ROOM_COLORS } from '../types';
import { Sparkles, Wand2, Layout, Maximize2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface AISidebarProps {
  onGenerate: (roomType: RoomType, dimensions: { width: number; height: number }) => void;
  onOptimize: () => void;
  roomCount: number;
}

const roomPresets = [
  { type: 'living-room' as RoomType, width: 200, height: 150, icon: '🛋️' },
  { type: 'bedroom' as RoomType, width: 160, height: 140, icon: '🛏️' },
  { type: 'kitchen' as RoomType, width: 140, height: 120, icon: '🍳' },
  { type: 'bathroom' as RoomType, width: 80, height: 80, icon: '🚿' },
  { type: 'dining-room' as RoomType, width: 180, height: 120, icon: '🍽️' },
  { type: 'office' as RoomType, width: 120, height: 100, icon: '💼' },
];

export default function AISidebar({ onGenerate, onOptimize, roomCount }: AISidebarProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living-room');
  const [customWidth, setCustomWidth] = useState(200);
  const [customHeight, setCustomHeight] = useState(150);
  const [showTips, setShowTips] = useState(false);

  const handleGenerate = () => {
    onGenerate(selectedRoom, { width: customWidth, height: customHeight });
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-semibold text-gray-800">AI Assistant</h2>
        </div>
        <p className="text-xs text-gray-500">Generate & optimize layouts</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Room Generator */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary-500" />
            Quick Room Generator
          </h3>

          {/* Room Type Presets */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {roomPresets.map((preset) => (
              <button
                key={preset.type}
                onClick={() => {
                  setSelectedRoom(preset.type);
                  setCustomWidth(preset.width);
                  setCustomHeight(preset.height);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedRoom === preset.type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{preset.icon}</div>
                <div className="text-xs font-medium text-gray-700">
                  {ROOM_NAMES[preset.type]}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(preset.width / 10)}×{Math.round(preset.height / 10)} ft
                </div>
              </button>
            ))}
          </div>

          {/* Custom Dimensions */}
          <div className="space-y-3 mb-4">
            <label className="block text-xs font-medium text-gray-600">Custom Dimensions</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width (ft)</label>
                <input
                  type="number"
                  value={Math.round(customWidth / 10)}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) * 10)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height (ft)</label>
                <input
                  type="number"
                  value={Math.round(customHeight / 10)}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) * 10)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Generate Room</span>
          </button>
        </div>

        {/* AI Optimization */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4 text-green-500" />
            Layout Optimizer
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            AI will analyze your floor plan and suggest improvements for space utilization and flow.
          </p>
          <button
            onClick={onOptimize}
            disabled={roomCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="font-medium">Optimize Layout</span>
          </button>
        </div>

        {/* AI Tips */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Design Tips
            </div>
            {showTips ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showTips && (
            <div className="mt-3 space-y-2">
              {[
                'Allow at least 36" of walkway between furniture',
                'Place beds away from doors for better sleep',
                'Kitchen work triangle: sink-stove-fridge',
                'Living room seating should be 8-10 feet apart',
                'Bathroom doors should not open into fixtures',
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg"
                >
                  <span className="text-xs font-medium text-yellow-600 mt-0.5">
                    {index + 1}.
                  </span>
                  <span className="text-xs text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <span className="font-medium">{roomCount}</span> room{roomCount !== 1 ? 's' : ''} created
        </div>
      </div>
    </div>
  );
}
