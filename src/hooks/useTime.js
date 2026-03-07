import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

export function useTime(timezone = 'local', offsetMinutes = 0) {
  const [time, setTime] = useState(() => {
    const base = timezone === 'local' ? DateTime.now() : DateTime.now().setZone(timezone);
    return base.plus({ minutes: offsetMinutes });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const base = timezone === 'local' ? DateTime.now() : DateTime.now().setZone(timezone);
      setTime(base.plus({ minutes: offsetMinutes }));
    }, 1000);

    return () => clearInterval(timer);
  }, [timezone, offsetMinutes]);

  return time;
}
