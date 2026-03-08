import React, { useState, useRef, useEffect, useCallback } from 'react';
import CityCard from './CityCard';
import { Plus } from 'lucide-react';

export default function CityCardList({ savedZones, activeZone, onSelectZone, offsetMinutes = 0, onAddCity, use24HourTime, onRemoveZone, onReorderZone }) {
  const [dragState, setDragState] = useState({
    isDragging: false,
    idx: null,
    hoverIdx: null,
    offsetY: 0,
    itemHeight: 0
  });

  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (dragState.isDragging) {
      const originalTouchAction = document.body.style.touchAction;
      const originalOverflow = document.body.style.overflow;
      document.body.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.touchAction = originalTouchAction;
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [dragState.isDragging]);

  const handlePointerDown = (e, index) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    
    e.currentTarget.setPointerCapture(e.pointerId);

    timerRef.current = setTimeout(() => {
      const rect = itemRefs.current[index]?.getBoundingClientRect();
      let gap = 16;
      if (itemRefs.current[0] && itemRefs.current[1]) {
        gap = itemRefs.current[1].getBoundingClientRect().top - itemRefs.current[0].getBoundingClientRect().bottom;
      }
      
      setDragState({
        isDragging: true,
        idx: index,
        hoverIdx: index,
        offsetY: 0,
        itemHeight: (rect?.height || 100) + Math.max(0, gap)
      });
      
      if (navigator.vibrate) navigator.vibrate(50);
    }, 300);
  };

  const handlePointerMove = (e, index) => {
    if (!dragState.isDragging) {
      if (Math.abs(e.clientX - startXRef.current) > 10 || Math.abs(e.clientY - startYRef.current) > 10) {
        clearTimeout(timerRef.current);
      }
      return;
    }
    
    const deltaY = e.clientY - startYRef.current;
    
    const offsetIndex = Math.round(deltaY / dragState.itemHeight);
    let newHoverIdx = dragState.idx + offsetIndex;
    newHoverIdx = Math.max(0, Math.min(newHoverIdx, savedZones.length - 1));
    
    setDragState(prev => ({
      ...prev,
      offsetY: deltaY,
      hoverIdx: newHoverIdx
    }));
  };

  const handlePointerUp = (e, index) => {
    clearTimeout(timerRef.current);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    
    if (dragState.isDragging) {
      if (dragState.hoverIdx !== null && dragState.hoverIdx !== dragState.idx) {
        if (onReorderZone) onReorderZone(dragState.idx, dragState.hoverIdx);
      }
      setDragState({ isDragging: false, idx: null, hoverIdx: null, offsetY: 0, itemHeight: 0 });
    }
  };

  const handlePointerCancel = (e, index) => {
    clearTimeout(timerRef.current);
    if (dragState.isDragging) {
      setDragState({ isDragging: false, idx: null, hoverIdx: null, offsetY: 0, itemHeight: 0 });
    }
  };

  const getTransform = (index) => {
    if (!dragState.isDragging) return 'translateY(0)';
    if (index === dragState.idx) return `translateY(${dragState.offsetY}px)`;
    
    const { idx, hoverIdx, itemHeight } = dragState;
    if (idx < hoverIdx && index > idx && index <= hoverIdx) return `translateY(-${itemHeight}px)`;
    if (idx > hoverIdx && index >= hoverIdx && index < idx) return `translateY(${itemHeight}px)`;
    
    return 'translateY(0)';
  };

  const getZIndex = (index) => (dragState.isDragging && index === dragState.idx ? 10 : 1);

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
            ref={el => itemRefs.current[index] = el}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onPointerMove={(e) => handlePointerMove(e, index)}
            onPointerUp={(e) => handlePointerUp(e, index)}
            onPointerCancel={(e) => handlePointerCancel(e, index)}
            style={{ 
              display: 'flex', 
              transition: dragState.isDragging && index !== dragState.idx ? 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'none', 
              transform: getTransform(index),
              zIndex: getZIndex(index),
              cursor: dragState.isDragging && index === dragState.idx ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              position: 'relative',
              touchAction: dragState.isDragging ? 'none' : 'pan-y'
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
