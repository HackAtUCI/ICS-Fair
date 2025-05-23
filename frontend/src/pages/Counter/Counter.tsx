import "./Counter.css";

interface CounterProps {
  bags: number;
  setBags: (bags: number) => void;
}

export default function Counter({ bags, setBags }: CounterProps) {
  const increment = () => setBags(bags + 1);

  const decrement = () => {
    if (bags > 0) setBags(bags - 1);
  };

  const reset = () => setBags(0);

  return (
    <div className="counter-container">
      <div className="counter-wrapper">
        <img
          src="/cowboyanteater.png"
          alt="cowboy anteater image"
          className="counter-image"
        ></img>
        <div className="counter-card">
          <div className="bag-count">
            <h1>{bags}</h1>
            <p>Number of Bags</p>
          </div>
        </div>
      </div>
      <div className="counter-controls">
        <div className="counter-increments">
          <button onClick={decrement} className="counter-button">
            <img
              src="/decrement.svg"
              alt="decrement"
              width="37"
              height="6"
            ></img>
          </button>
          <button onClick={increment} className="counter-button">
            <img
              src="/increment.svg"
              alt="decrement"
              width="34"
              height="34"
            ></img>
          </button>
        </div>
        <button onClick={reset} className="reset-button">
          RESET
        </button>
      </div>
    </div>
  );
}
