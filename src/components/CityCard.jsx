import React, { useState } from 'react';
import { useTime } from '../hooks/useTime';
import { DateTime } from 'luxon';
import { Sun, Moon, X } from 'lucide-react';
import { formatTimezoneOffset, getCityDisplayName } from '../utils/formatters';

export default function CityCard({ zone, isActive, onClick, onRemove, offsetMinutes = 0, use24HourTime }) {
  const time = useTime(zone, offsetMinutes);
  const cityName = getCityDisplayName(zone);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate offset from UTC
  const offset = time.offset / 60;
  const isDay = time.hour >= 6 && time.hour < 18;

  // Determine styles based on active state
  const bg = isActive ? 'var(--surface-dark)' : 'var(--surface-light)';
  const color = isActive ? 'var(--text-inverse)' : 'var(--text-main)';
  const secondaryColor = isActive ? 'var(--text-inverse-secondary)' : 'var(--text-secondary)';

  return (
    <div className="city-card-item"
      onClick={() => onClick(zone)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: bg, color: color,
        cursor: 'pointer',
        border: isActive ? '1px solid transparent' : '1px solid rgba(0,0,0,0.05)',
        boxShadow: isActive ? 'var(--shadow-md)' : 'none',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: '500', fontSize: '1.1rem', paddingRight: '0.5rem' }}>{cityName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ color: secondaryColor, fontSize: '0.9rem' }}>{formatTimezoneOffset(offset)}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
            style={{
              background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
              border: 'none', borderRadius: '50%',
              width: '24px', height: '24px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'inherit',
              transition: 'var(--transition-fast)',
              opacity: (isHovered || isActive) && onRemove ? 1 : 0,
              pointerEvents: (isHovered || isActive) && onRemove ? 'auto' : 'none',
              marginTop: '-4px', marginRight: '-8px'
            }}
            onMouseEnter={(e) => e.target.style.background = isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          >
            <X size={14} style={{ pointerEvents: 'none' }} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
          <div className="city-card-item-time">
            {time.toFormat(use24HourTime ? 'HH:mm' : 'hh:mm')}
          </div>
          {!use24HourTime && (
            <span style={{ fontSize: '1.2rem', color: secondaryColor, paddingBottom: '0.4rem' }}>
              {time.toFormat('a')}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingBottom: '0.5rem' }}>
          {isDay ? (
            <Sun size={20} color="var(--accent-yellow)" fill="var(--accent-yellow)" />
          ) : (
            <Moon size={20} color="var(--accent-yellow)" fill="var(--accent-yellow)" />
          )}
          <span style={{ fontSize: '0.9rem', color: secondaryColor }}>{isDay ? 'Day' : 'Night'}</span>
        </div>
      </div>
    </div>
  );
}
