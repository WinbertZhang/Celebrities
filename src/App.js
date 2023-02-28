import './App.css';
import React, { useState } from 'react';
import HomePage from './pages/HomePage.js';
import SelectionPage from './pages/SelectionPage.js';
import GuessingPage from './pages/GuessingPage.js';
import Lobby from './pages/LobbyPage.js'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function handlePageChangeClick(page) {
    setCurrentPage(page);
  }

  if (currentPage === 'home') {
    return(
      <div>
        {currentPage === 'home' && <HomePage handlePageChangeClick={handlePageChangeClick}/>}
      </div>
    )
  }
  else if (currentPage === 'lobby') {
    return(
      <div>
        {currentPage === 'lobby' && <Lobby handlePageChangeClick={handlePageChangeClick} />}
      </div>
    )
  }
  else if (currentPage === 'selection') {
    return(
      <div>
        {currentPage === 'selection' && <SelectionPage handlePageChangeClick={handlePageChangeClick} />}
      </div>
    )
  }
  else if (currentPage === 'guess') {
    return(
      <div>
        {currentPage === 'guess' && <GuessingPage handlePageChangeClick={handlePageChangeClick} />}
      </div>
    )
  }

}
export default App;