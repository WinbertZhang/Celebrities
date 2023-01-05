import './App.css';
import React, {Component} from 'react';
import HomePage from './pages/HomePage.js';
import SelectionPage from './pages/SelectionPage.js';
import GuessingPage from './pages/GuessingPage.js';

class App extends Component {
  state = {
    gameState: 0,
  };

  render() {
    if(this.state.gameState === 0){
      return (
        <div className='bg-dark-purple'>
          <HomePage />
        </div>
      );
    }
    else if(this.state.gameState  === 1){
      return(
        <div>
          <SelectionPage />
        </div>
      );
    }
    else{
      return(
        <div>
          <GuessingPage />
        </div>
      );
    }
  }
}
export default App;