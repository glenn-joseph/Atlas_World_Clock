import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

const STORAGE_KEY = 'world_clock_zones_v4';

const CITY_NAMES = {
  'America/Chicago': 'Chicago, USA',
  'America/New_York': 'New York, USA',
  'America/Los_Angeles': 'Los Angeles, USA',
  'Europe/London': 'London, UK',
  'Europe/Paris': 'Paris, France',
  'Asia/Tokyo': 'Tokyo, Japan',
  'Asia/Kolkata': 'New Delhi, India',
  'Asia/Singapore': 'Singapore, Singapore',
  'Asia/Hong_Kong': 'Hong Kong, China',
  'Asia/Dubai': 'Dubai, UAE',
  'Australia/Sydney': 'Sydney, Australia',
  'Europe/Berlin': 'Berlin, Germany',
  'Asia/Shanghai': 'Shanghai, China',
  'America/Toronto': 'Toronto, Canada',
  'Asia/Bangkok': 'Bangkok, Thailand',
  'Asia/Seoul': 'Seoul, South Korea',
  'Europe/Rome': 'Rome, Italy',
  'Europe/Madrid': 'Madrid, Spain',
  'America/Mexico_City': 'Mexico City, Mexico',
  'Europe/Moscow': 'Moscow, Russia',
  'Europe/Istanbul': 'Istanbul, Turkey',
  'Europe/Amsterdam': 'Amsterdam, Netherlands',
  'America/Sao_Paulo': 'Sao Paulo, Brazil'
};

function getLocalCityName(zone) {
  if (CITY_NAMES[zone]) return CITY_NAMES[zone];
  const city = zone.split('/')[1]?.replace(/_/g, ' ') || zone;
  return city;
}

export function useSavedTimezones() {
  const localZone = DateTime.local().zoneName;
  const localName = getLocalCityName(localZone);
  const defaultZones = [
    { id: 'local_zone_active', zone: localZone, name: localName },
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
