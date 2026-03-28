'use client';

import { Room, Furniture, RoomType, ROOM_COLORS, ROOM_NAMES } from '../types';
import { Trash2, RotateCw, Palette, Type, Maximize2 } from 'lucide-react';

interface RoomPropertiesPanelProps {
  type: 'room';
  data: Room;
  onUpdate: (updates: Partial<Room>) => void;
  onDelete: () => void;
}

interface FurniturePropertiesPanelProps {
  type: 'furniture';
  data: Furniture;
  onUpdate: (updates: Partial<Furniture>) => void;
  onDelete: () => void;
}

type PropertiesPanelProps = RoomPropertiesPanelProps | FurniturePropertiesPanelProps;

export default function PropertiesPanel(props: PropertiesPanelProps) {
  const { type, data, onUpdate, onDelete } = props;
  const isRoom = type === 'room';
  const room = isRoom ? (data as Room) : null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isRoom ? 'Room Properties' : 'Furniture Properties'}
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value } as any)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Room Type (only for rooms) */}
        {isRoom && room && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select
              value={room.type}
              onChange={(e) => {
                const newType = e.target.value as RoomType;
                onUpdate({
                  type: newType,
                  color: ROOM_COLORS[newType],
                  name: ROOM_NAMES[newType],
                } as any);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(ROOM_NAMES).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={Math.round(data.width / 10)}
                onChange={(e) => onUpdate({ width: parseInt(e.target.value) * 10 } as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Width (ft)"
              />
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-gray-400 rotate-90" />
              <input
                type="number"
                value={Math.round(data.height / 10)}
                onChange={(e) => onUpdate({ height: parseInt(e.target.value) * 10 } as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Height (ft)"
              />
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <input
              type="color"
              value={data.color}
              onChange={(e) => onUpdate({ color: e.target.value } as any)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="360"
              value={data.rotation}
              onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) } as any)}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12 text-right">{data.rotation}°</span>
          </div>
        </div>

        {/* Wall Thickness (only for rooms) */}
        {isRoom && room && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wall Thickness</label>
            <input
              type="range"
              min="5"
              max="30"
              value={room.wallThickness}
              onChange={(e) => onUpdate({ wallThickness: parseInt(e.target.value) } as any)}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-right">{room.wallThickness}px</div>
          </div>
        )}

        {/* Delete Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete {isRoom ? 'Room' : 'Furniture'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
