import React, { useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [slots, setSlots] = useState(Array(10).fill({ occupied: false, token: null }));
  const [token, setToken] = useState('');
  const [inputToken, setInputToken] = useState('');

  const parkCar = () => {
    const availableIndex = slots.findIndex(slot => !slot.occupied);
    if (availableIndex !== -1) {
      const newToken = uuidv4().slice(0, 8); // short token
      const updatedSlots = [...slots];
      updatedSlots[availableIndex] = {
        occupied: true,
        token: newToken,
      };
      setSlots(updatedSlots);
      setToken(newToken);
    } else {
      alert("No available slots!");
    }
  };

  const unparkCar = () => {
    const updatedSlots = slots.map(slot =>
      slot.token === inputToken
        ? { occupied: false, token: null }
        : slot
    );
    setSlots(updatedSlots);
    setInputToken('');
  };

  return (
    <div className="app">
      <h1 className="title">Automated Car Parking System</h1>
      <div className="slots-title">Slots</div>

      <div className="slots-container">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`slot ${slot.occupied ? 'occupied' : ''}`}
          >
            {slot.occupied ? slot.token : `Slot ${index + 1}`}
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="button" onClick={parkCar}>Park Car</button>
        <input
          type="text"
          placeholder="Enter token"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
        />
        <button className="button" onClick={unparkCar}>Unpark Car</button>
      </div>
    </div>
  );
}

export default App;
