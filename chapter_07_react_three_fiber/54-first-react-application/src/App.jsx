import { useMemo, useState } from "react";
import Clicker from "./Clicker.jsx";

export default function App({ clickersCount, children }) {
  const [hasClicker, setHasClicker] = useState(true);
  const [count, setCount] = useState(0);

  const toggleClickerClick = () => {
    setHasClicker(!hasClicker);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const colors = useMemo(() => {
    const colors = [];

    for (let i = 0; i < clickersCount; i++) {
      colors.push(`hsl(${Math.random() * 360}deg, 100%, 70%)`);
    }

    return colors;
  }, [clickersCount]);

  // const tempArray = [...Array(clickersCount)];

  // tempArray.map((value, index) => {
  //   console.log(value);
  // });

  return (
    <>
      {children}
      <div>Total count: {count}</div>
      <button onClick={toggleClickerClick}>
        {hasClicker ? "Hide" : "Show"} Clicker
      </button>
      {/* {hasClicker ? <Clicker /> : null} */}
      {hasClicker && (
        <>
          {[...Array(clickersCount)].map((value, index) => {
            return (
              <Clicker
                key={index}
                increment={increment}
                keyName={`count ${index}`}
                // color={`hsl(${Math.random() * 360}deg, 100%, 70%)`}
                color={colors[index]}
              />
            );
          })}
          {/* <Clicker
            increment={increment}
            keyName="countA"
            color={`hsl(${Math.random() * 360}deg, 100%, 70%)`}
          />
          <Clicker
            increment={increment}
            keyName="countB"
            color={`hsl(${Math.random() * 360}deg, 100%, 70%)`}
          />
          <Clicker
            increment={increment}
            keyName="countC"
            color={`hsl(${Math.random() * 360}deg, 100%, 70%)`}
          /> */}
        </>
      )}
    </>
  );
}
