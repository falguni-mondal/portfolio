import React, { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import PageRouter from "./router/PageRouter";
import Preloader from "./components/loader/Preloader"; 
import GlobalRingCanvas from "./utils/GlobalRingCanvas";
import { useLabStore } from "./store/store";

export const LoadingContext = createContext(false);

const App = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Pull the global theme state from Zustand
  const theme = useLabStore((state) => state.theme);

  // Sync the Tailwind root class with Zustand
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <LoadingContext.Provider value={hasLoaded}>
      <Preloader setHasLoaded={setHasLoaded} />
      
      <div className="w-full max-w-[1920px] mx-auto overflow-x-clip relative transition-colors duration-500">
        <header className="w-full fixed top-0 left-0 z-50 flex justify-center">
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