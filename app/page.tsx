'use client';

import { useState, useRef, useCallback } from 'react';
import FloorPlanCanvas from './components/FloorPlanCanvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import AISidebar from './components/AISidebar';
import FurnitureLibrary from './components/FurnitureLibrary';
import { FloorPlanData, Room, Tool, Furniture, RoomType } from './types';
import { generateRoomLayout, optimizeLayout, calculateArea } from './utils/aiLayout';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [floorPlan, setFloorPlan] = useState<FloorPlanData>({
    rooms: [],
    furniture: [],
    walls: [],
    scale: 1,
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddRoom = useCallback((room: Room) => {
    setFloorPlan((prev) => ({
      ...prev,
      rooms: [...prev.rooms, room],
    }));
  }, []);

  const handleUpdateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    setFloorPlan((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r)),
    }));
  }, []);

  const handleDeleteRoom = useCallback((roomId: string) => {
    setFloorPlan((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r.id !== roomId),
      furniture: prev.furniture.filter((f) => f.roomId !== roomId),
    }));
    setSelectedRoom(null);
  }, []);

  const handleAddFurniture = useCallback((furniture: Furniture) => {
    setFloorPlan((prev) => ({
      ...prev,
      furniture: [...prev.furniture, furniture],
    }));
  }, []);

  const handleUpdateFurniture = useCallback((furnitureId: string, updates: Partial<Furniture>) => {
    setFloorPlan((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) => (f.id === furnitureId ? { ...f, ...updates } : f)),
    }));
  }, []);

  const handleDeleteFurniture = useCallback((furnitureId: string) => {
    setFloorPlan((prev) => ({
      ...prev,
      furniture: prev.furniture.filter((f) => f.id !== furnitureId),
    }));
    setSelectedFurniture(null);
  }, []);

  const handleAIGenerate = useCallback((roomType: RoomType, dimensions: { width: number; height: number }) => {
    const newRoom = generateRoomLayout(roomType, dimensions);
    handleAddRoom(newRoom);
  }, [handleAddRoom]);

  const handleAIOptimize = useCallback(() => {
    const optimized = optimizeLayout(floorPlan.rooms, floorPlan.furniture);
    setFloorPlan((prev) => ({
      ...prev,
      rooms: optimized.rooms,
      furniture: optimized.furniture,
    }));
  }, [floorPlan.rooms, floorPlan.furniture]);

  const handleExport = useCallback(async (format: 'png' | 'pdf') => {
    if (!canvasRef.current) return;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(canvasRef.current);

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'floor-plan.png';
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save('floor-plan.pdf');
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar - AI Tools */}
        <AISidebar
          onGenerate={handleAIGenerate}
          onOptimize={handleAIOptimize}
          roomCount={floorPlan.rooms.length}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <Toolbar
            selectedTool={selectedTool}
            onSelectTool={setSelectedTool}
            onExport={handleExport}
          />

          {/* Canvas Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-4 overflow-auto">
              <div
                ref={canvasRef}
                className="bg-white rounded-lg shadow-lg border border-gray-200"
                style={{ minHeight: '600px' }}
              >
                <FloorPlanCanvas
                  floorPlan={floorPlan}
                  selectedTool={selectedTool}
                  selectedRoom={selectedRoom}
                  selectedFurniture={selectedFurniture}
                  onAddRoom={handleAddRoom}
                  onUpdateRoom={handleUpdateRoom}
                  onSelectRoom={setSelectedRoom}
                  onSelectFurniture={setSelectedFurniture}
                  onUpdateFurniture={handleUpdateFurniture}
                />
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              {selectedRoom ? (
                <PropertiesPanel
                  type="room"
                  data={selectedRoom}
                  onUpdate={(updates) => handleUpdateRoom(selectedRoom.id, updates as Partial<Room>)}
                  onDelete={() => handleDeleteRoom(selectedRoom.id)}
                />
              ) : selectedFurniture ? (
                <PropertiesPanel
                  type="furniture"
                  data={selectedFurniture}
                  onUpdate={(updates) => handleUpdateFurniture(selectedFurniture.id, updates as Partial<Furniture>)}
                  onDelete={() => handleDeleteFurniture(selectedFurniture.id)}
                />
              ) : (
                <FurnitureLibrary onAddFurniture={handleAddFurniture} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
