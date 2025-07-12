import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { useEffect, useState } from "react";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = display;
    let end = value;
    let duration = 500;
    let startTime = performance.now();
    function animate(time) {
      let progress = Math.min((time - startTime) / duration, 1);
      setDisplay(start + (end - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return <span>₹{display.toFixed(2)}</span>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="min-h-screen h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-primary via-accent to-pink-200">
      <App />
    </main>
  </StrictMode>
);
