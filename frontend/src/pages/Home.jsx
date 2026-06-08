import React from 'react';
import Hero from '../components/home/Hero';
import Experience from '../components/home/experience/Experience';
import HomeCanvasBackground from '../components/home/HomeCanvasBackground';
import Works from '../components/home/works/Works';
import About from '../components/home/About';
import Lab from '../components/home/lab/Lab';

const Home = () => {
  return (
    <main className="relative w-full">
      {/* <div className="fixed inset-0 w-full h-[115vh] lg:h-[130vh] pointer-events-none z-0">
        <HomeCanvasBackground />
      </div> */}
      <div className="relative z-10 w-full">
        <Hero />
        <Experience/>
        <Works />
        <About />
        <Lab />
      </div>
    </main>
  );
};

export default Home;