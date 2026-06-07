import React from 'react';
import Hero from '../components/home/Hero';
// Update this path based on where you saved the canvas file
import HomeCanvasBackground from '../components/home/HomeCanvasBackground';
import Works from '../components/home/works/Works';

const Home = () => {
  return (
    <main className="relative w-full">
      {/* <div className="fixed inset-0 w-full h-[115vh] lg:h-[130vh] pointer-events-none z-0">
        <HomeCanvasBackground />
      </div> */}
      <div className="relative z-10 w-full">
        <Hero />
        <Works />
      </div>
    </main>
  );
};

export default Home;