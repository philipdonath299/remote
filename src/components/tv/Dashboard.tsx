"use client";

import { useTvStore } from '@/store/tvStore';
import { tvClient } from '@/lib/lgtv';
import { COMMANDS } from '@/lib/lgtv/protocol';
import { Tv, Volume2, VolumeX, Power, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { tvInfo, isConnected, ip, volume, isMuted } = useTvStore();

  const handlePowerOff = () => {
    tvClient.sendCommand(COMMANDS.POWER_OFF);
  };

  return (
    <div className="pt-12 px-6 pb-6 rounded-b-[40px] glass z-10 sticky top-0 border-t-0 border-x-0">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
            <h2 className="text-xl font-semibold tracking-tight">
              {tvInfo?.modelName || 'LG webOS TV'}
            </h2>
          </div>
          <p className="text-muted text-xs font-mono">{ip}</p>
        </div>
        
        <button 
          onClick={handlePowerOff}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors active:scale-90"
        >
          <Power size={20} />
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted mb-2">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span className="text-xs font-medium uppercase tracking-wider">Volume</span>
          </div>
          <div className="text-3xl font-light">
            {volume}
          </div>
        </div>
        
        <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Settings size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Status</span>
          </div>
          <div className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  );
}
