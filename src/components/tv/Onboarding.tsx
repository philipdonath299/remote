"use client";

import { useState, useEffect, useRef } from 'react';
import { useTvStore } from '@/store/tvStore';
import { tvClient } from '@/lib/lgtv';
import { Tv, Loader2, Search, Settings, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const [ipInput, setIpInput] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [foundTvs, setFoundTvs] = useState<string[]>([]);
  const [showManual, setShowManual] = useState(false);
  const stopScan = useRef(false);

  const { isConnecting, setIp, ip, isConnected, clientKey } = useTvStore();

  // Reset scan state on mount
  useEffect(() => {
    return () => {
      stopScan.current = true;
    };
  }, []);

  const handleConnect = (targetIp: string) => {
    if (!targetIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      setError('Ogiltig IP-adress (t.ex. 192.168.1.50)');
      return;
    }
    stopScan.current = true; // stop any ongoing scan
    setError('');
    setIp(targetIp);
    tvClient.connect(targetIp);
  };

  const startScan = async () => {
    setIsScanning(true);
    setFoundTvs([]);
    setScanProgress(0);
    setShowManual(false);
    stopScan.current = false;
    
    // Generate IPs for common local subnets
    const ips: string[] = [];
    for (let i = 1; i < 255; i++) {
      ips.push(`192.168.1.${i}`);
      ips.push(`192.168.0.${i}`);
      // Add more subnets if needed, but keeping it small for performance
    }
    
    const total = ips.length;
    let completed = 0;
    
    // Batch processing to not overload the browser's connection pool
    const batchSize = 10;
    
    for (let i = 0; i < ips.length; i += batchSize) {
      if (stopScan.current) break;
      
      const batch = ips.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (testIp) => {
        try {
          const success = await pingIp(testIp);
          if (success && !stopScan.current) {
            setFoundTvs(prev => {
              if (!prev.includes(testIp)) return [...prev, testIp];
              return prev;
            });
          }
        } catch (e) {
          // ignore
        } finally {
          completed++;
          if (!stopScan.current) {
            setScanProgress(Math.round((completed / total) * 100));
          }
        }
      }));
    }
    
    if (!stopScan.current) {
      setIsScanning(false);
    }
  };

  const pingIp = (testIp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // WSS port 3001
      const ws = new WebSocket(`wss://${testIp}:3001`);
      
      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
          resolve(false);
        }
      }, 1500); // Short timeout for scanning

      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        ws.close();
        // Fallback to WS port 3000 might be needed, but WSS 3001 is standard for newer webOS
        resolve(false);
      };
    });
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
              Låt appen skanna nätverket efter din TV, eller ange IP-adressen manuellt.
            </p>
            
            <AnimatePresence mode="wait">
              {!showManual && !isScanning && foundTvs.length === 0 && (
                <motion.div
                  key="start-scan"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4"
                >
                  <button
                    onClick={startScan}
                    className="w-full bg-foreground text-background font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Search size={18} />
                    Sök efter TV
                  </button>
                  <button
                    onClick={() => setShowManual(true)}
                    className="w-full bg-white/5 border border-white/10 text-foreground font-medium py-3 rounded-xl hover:bg-white/10 transition-colors active:scale-[0.98]"
                  >
                    Ange manuellt
                  </button>
                </motion.div>
              )}

              {isScanning && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="py-4"
                >
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-secondary">
                          Söker på nätverket...
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-secondary">
                          {scanProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/10">
                      <div style={{ width: `${scanProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-foreground transition-all duration-300"></div>
                    </div>
                  </div>
                  
                  {foundTvs.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                      <p className="text-xs text-green-400 mb-1">Hittade enheter:</p>
                      {foundTvs.map(foundIp => (
                        <button
                          key={foundIp}
                          onClick={() => handleConnect(foundIp)}
                          className="w-full bg-white/10 border border-white/20 p-3 rounded-xl flex items-center justify-between hover:bg-white/20 transition-colors"
                        >
                          <span className="font-mono text-sm">{foundIp}</span>
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      stopScan.current = true;
                      setIsScanning(false);
                      if (foundTvs.length === 0) setShowManual(true);
                    }}
                    className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    Avbryt
                  </button>
                </motion.div>
              )}

              {(!isScanning && foundTvs.length > 0) && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3"
                >
                  <h3 className="text-sm font-medium text-left text-secondary mb-1">Välj TV:</h3>
                  {foundTvs.map(foundIp => (
                    <button
                      key={foundIp}
                      onClick={() => handleConnect(foundIp)}
                      className="w-full bg-foreground text-background font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98] flex items-center justify-between"
                    >
                      <span>Anslut till</span>
                      <span className="font-mono">{foundIp}</span>
                    </button>
                  ))}
                  <button
                    onClick={startScan}
                    className="w-full mt-2 bg-white/5 border border-white/10 text-foreground text-sm font-medium py-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Sök igen
                  </button>
                  <button
                    onClick={() => {
                      setFoundTvs([]);
                      setShowManual(true);
                    }}
                    className="w-full mt-2 text-sm text-muted hover:text-foreground transition-colors py-2"
                  >
                    Ange IP manuellt
                  </button>
                </motion.div>
              )}

              {showManual && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    placeholder="t.ex. 192.168.1.50"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-foreground placeholder:text-muted focus:outline-none focus:border-white/30 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleConnect(ipInput)}
                  />
                  
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  
                  <button
                    onClick={() => handleConnect(ipInput)}
                    className="w-full bg-foreground text-background font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
                  >
                    Anslut
                  </button>
                  <button
                    onClick={() => {
                      setShowManual(false);
                      setError('');
                    }}
                    className="text-sm text-muted hover:text-foreground transition-colors mt-2"
                  >
                    Tillbaka
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
}
