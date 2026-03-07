import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

const STORAGE_KEY = 'world_clock_zones_v2';

export function useSavedTimezones() {
  const localZone = DateTime.local().zoneName;
  const defaultZones = Array.from(new Set([localZone, 'America/New_York', 'Europe/Paris', 'Asia/Tokyo']));

  const [savedZones, setSavedZones] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultZones;
    } catch {
      return defaultZones;
    }
  });

  const [activeZone, setActiveZone] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_active');
      return stored || localZone;
    } catch {
      return localZone;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedZones));
  }, [savedZones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_active', activeZone);
  }, [activeZone]);

  const addZone = (zone) => {
    if (!savedZones.includes(zone)) {
      setSavedZones(prev => [...prev, zone]);
    }
  };

  const removeZone = (zone) => {
    setSavedZones(prev => prev.filter(z => z !== zone));
    if (activeZone === zone && savedZones.length > 1) {
      setActiveZone(savedZones[0] === zone ? savedZones[1] : savedZones[0]);
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

  return { savedZones, activeZone, setActiveZone, addZone, removeZone, reorderZone };
}
