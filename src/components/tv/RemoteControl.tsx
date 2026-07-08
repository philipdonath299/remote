"use client";

import { tvClient } from '@/lib/lgtv';
import { COMMANDS } from '@/lib/lgtv/protocol';
import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  CircleDot, Home, ArrowLeft, Settings, 
  Volume2, Volume1, Plus, Minus, Tv
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RemoteControl() {
  const sendKey = (key: string) => {
    // Basic send key could map to button commands or inject text
    // LGTV has specific endpoints for simple keys, we'll use input text or standard SSAP
    // Wait, D-pad uses pointer socket 'button' type
    tvClient.sendPointerCommand('button', { name: key });
  };
  
  const sendCommand = (cmd: string, payload: any = {}) => {
    tvClient.sendCommand(cmd, payload);
  };

  const RemoteButton = ({ 
    icon, 
    onClick, 
    className = "", 
    label 
  }: { 
    icon?: React.ReactNode, 
    onClick: () => void, 
    className?: string,
    label?: string 
  }) => (
    <button 
      onClick={onClick}
      className={`glass-panel flex flex-col items-center justify-center transition-all hover:bg-white/10 active:scale-95 ${className}`}
    >
      {icon}
      {label && <span className="text-[10px] uppercase tracking-wider text-muted mt-1">{label}</span>}
    </button>
  );

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      
      {/* D-Pad Area */}
      <div className="relative w-64 h-64 mx-auto my-4">
        {/* D-Pad background */}
        <div className="absolute inset-0 rounded-full glass-panel border border-white/10 shadow-[inset_0_4px_15px_rgba(0,0,0,0.5)]" />
        
        {/* Up */}
        <button onClick={() => sendKey('UP')} className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center hover:bg-white/5 rounded-t-full active:bg-white/10 transition-colors z-10">
          <ChevronUp size={28} className="text-secondary" />
        </button>
        
        {/* Down */}
        <button onClick={() => sendKey('DOWN')} className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center hover:bg-white/5 rounded-b-full active:bg-white/10 transition-colors z-10">
          <ChevronDown size={28} className="text-secondary" />
        </button>
        
        {/* Left */}
        <button onClick={() => sendKey('LEFT')} className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center hover:bg-white/5 rounded-l-full active:bg-white/10 transition-colors z-10">
          <ChevronLeft size={28} className="text-secondary" />
        </button>
        
        {/* Right */}
        <button onClick={() => sendKey('RIGHT')} className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center hover:bg-white/5 rounded-r-full active:bg-white/10 transition-colors z-10">
          <ChevronRight size={28} className="text-secondary" />
        </button>
        
        {/* OK / Center */}
        <button onClick={() => sendKey('ENTER')} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#151515] shadow-inner border border-white/5 flex items-center justify-center active:bg-white/10 active:scale-95 transition-all z-20">
          <CircleDot size={20} className="text-white/50" />
        </button>
      </div>

      {/* Control Row 1 */}
      <div className="grid grid-cols-3 gap-4 h-16">
        <RemoteButton icon={<ArrowLeft size={20} />} onClick={() => sendKey('BACK')} className="rounded-full" />
        <RemoteButton icon={<Home size={20} />} onClick={() => sendKey('HOME')} className="rounded-full" />
        <RemoteButton icon={<Settings size={20} />} onClick={() => sendCommand(COMMANDS.LAUNCH_APP, { id: 'com.palm.app.settings' })} className="rounded-full" />
      </div>

      {/* Vol & CH */}
      <div className="grid grid-cols-2 gap-6 h-32 mt-4">
        {/* Volume */}
        <div className="glass-panel rounded-full flex flex-col overflow-hidden relative">
          <button onClick={() => sendCommand(COMMANDS.VOLUME_UP)} className="flex-1 flex items-center justify-center hover:bg-white/5 active:bg-white/10 transition-colors z-10 pb-2">
            <Plus size={24} />
          </button>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-muted tracking-widest pointer-events-none z-0 font-medium">VOL</div>
          <button onClick={() => sendCommand(COMMANDS.VOLUME_DOWN)} className="flex-1 flex items-center justify-center hover:bg-white/5 active:bg-white/10 transition-colors z-10 pt-2">
            <Minus size={24} />
          </button>
        </div>

        {/* Channel */}
        <div className="glass-panel rounded-full flex flex-col overflow-hidden relative">
          <button onClick={() => sendCommand(COMMANDS.CHANNEL_UP)} className="flex-1 flex items-center justify-center hover:bg-white/5 active:bg-white/10 transition-colors z-10 pb-2">
            <ChevronUp size={28} />
          </button>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-muted tracking-widest pointer-events-none z-0 font-medium">CH</div>
          <button onClick={() => sendCommand(COMMANDS.CHANNEL_DOWN)} className="flex-1 flex items-center justify-center hover:bg-white/5 active:bg-white/10 transition-colors z-10 pt-2">
            <ChevronDown size={28} />
          </button>
        </div>
      </div>
      
      {/* Colors & Extra */}
      <div className="grid grid-cols-4 gap-3 mt-4 h-12">
        <button onClick={() => sendKey('RED')} className="rounded-full bg-red-500/20 border border-red-500/30 active:scale-95 transition-transform" />
        <button onClick={() => sendKey('GREEN')} className="rounded-full bg-green-500/20 border border-green-500/30 active:scale-95 transition-transform" />
        <button onClick={() => sendKey('YELLOW')} className="rounded-full bg-yellow-500/20 border border-yellow-500/30 active:scale-95 transition-transform" />
        <button onClick={() => sendKey('BLUE')} className="rounded-full bg-blue-500/20 border border-blue-500/30 active:scale-95 transition-transform" />
      </div>

    </div>
  );
}
