import React from "react";
import Navbar from "./components/navbar/Navbar";
import PageRouter from "./router/PageRouter";

const App = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto overflow-x-clip relative">
      <header className="w-full">
        <Navbar />
      </header>
      <main className="w-full">
        <PageRouter />
      </main>
    </div>
  );
};

export default App;