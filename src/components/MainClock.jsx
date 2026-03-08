import React, { useState, useRef, useEffect } from 'react';
import { useTime } from '../hooks/useTime';
import { getSunriseSunsetData, formatOffsetMinutes, getCityDisplayName } from '../utils/formatters';
import { Sun } from 'lucide-react';
import { DateTime } from 'luxon';

const EditableTimeSpan = ({ value, unit, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => { setVal(value) }, [value]);

  const commit = () => {
    setIsEditing(false);
    if (val !== value) {
      onChange(unit, val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') {
      setVal(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--accent-orange)',
          width: '2ch',
          textAlign: 'center',
          font: 'inherit',
          padding: 0,
          margin: 0,
          lineHeight: 1,
          display: 'inline-block',
          verticalAlign: 'baseline',
          height: '1em'
        }}
      />
    );
  }

  return (
    <span 
      tabIndex={0}
      onClick={() => setIsEditing(true)} 
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      style={{ 
        cursor: 'text', 
        transition: 'color 0.2s', 
        touchAction: 'manipulation',
        display: 'inline-block',
        lineHeight: 1,
        verticalAlign: 'baseline',
        height: '1em'
      }}
      onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
      onMouseLeave={(e) => e.target.style.color = 'inherit'}
    >
      {value}
    </span>
  );
};

export default function MainClock({ activeZoneInfo, offsetMinutes = 0, setOffsetMinutes, use24HourTime, onToggle24Hour }) {
  const time = useTime(activeZoneInfo.zone, offsetMinutes);
  const details = getSunriseSunsetData(activeZoneInfo.zone);
  const cityInfo = activeZoneInfo.name;

  const hours = time.toFormat(use24HourTime ? 'HH' : 'hh');
  const ampm = !use24HourTime ? time.toFormat('a') : '';

  const handleTimeChange = (unit, newValue) => {
    const base = activeZoneInfo.zone === 'local' ? DateTime.now() : DateTime.now().setZone(activeZoneInfo.zone);
    let newTime = time;
    let val = parseInt(newValue, 10);
    if (isNaN(val)) return;

    if (unit === 'hours') {
      if (!use24HourTime) {
        if (val === 12) val = 0;
        if (time.hour >= 12) val += 12;
      }
      newTime = time.set({ hour: val });
    } else if (unit === 'minutes') {
      newTime = time.set({ minute: val });
    }

    const diffMinutes = Math.round(newTime.diff(base, 'minutes').minutes);
    if (setOffsetMinutes) setOffsetMinutes(diffMinutes);
  };

  const handleAmPmToggle = () => {
    const base = activeZoneInfo.zone === 'local' ? DateTime.now() : DateTime.now().setZone(activeZoneInfo.zone);
    let newTime;
    if (time.hour >= 12) {
      newTime = time.minus({ hours: 12 });
    } else {
      newTime = time.plus({ hours: 12 });
    }
    const diffMinutes = Math.round(newTime.diff(base, 'minutes').minutes);
    if (setOffsetMinutes) setOffsetMinutes(diffMinutes);
  };

  return (
    <div className="mc-container">
      
      {/* 2. Time Container */}
      <div className="mc-time">
        <div className="mc-time-text">
          <EditableTimeSpan value={hours} unit="hours" onChange={handleTimeChange} />
          <span className="animate-blink" style={{ margin: '0 0.5rem', fontWeight: '400' }}>:</span>
          <EditableTimeSpan value={time.toFormat('mm')} unit="minutes" onChange={handleTimeChange} />
          <span className="animate-blink" style={{ margin: '0 0.5rem', fontWeight: '400' }}>:</span>
          <span>{time.toFormat('ss')}</span>
        </div>
        {!use24HourTime && (
           <span className="am-pm" 
                 tabIndex={0}
                 onClick={handleAmPmToggle}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault();
                     handleAmPmToggle();
                   }
                 }}
                 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginLeft: '1rem', color: 'var(--text-secondary)', fontWeight: '400', cursor: 'pointer', transition: 'color 0.2s' }}
                 onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'}
                 onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
             {ampm}
           </span>
        )}
      </div>

      {/* 4. Offset Container */}
      <div className="mc-offset">
        <div style={{ color: offsetMinutes === 0 ? 'var(--text-secondary)' : 'var(--accent-orange)', fontSize: '0.9rem', fontWeight: offsetMinutes === 0 ? '400' : '600' }}>
          {formatOffsetMinutes(offsetMinutes)}
        </div>
      </div>
      
      {/* 3. Date & Sun Container */}
      <div className="mc-datesun">
        <span className="mc-date">
          {time.toFormat('cccc, LLL dd yyyy')}
        </span>
        <Sun size={14} color="var(--accent-yellow)" style={{ margin: '0 0.2rem' }} />
      </div>

      {/* 5. Togglers Container */}
      <div className="mc-togglers">
        <div style={{ display: 'flex', background: 'var(--surface-light)', borderRadius: '40px', padding: '0.3rem' }}>
          <button 
            onClick={use24HourTime ? onToggle24Hour : undefined}
            style={{ 
              background: !use24HourTime ? 'var(--text-main)' : 'transparent', 
              border: 'none', padding: '0.4rem 1rem', borderRadius: '40px',
              color: !use24HourTime ? 'var(--text-inverse)' : 'var(--text-secondary)', 
              fontWeight: '500', cursor: 'pointer', transition: 'var(--transition-fast)'
            }}>12h</button>
          <button 
            onClick={!use24HourTime ? onToggle24Hour : undefined}
            style={{ 
              background: use24HourTime ? 'var(--text-main)' : 'transparent', 
              border: 'none', padding: '0.4rem 1rem', borderRadius: '40px',
              color: use24HourTime ? 'var(--text-inverse)' : 'var(--text-secondary)', 
              fontWeight: '500', cursor: 'pointer', transition: 'var(--transition-fast)'
            }}>24h</button>
        </div>
      </div>

      {/* 6. HR */}
      <hr className="mc-hr" />

      {/* 1. Title Container */}
      <div className="mc-title">
        <h1>{cityInfo}, <br/>{activeZoneInfo.zone.split('/')[0]}</h1>
      </div>
    </div>
  );
}
