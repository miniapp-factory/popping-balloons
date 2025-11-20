"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#5f27cd"];

type Balloon = {
  id: number;
  top: number;
  left: number;
  color: string;
  popped: boolean;
};

export default function Balloons() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [nextId, setNextId] = useState(0);

  // State for splash effects that appear when a balloon pops
  type Splash = {
    id: number;
    top: number;
    left: number;
    color: string;
  };
  const [splashes, setSplashes] = useState<Splash[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: nextId,
          top: -100,
          left: Math.random() * 80,
          color: colors[Math.floor(Math.random() * colors.length)],
          popped: false,
        },
      ]);
      setNextId((id) => id + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [nextId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev
          .map((b) => ({
            ...b,
            top: b.top + 2,
          }))
          .filter((b) => b.top < 1100)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const popBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, popped: true, top: b.top + 20 } : b
      )
    );
    // Create a splash effect at the balloon's position
    const poppedBalloon = balloons.find((b) => b.id === id);
    if (poppedBalloon) {
      setSplashes((prev) => [
        ...prev,
        {
          id: Date.now(),
          top: poppedBalloon.top + 20,
          left: poppedBalloon.left,
          color: poppedBalloon.color,
        },
      ]);
    }
    const audio = new Audio("/pop-sound.mp3");
    audio.play();
  };

  return (
    <>
      {/* Global styles for splash animation */}
      <style>{`
        @keyframes splash {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .splash {
          position: absolute;
          border-radius: 50%;
          animation: splash 0.5s forwards;
        }
      `}</style>
      <div className="relative w-full h-[80vh] overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className={cn(
            "absolute rounded-full cursor-pointer transition-all duration-200",
            b.popped ? "opacity-0" : "opacity-100"
          )}
          style={{
            top: `${b.top}px`,
            left: `${b.left}%`,
            width: "60px",
            height: "80px",
            backgroundColor: b.color,
          }}
          onClick={() => !b.popped && popBalloon(b.id)}
        >
          {b.popped && (
            <div
              className="absolute inset-0 bg-white rounded-full opacity-50 animate-pulse"
              style={{
                filter: "blur(4px)",
              }}
            />
          )}
        </div>
      ))}
      {splashes.map((s) => (
        <div
          key={s.id}
          className="splash"
          style={{
            top: `${s.top}px`,
            left: `${s.left}%`,
            width: "20px",
            height: "20px",
            backgroundColor: s.color,
          }}
        />
      ))}
      </div>
      {splashes.map((s) => (
        <div
          key={s.id}
          className="splash"
          style={{
            top: `${s.top}px`,
            left: `${s.left}%`,
            width: "20px",
            height: "20px",
            backgroundColor: s.color,
          }}
        />
      ))}
      </>  {/* Close the fragment before the closing parenthesis */}
  );
}
