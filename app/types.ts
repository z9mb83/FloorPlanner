export type Tool = 'select' | 'wall' | 'room' | 'door' | 'window' | 'furniture' | 'measure';

export type RoomType = 
  | 'living-room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'dining-room'
  | 'office'
  | 'hallway'
  | 'garage'
  | 'custom';

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Room {
  id: string;
  type: RoomType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  wallThickness: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
}

export interface Furniture {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  roomId?: string;
}

export interface FloorPlanData {
  rooms: Room[];
  furniture: Furniture[];
  walls: Wall[];
  scale: number;
}

export interface FurnitureTemplate {
  type: string;
  name: string;
  width: number;
  height: number;
  color: string;
  category: string;
}

export const ROOM_COLORS: Record<RoomType, string> = {
  'living-room': '#fef3c7',
  'bedroom': '#dbeafe',
  'kitchen': '#fce7f3',
  'bathroom': '#d1fae5',
  'dining-room': '#ffedd5',
  'office': '#e0e7ff',
  'hallway': '#f3f4f6',
  'garage': '#e5e7eb',
  'custom': '#f3f4f6',
};

export const ROOM_NAMES: Record<RoomType, string> = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'bathroom': 'Bathroom',
  'dining-room': 'Dining Room',
  'office': 'Office',
  'hallway': 'Hallway',
  'garage': 'Garage',
  'custom': 'Custom Room',
};

export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  { type: 'sofa', name: 'Sofa', width: 200, height: 90, color: '#8b5cf6', category: 'Living Room' },
  { type: 'armchair', name: 'Armchair', width: 80, height: 80, color: '#a78bfa', category: 'Living Room' },
  { type: 'coffee-table', name: 'Coffee Table', width: 120, height: 60, color: '#c4b5fd', category: 'Living Room' },
  { type: 'tv-stand', name: 'TV Stand', width: 150, height: 50, color: '#ddd6fe', category: 'Living Room' },
  { type: 'bed-king', name: 'King Bed', width: 200, height: 200, color: '#3b82f6', category: 'Bedroom' },
  { type: 'bed-queen', name: 'Queen Bed', width: 160, height: 200, color: '#60a5fa', category: 'Bedroom' },
  { type: 'bed-twin', name: 'Twin Bed', width: 100, height: 200, color: '#93c5fd', category: 'Bedroom' },
  { type: 'wardrobe', name: 'Wardrobe', width: 120, height: 60, color: '#bfdbfe', category: 'Bedroom' },
  { type: 'nightstand', name: 'Nightstand', width: 50, height: 50, color: '#dbeafe', category: 'Bedroom' },
  { type: 'dining-table', name: 'Dining Table', width: 180, height: 90, color: '#f59e0b', category: 'Dining' },
  { type: 'dining-chair', name: 'Dining Chair', width: 45, height: 45, color: '#fbbf24', category: 'Dining' },
  { type: 'kitchen-island', name: 'Kitchen Island', width: 150, height: 90, color: '#10b981', category: 'Kitchen' },
  { type: 'stove', name: 'Stove', width: 70, height: 70, color: '#34d399', category: 'Kitchen' },
  { type: 'refrigerator', name: 'Refrigerator', width: 80, height: 80, color: '#6ee7b7', category: 'Kitchen' },
  { type: 'sink', name: 'Kitchen Sink', width: 70, height: 60, color: '#a7f3d0', category: 'Kitchen' },
  { type: 'desk', name: 'Desk', width: 140, height: 70, color: '#ef4444', category: 'Office' },
  { type: 'office-chair', name: 'Office Chair', width: 60, height: 60, color: '#f87171', category: 'Office' },
  { type: 'bookshelf', name: 'Bookshelf', width: 80, height: 40, color: '#fca5a5', category: 'Office' },
  { type: 'toilet', name: 'Toilet', width: 50, height: 70, color: '#06b6d4', category: 'Bathroom' },
  { type: 'sink-bathroom', name: 'Bathroom Sink', width: 60, height: 50, color: '#22d3ee', category: 'Bathroom' },
  { type: 'shower', name: 'Shower', width: 90, height: 90, color: '#67e8f9', category: 'Bathroom' },
  { type: 'bathtub', name: 'Bathtub', width: 180, height: 80, color: '#a5f3fc', category: 'Bathroom' },
];
