import React, { useState } from 'react';
import { useSavedTimezones } from './hooks/useSavedTimezones';
import MainClock from './components/MainClock';
import CityCardList from './components/CityCardList';
import ScheduleBar from './components/ScheduleBar';
import AddCityModal from './components/AddCityModal';

function App() {
  const { savedZones, activeZone, setActiveZone, addZone, removeZone, reorderZone } = useSavedTimezones();
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [use24HourTime, setUse24HourTime] = useState(false);
  
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <ScheduleBar offsetMinutes={offsetMinutes} setOffsetMinutes={setOffsetMinutes} />
      <MainClock 
        activeZone={activeZone} 
        offsetMinutes={offsetMinutes} 
        setOffsetMinutes={setOffsetMinutes}
        use24HourTime={use24HourTime}
        onToggle24Hour={() => setUse24HourTime(!use24HourTime)}
      />
      <CityCardList 
        savedZones={savedZones} 
        activeZone={activeZone} 
        onSelectZone={setActiveZone} 
        offsetMinutes={offsetMinutes}
        use24HourTime={use24HourTime}
        onAddCity={() => setIsModalOpen(true)}
        onRemoveZone={removeZone}
        onReorderZone={reorderZone}
      />
      {isModalOpen && (
        <AddCityModal onClose={() => setIsModalOpen(false)} onAdd={addZone} />
      )}
    </div>
  );
}

export default App;
