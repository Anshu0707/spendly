import { useEffect, useState } from "react";

export default function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 500;
    const startTime = performance.now();
    function animate(time: number) {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplay(start + (end - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return <span>₹{display.toFixed(2)}</span>;
}
