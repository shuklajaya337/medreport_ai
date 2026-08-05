"use client";

export function GlowOrb() {
  return (
    <>
      <style jsx global>{`
        @keyframes rotate-orb {
          0% {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }
        .glow-orb {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 500px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(59, 130, 246, 0.25), transparent 70%);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
          animation: rotate-orb 20s linear infinite;
        }
      `}</style>
      <div className="glow-orb" />
    </>
  );
}
