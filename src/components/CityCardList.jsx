import React, { useState } from 'react';
import CityCard from './CityCard';
import { Plus } from 'lucide-react';

export default function CityCardList({ savedZones, activeZone, onSelectZone, offsetMinutes = 0, onAddCity, use24HourTime, onRemoveZone, onReorderZone }) {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target) e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    setDraggedIdx(null);
    if (e.target) e.target.style.opacity = '1';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== index) {
      if (onReorderZone) onReorderZone(draggedIdx, index);
    }
  };
  
  return (
    <div className="city-list-container">
      <div className="add-city-top">
        <button onClick={onAddCity}>
          Add Another City <Plus size={16} />
        </button>
      </div>
      
      <div className="city-card-scroll">
        {savedZones.map((zone, index) => (
          <div
            key={zone}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            style={{ 
              display: 'flex', 
              transition: 'all 0.2s ease', 
              cursor: draggedIdx !== null ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            <CityCard 
              zone={zone} 
              isActive={zone === activeZone} 
              onClick={onSelectZone} 
              offsetMinutes={offsetMinutes}
              use24HourTime={use24HourTime}
              onRemove={() => onRemoveZone && onRemoveZone(zone)}
            />
          </div>
        ))}
      </div>

      <div className="add-city-bottom">
        <button onClick={onAddCity}>
          Add Another City <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
