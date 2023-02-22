import React, { createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Header from "../src/frontend/Header";
import Terminal from "../src/frontend/Terminal";
import "./App.css";

function App() {
  return (
    // <AppContext.Provider value={{ws = null}}>
    <div className="App">
      <Header />
      {/* <Provider store={this.store}> */}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/login" component={Login} /> */}

          <Route path="/terminal" component={Header} />
        </Routes>
      </BrowserRouter>
      {/* </Provider> */}
    </div>
    // </AppContext.Provider>
  );
}

export const AppContext = createContext();

export default App;
