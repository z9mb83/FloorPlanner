'use client';

import { useState } from 'react';
import { Furniture, FURNITURE_TEMPLATES, FurnitureTemplate } from '../types';
import { Armchair, Search, ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface FurnitureLibraryProps {
  onAddFurniture: (furniture: Furniture) => void;
}

const categories = Array.from(new Set(FURNITURE_TEMPLATES.map((f) => f.category)));

export default function FurnitureLibrary({ onAddFurniture }: FurnitureLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddFurniture = (template: FurnitureTemplate) => {
    const furniture: Furniture = {
      id: `furniture-${Date.now()}`,
      type: template.type,
      name: template.name,
      x: 100,
      y: 100,
      width: template.width,
      height: template.height,
      rotation: 0,
      color: template.color,
    };
    onAddFurniture(furniture);
  };

  const filteredTemplates = searchTerm
    ? FURNITURE_TEMPLATES.filter(
        (f) =>
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : FURNITURE_TEMPLATES;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Armchair className="w-5 h-5" />
        Furniture Library
      </h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search furniture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {categories.map((category) => {
          const categoryItems = filteredTemplates.filter((f) => f.category === category);
          if (categoryItems.length === 0) return null;

          const isExpanded = expandedCategories.includes(category);

          return (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-sm text-gray-700">{category}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="p-2 grid grid-cols-1 gap-1">
                  {categoryItems.map((template) => (
                    <button
                      key={template.type}
                      onClick={() => handleAddFurniture(template)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <div
                        className="w-10 h-8 rounded border-2 flex items-center justify-center"
                        style={{ borderColor: template.color, backgroundColor: template.color + '20' }}
                      >
                        <Plus className="w-4 h-4" style={{ color: template.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">{template.name}</div>
                        <div className="text-xs text-gray-500">
                          {Math.round(template.width / 10)}×{Math.round(template.height / 10)} ft
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No furniture found matching your search.</p>
        </div>
      )}

      {/* Help text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          Click on any furniture item to add it to your floor plan. You can then drag it to position it.
        </p>
      </div>
    </div>
  );
}
