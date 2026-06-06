import React from 'react';
import Hero from '../components/home/Hero';
// Update this path based on where you saved the canvas file
import HomeCanvasBackground from '../components/home/HomeCanvasBackground';
import Works from '../components/home/works/Works';

const Home = () => {
  return (
    <main className="relative w-full">
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-0 translate-y-[15vh] lg:translate-y-[20vh]">
        <HomeCanvasBackground />
      </div>
      <div className="relative z-10 w-full">
        <Hero />
        <Works />
      </div>
    </main>
  );
};

export default Home;