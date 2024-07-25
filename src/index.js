import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, createStore } from "redux";
import {thunk }from "redux-thunk";

import { HashRouter as Router } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import { reducers } from "./reducers";
const root = ReactDOM.createRoot(document.getElementById("root"));

const middleware = [thunk];
const store = createStore(
  reducers,
  applyMiddleware(...middleware)
);
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

reportWebVitals();
