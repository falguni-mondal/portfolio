"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "./navbar/Navbar";
import Preloader from "./loader/Preloader";
import Hero from "./home/Hero";
import Experience from "./home/experience/Experience";
import Works from "./home/works/Works";
import About from "./home/about/About";
import Lab from "./home/lab/Lab";
import Certificates from "./home/certificate/Certificates";
import Signature from "./home/Signature";
import Contact from "./home/contact/Contact";
import { LoadingContext } from "@/context/LoadingContext";
import { useLabStore } from "@/store/store";

// Dynamically load the Three.js / WebGL ring canvas on the client only
// so Server-Side Rendering immediately ships all semantic HTML for SEO crawlers.
const GlobalRingCanvas = dynamic(() => import("@/utils/GlobalRingCanvas"), {
  ssr: false,
});

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

const PortfolioClientShell = ({ initialData }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const theme = useLabStore((state) => state.theme);
  const setPortfolioData = useLabStore((state) => state.setPortfolioData);

  // Sync SSR-fetched data on mount
  useEffect(() => {
    if (initialData && Array.isArray(initialData.works)) {
      setPortfolioData(initialData);
    }
  }, [initialData, setPortfolioData]);

  // Sync dark/light class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Optional live CMS client refresh from admin.byfalguni.com
  useEffect(() => {
    if (!ADMIN_API_URL) return;
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
          <div className="relative w-full">
            <div className="relative z-10 w-full">
              <Hero />
              <Experience />
              <Works />
              <About />
              <Lab />
              <Certificates />
              <Signature />
              <Contact />
            </div>
          </div>
        </main>
      </div>
    </LoadingContext.Provider>
  );
};

export default PortfolioClientShell;
