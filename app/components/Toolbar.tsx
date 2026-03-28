'use client';

import { Tool } from '../types';
import {
  MousePointer2,
  Square,
  DoorOpen,
  LayoutGrid,
  Ruler,
  Download,
  FileImage,
  FileText,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface ToolbarProps {
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  onExport: (format: 'png' | 'pdf') => void;
}

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'room', icon: Square, label: 'Room' },
  { id: 'wall', icon: LayoutGrid, label: 'Wall' },
  { id: 'door', icon: DoorOpen, label: 'Door' },
  { id: 'window', icon: LayoutGrid, label: 'Window' },
  { id: 'measure', icon: Ruler, label: 'Measure' },
];

export default function Toolbar({ selectedTool, onSelectTool, onExport }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-semibold text-gray-800">AI Floor Planner</h1>
      </div>

      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onExport('png')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Export as PNG"
        >
          <FileImage className="w-5 h-5" />
          <span className="text-sm">PNG</span>
        </button>
        <button
          onClick={() => onExport('pdf')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Export as PDF"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm">PDF</span>
        </button>
        <div className="w-px h-8 bg-gray-200 mx-2" />
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
