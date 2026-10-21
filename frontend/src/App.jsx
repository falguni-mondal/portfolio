// src/App.jsx
import React, { useState, createContext, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import PageRouter from "./router/PageRouter";
import Preloader from "./components/loader/Preloader";
import GlobalRingCanvas from "./utils/GlobalRingCanvas";
import { useLabStore } from "./store/store";

export const LoadingContext = createContext(false);

const ADMIN_API_URL =
  import.meta.env.VITE_ADMIN_API_URL;

const App = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const theme = useLabStore((state) => state.theme);
  const setPortfolioData = useLabStore((state) => state.setPortfolioData);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Fetch live CMS updates from admin.byfalguni.com
  useEffect(() => {
    fetch(`${ADMIN_API_URL}/api/portfolio`)
      .then((res) => res.json())
      .then((liveData) => {
        if (liveData && Array.isArray(liveData.works)) {
          setPortfolioData(liveData);
        }
      })
      .catch(() => {});
  }, [setPortfolioData]);

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