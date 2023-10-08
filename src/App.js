import logo from './baby_carrot_logo.png';
import './App.css';
import FoodDataAPI from './FoodDataAPI';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="Baby-Carrot-logo" alt="logo" />
        <p>
          EcoBite
        </p>
      </header>
      <FoodDataAPI />
    </div>
  );
}

export default App;
