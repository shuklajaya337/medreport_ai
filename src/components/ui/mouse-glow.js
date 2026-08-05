"use client";

import { useEffect, useState } from "react";

export function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
      }}
    />
  );
}
