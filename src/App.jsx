import { useRef, useEffect } from 'react';
import './App.css';
import NateHub from './three/NateHub';

function App() {
  const canvasRef = useRef();
  const natehubRef = useRef();

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (canvas && !natehubRef.current) {
      natehubRef.current = new NateHub(canvas);
      natehubRef.current.setup();
    }
  }, []);

  return (
    <div className="App">
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
