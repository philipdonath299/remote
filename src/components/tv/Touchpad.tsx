"use client";

import { useEffect, useRef } from 'react';
import { tvClient } from '@/lib/lgtv';

export default function Touchpad() {
  const touchpadRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const isDown = useRef(false);

  useEffect(() => {
    // Initialize pointer socket when touchpad is mounted
    tvClient.getPointerInputSocket();
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDown.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDown.current) return;
    
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    
    // LGTV expects dx/dy in a specific format for 'move' command
    // We might need to scale it
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      tvClient.sendPointerCommand('move', { dx: dx * 2, dy: dy * 2 });
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDown.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleClick = () => {
    tvClient.sendPointerCommand('click');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-medium">Magic Touchpad</h3>
        <p className="text-muted text-sm mt-1">Flytta fingret för att styra pekaren på TV:n. Klicka för att välja.</p>
      </div>

      <div 
        ref={touchpadRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        className="w-full aspect-square max-w-[320px] rounded-[40px] glass-panel border-white/10 touch-none flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="w-12 h-1 bg-white/10 rounded-full absolute top-6" />
        <span className="text-white/20 select-none">Touch Area</span>
      </div>
      
      <div className="mt-8 flex gap-4 w-full max-w-[320px]">
        <button 
          onClick={() => tvClient.sendPointerCommand('button', { name: 'BACK' })}
          className="flex-1 py-4 glass-panel rounded-2xl active:bg-white/10"
        >
          Back
        </button>
        <button 
          onClick={() => tvClient.sendPointerCommand('button', { name: 'HOME' })}
          className="flex-1 py-4 glass-panel rounded-2xl active:bg-white/10"
        >
          Home
        </button>
      </div>
    </div>
  );
}
