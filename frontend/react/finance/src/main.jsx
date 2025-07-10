import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./Login.jsx";

const container = document.body;

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Login />
//   </StrictMode>,
// );
createRoot(container).render(
  <StrictMode>
    <Login />
  </StrictMode>,
);
