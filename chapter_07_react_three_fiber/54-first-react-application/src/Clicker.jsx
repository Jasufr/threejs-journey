import { useEffect, useState } from "react";

export default function Clicker({ increment, keyName, color }) {
  console.log("render");

  const [count, setCount] = useState(
    parseInt(localStorage.getItem(keyName) ?? 0)
  );

  useEffect(() => {
    console.log("first render");

    return () => {
      console.log("component disposed");
      localStorage.removeItem(keyName);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(keyName, count);
  }, [count]);

  const buttonClick = () => {
    // setCount((value) => value + 1);
    setCount(count + 1);
    increment();
  };

  return (
    <div>
      <div style={{ color: color }}>Clicks count: {count}</div>
      <button onClick={buttonClick}>Click me</button>
    </div>
  );
}
