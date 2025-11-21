import './App.css';
import ProfileCard from './ProfileCard';
import as from './as.png';
function App() {
  return (
    <div className="App">
      <ProfileCard
        name="Archit Srivastava"
        bio="Full-stack Developer. Proficient in React and Node.js."
        email="architexample@gmail.com"
        imageUrl={as}
      />
    </div>);
}

export default App;
