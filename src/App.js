import { useState } from 'react';
import './App.css';

function App() {
  const [size, setSize] = useState(13);
  const [color, setColor] = useState("Black");
  const [hiddenMoves, setHiddenMoves] = useState([]);

  const unitSize = 1000 / (size + 1);

  const starPoints = (() => {
    if (size === 9) {
      return [[3, 3], [3, 7], [5, 5], [7, 3], [7, 7]];
    } else if (size === 13) {
      return [[4, 4], [4, 10], [7, 7], [10, 4], [10, 10]];
    } else if (size === 19) {
      return [[4, 4], [4, 10], [4, 16], [10, 4], [10, 10], [10, 16], [16, 4], [16, 10], [16, 16]];
    } else {
      return [];
    }
  })();

  const updateSize = (event) => {
    setHiddenMoves([]);
    setSize(parseInt(event.target.value));
  }

  const updateColor = (event) => {
    setColor(event.target.value);
  }

  const isHiddenMove = (x, y) => {
    return hiddenMoves.some(move => move[0] === x && move[1] === y);
  }

  const generateHiddenMove = () => {
    if (hiddenMoves.length >= size * size) {
      return;
    }
    while (true) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!isHiddenMove(x, y)) {
        setHiddenMoves([...hiddenMoves, [x, y]]);
        break;
      }
    }
  };

  const addHiddenMove = (x, y) => {
    if (!isHiddenMove(x, y)) {
      setHiddenMoves([...hiddenMoves, [x, y]]);
    }
  };

  const removeHiddenMove = (x, y) => {
    setHiddenMoves(hiddenMoves.filter(move => move[0] !== x || move[1] !== y));
  };

  const reset = () => {
    setHiddenMoves([]);
  };

  return (
    <div className="App">
      <h1>Hidden Move Go</h1>
      <div className="configuration">
        <div>
          <div className="configuration-section">
            <label htmlFor="configuration-board-size">Board Size: </label>
            <select id="configuration-board-size" value={size} onChange={updateSize}>
              <option value={9}>9x9</option>
              <option value={13}>13x13</option>
              <option value={19}>19x19</option>
            </select>
            <label htmlFor="configuration-color">Color: </label>
            <select id="configuration-color" value={color} onChange={updateColor}>
              <option value="Black">Black</option>
              <option value="White">White</option>
            </select>
          </div>
          <div className="configuration-section">
            <button onClick={generateHiddenMove}>Generate Random Stone</button>
            <button onClick={reset}>Reset</button>
          </div>

          <div>
            <svg id="board-svg" pointerEvents="bounding-box" viewBox="0 0 1000 1000">

              <rect
                x={0}
                y={0}
                width={unitSize * (size + 1)}
                height={unitSize * (size + 1)}
                fill="#e8b068"
                rx="30"
              />

              {
                // Vertical lines
                [...Array(size).keys()].map(colIndex => {
                  return <line
                    key={colIndex}
                    className="board-grid-line"
                    stroke="black"
                    strokeWidth="2"
                    x1={unitSize * (colIndex + 1)}
                    y1={unitSize}
                    x2={unitSize * (colIndex + 1)}
                    y2={unitSize * size}
                  />;
                })
              }

              {
                // Horizontal lines
                [...Array(size).keys()].map(rowIndex => {
                  return <line
                    key={rowIndex}
                    className="board-grid-line"
                    stroke="black"
                    strokeWidth="2"
                    x1={unitSize}
                    y1={unitSize * (rowIndex + 1)}
                    x2={unitSize * size}
                    y2={unitSize * (rowIndex + 1)}
                  />;
                })
              }

              {
                // Star points
                starPoints.map((point, i) => {
                  const [x, y] = point;
                  return <circle
                    key={i}
                    cx={x * unitSize}
                    cy={y * unitSize}
                    r={unitSize * 0.1}
                    fill={'black'}
                  />;
                })
              }

              {
                // Clickable regions to add hidden moves
                [...Array(size).keys()].map((x) => {
                  return [...Array(size).keys()].map((y) => {
                    return <circle
                      key={`${x} ${y}`}
                      onClick={() => addHiddenMove(x, y)}
                      cx={(x + 1) * unitSize}
                      cy={(y + 1) * unitSize}
                      r={unitSize * 0.48}
                      fill="transparent"
                    />;
                  });

                })
              }

              {
                // Hidden moves
                hiddenMoves.map((move, i) => {
                  const [x, y] = move;
                  return <circle
                    key={i}
                    onClick={() => removeHiddenMove(x, y)}
                    cx={(x + 1) * unitSize}
                    cy={(y + 1) * unitSize}
                    r={unitSize * 0.48}
                    fill={color === 'Black' ? 'black' : 'white'}
                  />;
                })
              }

            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
