import { useRef, useEffect, useState } from 'react';
import './App.css';
import NateHub from './three/NateHub';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Nav from './components/Nav';

function App() {
  const canvasRef = useRef();
  const natehubRef = useRef();
  const [navCollapsed, setNavCollapsed] = useState(true);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (canvas && !natehubRef.current) {
      natehubRef.current = new NateHub(canvas);
      natehubRef.current.setup();
    }
  }, []);

  function navToggle() {
    setNavCollapsed(!navCollapsed);
  }

  return (
    <div className="App">
      <Nav collapsed={navCollapsed} toggle={navToggle} />
      <canvas className="webgl" ref={canvasRef}/>
      <div className="loading">
        <div className="loading__progress">
          <div className="loading__progress-bar"></div>
          <div className="loading__message">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
