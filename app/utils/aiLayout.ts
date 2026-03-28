import { Room, Furniture, RoomType, ROOM_COLORS, ROOM_NAMES } from '../types';

// AI Layout Generation
export function generateRoomLayout(
  roomType: RoomType,
  dimensions: { width: number; height: number }
): Room {
  // Ensure minimum dimensions
  const width = Math.max(dimensions.width, 80);
  const height = Math.max(dimensions.height, 80);

  return {
    id: `room-${Date.now()}`,
    type: roomType,
    name: ROOM_NAMES[roomType],
    x: 100,
    y: 100,
    width,
    height,
    color: ROOM_COLORS[roomType],
    rotation: 0,
    wallThickness: 10,
  };
}

// AI Layout Optimization
export function optimizeLayout(
  rooms: Room[],
  furniture: Furniture[]
): { rooms: Room[]; furniture: Furniture[] } {
  if (rooms.length === 0) {
    return { rooms, furniture };
  }

  // Create a grid layout optimization
  const optimizedRooms = [...rooms];
  const optimizedFurniture = [...furniture];

  // Simple layout optimization - arrange rooms in a grid
  const cols = Math.ceil(Math.sqrt(rooms.length));
  const spacing = 20;

  optimizedRooms.forEach((room, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    room.x = 50 + col * (250 + spacing);
    room.y = 50 + row * (200 + spacing);
  });

  // Position furniture within their rooms
  optimizedFurniture.forEach((furniture) => {
    // Find a room that can fit this furniture
    const suitableRoom = optimizedRooms.find(
      (room) => room.width >= furniture.width + 40 && room.height >= furniture.height + 40
    );

    if (suitableRoom) {
      furniture.roomId = suitableRoom.id;
      furniture.x = suitableRoom.x + 20;
      furniture.y = suitableRoom.y + 20;
    }
  });

  return { rooms: optimizedRooms, furniture: optimizedFurniture };
}

// Calculate area of a room
export function calculateArea(room: Room): number {
  return (room.width / 10) * (room.height / 10);
}

// Calculate total floor plan area
export function calculateTotalArea(rooms: Room[]): number {
  return rooms.reduce((total, room) => total + calculateArea(room), 0);
}

// AI Suggestion: Room placement recommendations
export function getRoomPlacementSuggestions(
  existingRooms: Room[],
  newRoomType: RoomType
): string[] {
  const suggestions: string[] = [];

  // Check adjacency rules
  const hasBedroom = existingRooms.some((r) => r.type === 'bedroom');
  const hasBathroom = existingRooms.some((r) => r.type === 'bathroom');
  const hasKitchen = existingRooms.some((r) => r.type === 'kitchen');
  const hasLivingRoom = existingRooms.some((r) => r.type === 'living-room');
  const hasDiningRoom = existingRooms.some((r) => r.type === 'dining-room');

  switch (newRoomType) {
    case 'bedroom':
      if (!hasBathroom) {
        suggestions.push('Consider adding a bathroom nearby for convenience');
      }
      if (hasLivingRoom) {
        suggestions.push('Place bedroom away from the living room for quieter environment');
      }
      break;
    case 'bathroom':
      if (hasBedroom) {
        suggestions.push('Place bathroom adjacent to bedroom for easy access');
      }
      suggestions.push('Ensure bathroom has proper ventilation and waterproofing');
      break;
    case 'kitchen':
      if (hasDiningRoom) {
        suggestions.push('Place kitchen near dining room for easy serving');
      }
      suggestions.push('Kitchen should have access to exterior for ventilation');
      break;
    case 'living-room':
      suggestions.push('Living room should be centrally located for easy access');
      suggestions.push('Consider natural lighting when placing the living room');
      break;
  }

  // General spacing suggestions
  suggestions.push('Maintain at least 3 feet of clearance around furniture');
  suggestions.push('Consider traffic flow patterns when positioning the room');

  return suggestions;
}

// AI Analysis: Room size recommendations
export function getRoomSizeRecommendations(roomType: RoomType): {
  minWidth: number;
  minHeight: number;
  optimalWidth: number;
  optimalHeight: number;
  notes: string[];
} {
  const recommendations: Record<RoomType, any> = {
    'living-room': {
      minWidth: 120,
      minHeight: 100,
      optimalWidth: 180,
      optimalHeight: 150,
      notes: ['Should accommodate seating for 4-6 people', 'Allow space for TV viewing'],
    },
    'bedroom': {
      minWidth: 90,
      minHeight: 100,
      optimalWidth: 140,
      optimalHeight: 140,
      notes: ['King bed requires at least 13x13 feet', 'Include space for wardrobe and nightstands'],
    },
    'kitchen': {
      minWidth: 80,
      minHeight: 80,
      optimalWidth: 120,
      optimalHeight: 100,
      notes: ['Work triangle between sink, stove, and fridge should be 4-9 feet', 'Allow counter space on both sides of stove'],
    },
    'bathroom': {
      minWidth: 60,
      minHeight: 60,
      optimalWidth: 80,
      optimalHeight: 80,
      notes: ['Minimum 30x60 inches for toilet clearance', 'Shower requires at least 36x36 inches'],
    },
    'dining-room': {
      minWidth: 100,
      minHeight: 100,
      optimalWidth: 160,
      optimalHeight: 120,
      notes: ['Allow 24 inches per person at the table', '36 inches clearance behind chairs'],
    },
    'office': {
      minWidth: 80,
      minHeight: 80,
      optimalWidth: 100,
      optimalHeight: 100,
      notes: ['Desk should be at least 24 inches deep', 'Allow space for chair movement'],
    },
    'hallway': {
      minWidth: 40,
      minHeight: 60,
      optimalWidth: 48,
      optimalHeight: 120,
      notes: ['Minimum 36 inches wide for comfortable passage', 'Consider lighting for the entire length'],
    },
    'garage': {
      minWidth: 200,
      minHeight: 200,
      optimalWidth: 240,
      optimalHeight: 240,
      notes: ['Standard single car garage is 12x22 feet', 'Allow space for storage and workbench'],
    },
    'custom': {
      minWidth: 80,
      minHeight: 80,
      optimalWidth: 120,
      optimalHeight: 120,
      notes: ['Define the purpose before finalizing dimensions', 'Consider furniture and equipment needs'],
    },
  };

  return recommendations[roomType];
}

// Check for room overlaps
export function detectOverlaps(rooms: Room[]): Array<{ room1: Room; room2: Room }> {
  const overlaps: Array<{ room1: Room; room2: Room }> = [];

  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const r1 = rooms[i];
      const r2 = rooms[j];

      if (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y
      ) {
        overlaps.push({ room1: r1, room2: r2 });
      }
    }
  }

  return overlaps;
}
