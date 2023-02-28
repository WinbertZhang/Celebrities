import './App.css';
import React, { useState } from 'react';
import HomePage from './pages/HomePage.js';
import SelectionPage from './pages/SelectionPage.js';
import GuessingPage from './pages/GuessingPage.js';
import Lobby from './pages/LobbyPage.js'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function handleButtonClick(page) {
    console.log('button clicked');
    console.log(page);
    setCurrentPage(page);
  }

  if (currentPage === 'home') {
    return(
      <div>
        {currentPage === 'home' && <HomePage handleButtonClick={handleButtonClick} />}
      </div>
    )
  }
  else if (currentPage === 'lobby') {
    return(
      <div>
        {currentPage === 'lobby' && <Lobby handleButtonClick={handleButtonClick} />}
      </div>
    )
  }
  else if (currentPage === 'selection') {
    return(
      <div>
        {currentPage === 'selection' && <SelectionPage handleButtonClick={handleButtonClick} />}
      </div>
    )
  }
  else if (currentPage === 'guess') {
    return(
      <div>
        {currentPage === 'guess' && <GuessingPage handleButtonClick={handleButtonClick} />}
      </div>
    )
  }

}
export default App;