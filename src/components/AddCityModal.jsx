import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

const COMMON_CITIES = [
  { name: 'London, UK', zone: 'Europe/London' },
  { name: 'New York, USA', zone: 'America/New_York' },
  { name: 'Tokyo, Japan', zone: 'Asia/Tokyo' },
  { name: 'Paris, France', zone: 'Europe/Paris' },
  { name: 'Singapore, Singapore', zone: 'Asia/Singapore' },
  { name: 'Hong Kong, China', zone: 'Asia/Hong_Kong' },
  { name: 'Los Angeles, USA', zone: 'America/Los_Angeles' },
  { name: 'Dubai, UAE', zone: 'Asia/Dubai' },
  { name: 'Mumbai, India', zone: 'Asia/Kolkata' },
  { name: 'Sydney, Australia', zone: 'Australia/Sydney' },
  { name: 'Berlin, Germany', zone: 'Europe/Berlin' },
  { name: 'Shanghai, China', zone: 'Asia/Shanghai' },
  { name: 'San Francisco, USA', zone: 'America/Los_Angeles' },
  { name: 'Toronto, Canada', zone: 'America/Toronto' },
  { name: 'Bangkok, Thailand', zone: 'Asia/Bangkok' },
  { name: 'Seoul, South Korea', zone: 'Asia/Seoul' },
  { name: 'Rome, Italy', zone: 'Europe/Rome' },
  { name: 'Madrid, Spain', zone: 'Europe/Madrid' },
  { name: 'Mexico City, Mexico', zone: 'America/Mexico_City' },
  { name: 'Moscow, Russia', zone: 'Europe/Moscow' },
  { name: 'New Delhi, India', zone: 'Asia/Kolkata' },
  { name: 'Istanbul, Turkey', zone: 'Europe/Istanbul' },
  { name: 'Amsterdam, Netherlands', zone: 'Europe/Amsterdam' },
  { name: 'Chicago, USA', zone: 'America/Chicago' },
  { name: 'Sao Paulo, Brazil', zone: 'America/Sao_Paulo' }
];

export default function AddCityModal({ onClose, onAdd }) {
  const [query, setQuery] = useState('');

  // A very simple search that checks against our mock list of common cities for now
  // Real apps would use a full IANA timezone database or an API
  const filtered = COMMON_CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, color: 'var(--text-main)'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: 'var(--bg-color)', width: '90%', maxWidth: '400px',
        borderRadius: 'var(--radius-xl)', padding: '2rem',
        boxShadow: 'var(--shadow-md)', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} color="var(--text-secondary)" />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>Add a City</h2>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.8rem',
          backgroundColor: 'var(--surface-light)', borderRadius: '12px',
          padding: '0.8rem 1rem', marginBottom: '1.5rem'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search city like 'Tokyo'"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ 
              background: 'transparent', border: 'none', flex: 1, 
              fontSize: '1rem', outline: 'none', color: 'var(--text-main)' 
            }}
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
          {filtered.map(city => (
            <button 
              key={city.zone}
              onClick={() => { onAdd(city.zone); onClose(); }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem', background: 'none', border: 'none',
                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-light)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontWeight: '500', fontSize: '1.05rem' }}>{city.name}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{city.zone}</span>
            </button>
          ))}
          {filtered.length === 0 && (
             <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No cities found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
