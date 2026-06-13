import React, { useState, createContext } from "react";
import Navbar from "./components/navbar/Navbar";
import PageRouter from "./router/PageRouter";
import Preloader from "./components/loader/Preloader"; 
import GlobalRingCanvas from "./utils/GlobalRingCanvas";

export const LoadingContext = createContext(false);

const App = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <LoadingContext.Provider value={hasLoaded}>
      <Preloader setHasLoaded={setHasLoaded} />
      
      <div className="w-full max-w-[1500px] mx-auto overflow-x-clip relative">
        <header className="w-full">
          <Navbar />
        </header>
        <main className="w-full relative z-10">
          <GlobalRingCanvas />
          <PageRouter />
        </main>
      </div>

    </LoadingContext.Provider>
  );
};

export default App;