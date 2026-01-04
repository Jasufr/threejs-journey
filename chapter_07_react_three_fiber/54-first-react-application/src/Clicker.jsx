import { useEffect, useState } from "react";

export default function Clicker() {
  console.log("render");

  const [count, setCount] = useState(
    parseInt(localStorage.getItem("count") ?? 0)
  );

  useEffect(() => {
    console.log("first render");

    return () => {
      console.log("component disposed");
      localStorage.removeItem("count");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);

  const buttonClick = () => {
    // setCount((value) => value + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <div>Clicks count: {count}</div>
      <button onClick={buttonClick}>Click me</button>
    </div>
  );
}
