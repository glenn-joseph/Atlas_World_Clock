import React, { useState, useRef, useEffect, useCallback } from 'react';
import CityCard from './CityCard';
import { Plus } from 'lucide-react';

function useIsVerticalLayout() {
  const [isVertical, setIsVertical] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsVertical(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isVertical;
}

export default function CityCardList({ savedZones, activeZoneId, onSelectZone, offsetMinutes = 0, onAddCity, use24HourTime, onRemoveZone, onReorderZone }) {
  const isVertical = useIsVerticalLayout();

  const [dragState, setDragState] = useState({
    isDragging: false,
    idx: null,
    hoverIdx: null,
    dragOffset: 0,
    itemSize: 0
  });

  // Use a ref to track dragging state for native event listeners (they can't read React state)
  const isDraggingRef = useRef(false);
  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const itemRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  // Keep the ref in sync with state
  useEffect(() => {
    isDraggingRef.current = dragState.isDragging;
  }, [dragState.isDragging]);

  // Attach a native touchmove listener with { passive: false } to prevent page scroll during drag
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const preventScroll = (e) => {
      if (isDraggingRef.current) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', preventScroll, { passive: false });
    return () => container.removeEventListener('touchmove', preventScroll);
  }, []);

  // Lock body scroll while dragging
  useEffect(() => {
    if (dragState.isDragging) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [dragState.isDragging]);

  const handlePointerDown = (e, index) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    
    e.currentTarget.setPointerCapture(e.pointerId);

    const holdDuration = e.pointerType === 'mouse' ? 0 : 300;

    timerRef.current = setTimeout(() => {
      const rect = itemRefs.current[index]?.getBoundingClientRect();
      let gap = 16;
      if (itemRefs.current[0] && itemRefs.current[1]) {
        const rect0 = itemRefs.current[0].getBoundingClientRect();
        const rect1 = itemRefs.current[1].getBoundingClientRect();
        if (isVertical) {
          gap = rect1.top - rect0.bottom;
        } else {
          gap = rect1.left - rect0.right;
        }
      }
      
      const size = isVertical
        ? (rect?.height || 100) + Math.max(0, gap)
        : (rect?.width || 220) + Math.max(0, gap);

      setDragState({
        isDragging: true,
        idx: index,
        hoverIdx: index,
        dragOffset: 0,
        itemSize: size
      });
      
      if (navigator.vibrate) navigator.vibrate(50);
    }, holdDuration);
  };

  const handlePointerMove = (e, index) => {
    if (!dragState.isDragging) {
      if (Math.abs(e.clientX - startXRef.current) > 10 || Math.abs(e.clientY - startYRef.current) > 10) {
        clearTimeout(timerRef.current);
      }
      return;
    }
    
    const delta = isVertical
      ? e.clientY - startYRef.current
      : e.clientX - startXRef.current;
    
    const offsetIndex = Math.round(delta / dragState.itemSize);
    let newHoverIdx = dragState.idx + offsetIndex;
    newHoverIdx = Math.max(0, Math.min(newHoverIdx, savedZones.length - 1));
    
    setDragState(prev => ({
      ...prev,
      dragOffset: delta,
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
      setDragState({ isDragging: false, idx: null, hoverIdx: null, dragOffset: 0, itemSize: 0 });
    }
  };

  const handlePointerCancel = (e, index) => {
    clearTimeout(timerRef.current);
    if (dragState.isDragging) {
      setDragState({ isDragging: false, idx: null, hoverIdx: null, dragOffset: 0, itemSize: 0 });
    }
  };

  const getTransform = (index) => {
    if (!dragState.isDragging) return 'none';
    
    const axis = isVertical ? 'Y' : 'X';
    
    if (index === dragState.idx) {
      return `translate${axis}(${dragState.dragOffset}px)`;
    }
    
    const { idx, hoverIdx, itemSize } = dragState;
    if (idx < hoverIdx && index > idx && index <= hoverIdx) {
      return `translate${axis}(-${itemSize}px)`;
    }
    if (idx > hoverIdx && index >= hoverIdx && index < idx) {
      return `translate${axis}(${itemSize}px)`;
    }
    
    return 'none';
  };

  const getZIndex = (index) => (dragState.isDragging && index === dragState.idx ? 10 : 1);

  return (
    <div className="city-list-container">
      <div className="add-city-top">
        <button onClick={onAddCity}>
          Add Another City <Plus size={16} />
        </button>
      </div>
      
      <div className="city-card-scroll" ref={scrollContainerRef}>
        {savedZones.map((cityObj, index) => (
          <div
            key={cityObj.id}
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
              touchAction: 'none'
            }}
          >
            <CityCard 
              cityObj={cityObj} 
              isActive={cityObj.id === activeZoneId} 
              onClick={() => onSelectZone(cityObj.id)} 
              offsetMinutes={offsetMinutes}
              use24HourTime={use24HourTime}
              onRemove={() => onRemoveZone && onRemoveZone(cityObj.id)}
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
