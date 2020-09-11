import React from "react";
import ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query-devtools";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ReactQueryDevtools />
    <App />
  </React.StrictMode>,
  rootElement
);
