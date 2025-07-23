// src/components/AsciiRain.tsx
import { useEffect, useState } from "react";

const CHARS = "₹01#₹*".split("");

const generateAsciiColumn = (height: number) => {
  return Array.from(
    { length: height },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join("\n");
};

export default function AsciiRain({
  columnCount = 80,
  columnHeight = 25,
}: {
  columnCount?: number;
  columnHeight?: number;
}) {
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = Array.from({ length: columnCount }, () =>
        generateAsciiColumn(columnHeight)
      );
      setColumns(updated);
    }, 100);

    return () => clearInterval(interval);
  }, [columnCount, columnHeight]);

  return (
    <div className="w-full h-full flex flex-wrap items-start justify-center gap-[2px] p-2 text-green-400 font-mono text-[10px] opacity-40 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      {columns.map((col, i) => (
        <pre
          key={i}
          className="whitespace-pre leading-[1.1rem] text-center animate-[ascii-scroll_6s_linear_infinite]"
        >
          {col}
        </pre>
      ))}
    </div>
  );
}
