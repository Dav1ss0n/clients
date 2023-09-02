import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import QGuid from './QGuid';


// Main Component just checks 'localStorage' for wether app is opened for_the_first_time
// and shows QuickGuid component if true:
function Main() {
  // 'state == true' means the firstStart 
  const [state, setState] = useState();
  
  // GETTER of localStorage (also registerer, SETTER)
  useEffect( () => {
    const ls = localStorage.getItem('firstStart');
    
    if (ls === 'true') {
      setState(true);
    } else if (ls === 'undefined' || ls === null) {
      setState(true);
      localStorage.setItem('firstStart', true);
    } else if (ls === 'false') {
      setState(false);
    }
  }, []);
  

  // HANDLER of Let's Start button in the QGuid component
  function handleClick() {
    setState(false);
    localStorage.setItem('firstStart', false);
  }

  // Conditional rendering using Ternar operator:
  return (
    <>
      {state ? <QGuid onClick={handleClick}/> : <App />}
    </>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// React.StrictMode must be removed on production, as it is developer use only, causing Components re-render twice to emphasize problems.