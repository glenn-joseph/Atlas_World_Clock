import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';
import { formatOffsetMinutes } from '../utils/formatters';

export default function ScheduleBar({ offsetMinutes, setOffsetMinutes }) {
  const isLive = offsetMinutes === 0;

  return (
    <div className="schedule-bar-container">
      <div className="schedule-bar-left">
        <Calendar size={18} />
        <span>Atlas</span>
      </div>
      
      <div className="schedule-bar-slider-container">
        <div className="schedule-current-label">
          Current
        </div>

        <div className="schedule-slider-wrap">
          <div className="schedule-slider-notch" />
          <input 
            type="range" 
            min="-1440" 
            max="1440"  
            step="15"   
            value={offsetMinutes} 
            onChange={(e) => setOffsetMinutes(parseInt(e.target.value))}
            style={{ width: '100%', position: 'relative', zIndex: 1, cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className="schedule-bar-right">
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {!isLive && formatOffsetMinutes(offsetMinutes)}
        </span>
        {!isLive && (
          <button 
            onClick={() => setOffsetMinutes(0)}
            className="schedule-reset-btn"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
