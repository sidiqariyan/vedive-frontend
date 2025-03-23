import React from "react";
import "tailwindcss/tailwind.css";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;700&display=swap');

@keyframes slideIn {
  0% { transform: translateX(100%); opacity: 0; letter-spacing: 0.35em; }
  30% { opacity: 0.3; }
  100% { transform: translateX(0); opacity: 1; letter-spacing: 0.15em; }
}

@keyframes lightUp {
  0% { background-position: 200% 50%; opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { background-position: 0% 50%; opacity: 1; }
}

@keyframes borderLight {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.elegant-text {
  font-weight: 700;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 2px rgba(30, 144, 255, 1);
  text-stroke: 2px rgba(30, 144, 255, 1);
  position: relative;
}

.elegant-text::before {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  color: transparent;
  -webkit-text-stroke: 2px rgba(30, 144, 255, 1);
  text-stroke: 2px rgba(30, 144, 255, 1);
  background: linear-gradient(90deg, transparent, rgba(30,144,255,1), transparent);
  background-size: 200%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: borderLight 3s ease-in-out infinite normal;
}

.animate-slide {
  animation: slideIn 2.8s cubic-bezier(0.22, 1, 0.36, 1) forwards,
             lightUp 3s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
}

.gradient-bg {
  background: radial-gradient(circle at right, rgba(30, 144, 255, 0.15) 0%, rgba(0, 0, 0, 1) 65%);
  transition: background 0.5s ease-in-out;
}

.light-beam {
  position: absolute;
  right: -50%;
  top: -100%;
  width: 200%;
  height: 300%;
  background: linear-gradient(90deg, transparent 0%, rgba(30, 144, 255, 0.02) 40%, rgba(30, 144, 255, 0.1) 50%, rgba(30, 144, 255, 0.02) 60%, transparent 100%);
  transform: rotate(-45deg);
  pointer-events: none;
  animation: lightBeam 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes lightBeam {
  0%, 100% { opacity: 0.8; transform: rotate(-45deg) translateY(0); }
  50% { opacity: 1; transform: rotate(-45deg) translateY(-3%); }
}
`;

const Loader = () => {
  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden relative">
      <style>{styles}</style>
      <div className="absolute inset-0 gradient-bg">
        <div className="light-beam" />
      </div>
      <div className="relative text-center">
        <h1 
          data-text="Vedive"
          className="elegant-text animate-slide text-[10rem] opacity-0 tracking-wider drop-shadow-xl hover:scale-105 transition-transform duration-500"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Vedive
        </h1>
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="animate-pulse w-[200px] h-[200px] rounded-full bg-blue-500 opacity-10 blur-3xl" />
      </div>
    </div>
  );
};

export default Loader;
