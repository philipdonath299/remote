"use client";

import { useEffect, useState } from 'react';
import { useTvStore } from '@/store/tvStore';
import { tvClient } from '@/lib/lgtv';
import Onboarding from '@/components/tv/Onboarding';
import Dashboard from '@/components/tv/Dashboard';
import RemoteControl from '@/components/tv/RemoteControl';
import AppLauncher from '@/components/tv/AppLauncher';
import Touchpad from '@/components/tv/Touchpad';
import { Settings, Tv, Gamepad2, MousePointer2, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { ip, clientKey, isConnected, isConnecting } = useTvStore();
  const [activeTab, setActiveTab] = useState<'remote' | 'apps' | 'touchpad'>('remote');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (ip && !isConnected && !isConnecting) {
      tvClient.connect(ip);
    }
  }, [ip, isConnected, isConnecting]);

  if (!isMounted) return null; // Prevent hydration mismatch

  if (!ip || (!isConnected && !clientKey)) {
    return <Onboarding />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header / Dashboard Area */}
      <Dashboard />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'remote' && (
            <motion.div
              key="remote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md"
            >
              <RemoteControl />
            </motion.div>
          )}
          {activeTab === 'apps' && (
            <motion.div
              key="apps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md"
            >
              <AppLauncher />
            </motion.div>
          )}
          {activeTab === 'touchpad' && (
            <motion.div
              key="touchpad"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md"
            >
              <Touchpad />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="glass fixed bottom-0 left-0 right-0 h-20 px-6 flex items-center justify-between pb-4 sm:pb-0 z-50 rounded-t-3xl border-b-0 border-x-0">
        <NavItem 
          icon={<Gamepad2 size={24} />} 
          label="Remote" 
          active={activeTab === 'remote'} 
          onClick={() => setActiveTab('remote')} 
        />
        <NavItem 
          icon={<MousePointer2 size={24} />} 
          label="Touchpad" 
          active={activeTab === 'touchpad'} 
          onClick={() => setActiveTab('touchpad')} 
        />
        <NavItem 
          icon={<LayoutGrid size={24} />} 
          label="Apps" 
          active={activeTab === 'apps'} 
          onClick={() => setActiveTab('apps')} 
        />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${active ? 'text-foreground' : 'text-muted hover:text-secondary'}`}
    >
      <div className={`p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-white/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );
}
