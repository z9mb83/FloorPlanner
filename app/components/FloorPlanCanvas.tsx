'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FloorPlanData, Room, Furniture, Tool, Point, ROOM_COLORS, ROOM_NAMES } from '../types';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlanData;
  selectedTool: Tool;
  selectedRoom: Room | null;
  selectedFurniture: Furniture | null;
  onAddRoom: (room: Room) => void;
  onUpdateRoom: (roomId: string, updates: Partial<Room>) => void;
  onSelectRoom: (room: Room | null) => void;
  onSelectFurniture: (furniture: Furniture | null) => void;
  onUpdateFurniture: (furnitureId: string, updates: Partial<Furniture>) => void;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const GRID_SIZE = 20;

export default function FloorPlanCanvas({
  floorPlan,
  selectedTool,
  selectedRoom,
  selectedFurniture,
  onAddRoom,
  onUpdateRoom,
  onSelectRoom,
  onSelectFurniture,
  onUpdateFurniture,
}: FloorPlanCanvasProps) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<Point | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<Point | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const snapToGrid = useCallback((value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, []);

  const getMousePosition = useCallback((e: React.MouseEvent<SVGSVGElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: snapToGrid(e.clientX - rect.left),
      y: snapToGrid(e.clientY - rect.top),
    };
  }, [snapToGrid]);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    const pos = getMousePosition(e);

    if (selectedTool === 'room') {
      setIsDrawing(true);
      setDrawStart(pos);
      setCurrentRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
    } else if (selectedTool === 'select') {
      // Check if clicking on a room
      const clickedRoom = floorPlan.rooms.find(
        (r) => pos.x >= r.x && pos.x <= r.x + r.width && pos.y >= r.y && pos.y <= r.y + r.height
      );

      if (clickedRoom) {
        onSelectRoom(clickedRoom);
        onSelectFurniture(null);
        setDragOffset({ x: pos.x - clickedRoom.x, y: pos.y - clickedRoom.y });
        setIsDrawing(true);
      } else {
        // Check if clicking on furniture
        const clickedFurniture = floorPlan.furniture.find(
          (f) => pos.x >= f.x && pos.x <= f.x + f.width && pos.y >= f.y && pos.y <= f.y + f.height
        );

        if (clickedFurniture) {
          onSelectFurniture(clickedFurniture);
          onSelectRoom(null);
          setDragOffset({ x: pos.x - clickedFurniture.x, y: pos.y - clickedFurniture.y });
          setIsDrawing(true);
        } else {
          onSelectRoom(null);
          onSelectFurniture(null);
        }
      }
    }
  }, [selectedTool, floorPlan.rooms, floorPlan.furniture, getMousePosition, onSelectRoom, onSelectFurniture]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getMousePosition(e);

    if (selectedTool === 'room' && drawStart) {
      const x = Math.min(drawStart.x, pos.x);
      const y = Math.min(drawStart.y, pos.y);
      const width = Math.abs(pos.x - drawStart.x);
      const height = Math.abs(pos.y - drawStart.y);
      setCurrentRect({ x, y, width, height });
    } else if (selectedTool === 'select' && dragOffset) {
      if (selectedRoom) {
        const newX = snapToGrid(pos.x - dragOffset.x);
        const newY = snapToGrid(pos.y - dragOffset.y);
        onUpdateRoom(selectedRoom.id, { x: newX, y: newY });
      } else if (selectedFurniture) {
        const newX = snapToGrid(pos.x - dragOffset.x);
        const newY = snapToGrid(pos.y - dragOffset.y);
        onUpdateFurniture(selectedFurniture.id, { x: newX, y: newY });
      }
    }
  }, [isDrawing, selectedTool, drawStart, dragOffset, selectedRoom, selectedFurniture, getMousePosition, snapToGrid, onUpdateRoom, onUpdateFurniture]);

  const handleMouseUp = useCallback(() => {
    if (selectedTool === 'room' && currentRect && currentRect.width > 50 && currentRect.height > 50) {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        type: 'custom',
        name: 'New Room',
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.width,
        height: currentRect.height,
        color: ROOM_COLORS.custom,
        rotation: 0,
        wallThickness: 10,
      };
      onAddRoom(newRoom);
    }

    setIsDrawing(false);
    setDrawStart(null);
    setCurrentRect(null);
    setDragOffset(null);
    setResizeHandle(null);
  }, [selectedTool, currentRect, onAddRoom]);

  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      lines.push(
        <line
          key={`v-${i}`}
          x1={i}
          y1={0}
          x2={i}
          y2={CANVAS_HEIGHT}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      );
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={i}
          x2={CANVAS_WIDTH}
          y2={i}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      );
    }
    return lines;
  };

  return (
    <svg
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background */}
      <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#fafafa" />

      {/* Grid */}
      {renderGrid()}

      {/* Rooms */}
      {floorPlan.rooms.map((room) => (
        <g key={room.id}>
          {/* Room fill */}
          <rect
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            fill={room.color}
            stroke={selectedRoom?.id === room.id ? '#0ea5e9' : '#374151'}
            strokeWidth={selectedRoom?.id === room.id ? 3 : room.wallThickness / 5}
            className="transition-all duration-200"
          />
          {/* Room label */}
          <text
            x={room.x + room.width / 2}
            y={room.y + room.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill="#374151"
            fontWeight="500"
          >
            {room.name}
          </text>
          {/* Room dimensions */}
          <text
            x={room.x + room.width / 2}
            y={room.y + room.height / 2 + 16}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {Math.round(room.width / 10)}ft × {Math.round(room.height / 10)}ft
          </text>
        </g>
      ))}

      {/* Furniture */}
      {floorPlan.furniture.map((furniture) => (
        <g key={furniture.id}>
          <rect
            x={furniture.x}
            y={furniture.y}
            width={furniture.width}
            height={furniture.height}
            fill={furniture.color}
            stroke={selectedFurniture?.id === furniture.id ? '#0ea5e9' : '#4b5563'}
            strokeWidth={selectedFurniture?.id === furniture.id ? 2 : 1}
            rx={2}
            className="transition-all duration-200"
          />
          <text
            x={furniture.x + furniture.width / 2}
            y={furniture.y + furniture.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#1f2937"
          >
            {furniture.name}
          </text>
        </g>
      ))}

      {/* Current drawing rectangle */}
      {currentRect && (
        <rect
          x={currentRect.x}
          y={currentRect.y}
          width={currentRect.width}
          height={currentRect.height}
          fill="rgba(14, 165, 233, 0.2)"
          stroke="#0ea5e9"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}

      {/* Selection handles for selected room */}
      {selectedRoom && (
        <>
          <rect
            x={selectedRoom.x - 5}
            y={selectedRoom.y - 5}
            width={10}
            height={10}
            fill="#0ea5e9"
            stroke="white"
            strokeWidth={2}
          />
          <rect
            x={selectedRoom.x + selectedRoom.width - 5}
            y={selectedRoom.y - 5}
            width={10}
            height={10}
            fill="#0ea5e9"
            stroke="white"
            strokeWidth={2}
          />
          <rect
            x={selectedRoom.x - 5}
            y={selectedRoom.y + selectedRoom.height - 5}
            width={10}
            height={10}
            fill="#0ea5e9"
            stroke="white"
            strokeWidth={2}
          />
          <rect
            x={selectedRoom.x + selectedRoom.width - 5}
            y={selectedRoom.y + selectedRoom.height - 5}
            width={10}
            height={10}
            fill="#0ea5e9"
            stroke="white"
            strokeWidth={2}
          />
        </>
      )}
    </svg>
  );
}
