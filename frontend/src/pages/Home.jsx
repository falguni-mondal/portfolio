import React from 'react';
import Hero from '../components/home/Hero';
import Experience from '../components/home/experience/Experience';
import Works from '../components/home/works/Works';
import About from '../components/home/about/About';
import Lab from '../components/home/lab/Lab';
import Certificates from '../components/home/certificate/Certificates';
import Signature from '../components/home/Signature';
import Contact from '../components/home/contact/Contact';

const Home = () => {
  return (
    <main className="relative w-full">
      <div className="relative z-10 w-full">
        <Hero />
        <Experience/>
        <Works />
        <About />
        <Lab />
        <Certificates />
        <Signature/>
        <Contact />
      </div>
    </main>
  );
};

export default Home;