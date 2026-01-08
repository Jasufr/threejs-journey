import { useEffect, useRef, useState } from "react";

export default function Clicker({ increment, keyName, color }) {
  // console.log("render");

  const [count, setCount] = useState(
    parseInt(localStorage.getItem(keyName) ?? 0)
  );

  const buttonRef = useRef();

  useEffect(() => {
    // console.log("first render");

    buttonRef.current.style.backgroundColor = "papayawhip";
    buttonRef.current.style.color = "salmon";

    return () => {
      // console.log("component disposed");
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
      <button ref={buttonRef} onClick={buttonClick}>
        Click me
      </button>
    </div>
  );
}
