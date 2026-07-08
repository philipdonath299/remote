"use client";

import { useState } from 'react';
import { useTvStore } from '@/store/tvStore';
import { tvClient } from '@/lib/lgtv';
import { Tv, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const [ipInput, setIpInput] = useState('');
  const [error, setError] = useState('');
  const { isConnecting, setIp, ip, isConnected, clientKey } = useTvStore();

  const handleConnect = () => {
    if (!ipInput.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      setError('Ogiltig IP-adress (t.ex. 192.168.1.50)');
      return;
    }
    setError('');
    setIp(ipInput);
    tvClient.connect(ipInput);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="bg-white/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Tv size={40} className="text-foreground" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Anslut till LG TV</h1>
        
        {isConnecting ? (
          <div className="py-6 flex flex-col items-center">
            <Loader2 size={32} className="animate-spin text-foreground mb-4" />
            <p className="text-secondary text-sm">Ansluter till {ip || ipInput}...</p>
            <p className="text-muted text-xs mt-2 text-balance">
              Om en parkopplingskod eller popup visas på TV:n, vänligen godkänn den.
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm mb-6 text-balance">
              Ange IP-adressen till din LG webOS TV. Se till att TV:n och enheten är på samma Wi-Fi.
            </p>
            
            <input
              type="text"
              placeholder="t.ex. 192.168.1.50"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-foreground placeholder:text-muted focus:outline-none focus:border-white/30 transition-colors mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
            />
            
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            
            <button
              onClick={handleConnect}
              className="w-full bg-foreground text-background font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
            >
              Anslut
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
