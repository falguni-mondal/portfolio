import React from "react";
import Navbar from "./components/navbar/Navbar";
import PageRouter from "./router/PageRouter";

const App = () => {
  return (
    <div className="w-full">
      <header className="w-full">
        <Navbar />
      </header>
      <main className="w-full pt-[80px]">
        <PageRouter />
      </main>
    </div>
  );
};

export default App;
