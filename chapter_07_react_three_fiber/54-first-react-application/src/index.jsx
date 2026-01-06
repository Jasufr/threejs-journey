import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

const root = createRoot(document.querySelector("#root"));
const toto = "there";

root.render(
  <>
    <App clickersCount={3}>
      <h1>My first react app</h1>
    </App>
    {/* <App
      children={
        <>
          <h1>My first react app</h1>
        </>
      }
    /> */}
  </>
);
