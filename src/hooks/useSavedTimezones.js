import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

const STORAGE_KEY = 'world_clock_zones_v3';

export function useSavedTimezones() {
  const localZone = DateTime.local().zoneName;
  const defaultZones = [
    { id: 'local_zone_active', zone: localZone, name: 'Local Time' },
    { id: 'new_york_usa', zone: 'America/New_York', name: 'New York, USA' },
    { id: 'paris_france', zone: 'Europe/Paris', name: 'Paris, France' },
    { id: 'tokyo_japan', zone: 'Asia/Tokyo', name: 'Tokyo, Japan' }
  ];

  const [savedZones, setSavedZones] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultZones;
    } catch {
      return defaultZones;
    }
  });

  const [activeZoneId, setActiveZoneId] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_active');
      return stored || defaultZones[0].id;
    } catch {
      return defaultZones[0].id;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedZones));
  }, [savedZones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_active', activeZoneId);
  }, [activeZoneId]);

  const addZone = (cityObj) => {
    // Only verify ID to allow multiple instances of the same timezone (like two same cities or cities in same timezone)
    if (!savedZones.find(z => z.id === cityObj.id)) {
      setSavedZones(prev => [...prev, cityObj]);
    }
  };

  const removeZone = (id) => {
    setSavedZones(prev => prev.filter(z => z.id !== id));
    if (activeZoneId === id && savedZones.length > 1) {
      setActiveZoneId(savedZones[0].id === id ? savedZones[1].id : savedZones[0].id);
    }
  };

  const reorderZone = (sourceIndex, destinationIndex) => {
    setSavedZones(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  };
  
  const activeZoneInfo = savedZones.find(z => z.id === activeZoneId) || savedZones[0];

  return { savedZones, activeZoneId, setActiveZoneId, activeZoneInfo, addZone, removeZone, reorderZone };
}
