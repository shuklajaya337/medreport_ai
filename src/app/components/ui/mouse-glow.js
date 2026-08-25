"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
  let rafId = null;

  const handleMouseMove = (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
      rafId = null;
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, []);

  return (
    <>
      <style jsx global>{`
        .cursor-dot {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s;
          mix-blend-mode: screen;
        }
        .cursor-ring {
          position: fixed;
          width: 36px;
          height: 36px;
          border: 1.5px solid rgba(59, 130, 246, 0.45);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: left 0.08s ease, top 0.08s ease, width 0.3s, height 0.3s;
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}