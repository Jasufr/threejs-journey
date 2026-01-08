import { useEffect, useState } from "react";

export default function People() {
  const [people, setPeople] = useState([]);

  const getPeople = async () => {
    // fetch("https://jsonplaceholder.typicode.com/users")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((result) => {
    //     console.log(result);
    //   });

    // fetch("https://jsonplaceholder.typicode.com/users")
    //   .then((response) => response.json())
    //   .then((result) => console.log(result));

    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const result = await response.json();
    setPeople(result);
  };

  useEffect(() => {
    getPeople();
  }, []);

  return (
    <>
      <h2>people</h2>
      <ul>
        {people.map((person) => {
          return <li key={person.id}>{person.name}</li>;
        })}
      </ul>
    </>
  );
}
