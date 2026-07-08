"use client";

import { useEffect, useState } from 'react';
import { tvClient } from '@/lib/lgtv';
import { COMMANDS } from '@/lib/lgtv/protocol';
import { useTvStore } from '@/store/tvStore';
import { Play, Globe, Video, Music, LayoutGrid, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';

// Hardcoded premium apps for quick launch since LG app icons are sometimes hard to get via API
const PREMIUM_APPS = [
  { id: 'netflix', name: 'Netflix', color: 'bg-[#E50914]/20 border-[#E50914]/50 text-[#E50914]', icon: Play },
  { id: 'youtube.leanback.v4', name: 'YouTube', color: 'bg-[#FF0000]/20 border-[#FF0000]/50 text-[#FF0000]', icon: MonitorPlay },
  { id: 'amazon', name: 'Prime Video', color: 'bg-[#00A8E1]/20 border-[#00A8E1]/50 text-[#00A8E1]', icon: Video },
  { id: 'com.webos.app.browser', name: 'Web Browser', color: 'bg-blue-500/20 border-blue-500/50 text-blue-500', icon: Globe },
  { id: 'spotify-beehive', name: 'Spotify', color: 'bg-[#1DB954]/20 border-[#1DB954]/50 text-[#1DB954]', icon: Music },
];

export default function AppLauncher() {
  const [apps, setApps] = useState<any[]>([]);
  const { currentApp } = useTvStore();

  useEffect(() => {
    // Fetch all installed apps
    tvClient.sendCommand(COMMANDS.GET_APPS, {}).then((res: any) => {
      if (res && res.launchPoints) {
        setApps(res.launchPoints);
      }
    }).catch(console.error);
  }, []);

  const launchApp = (appId: string) => {
    tvClient.sendCommand(COMMANDS.LAUNCH_APP, { id: appId });
  };

  const getIconForApp = (appId: string) => {
    const premium = PREMIUM_APPS.find(p => p.id === appId || appId.includes(p.name.toLowerCase()));
    if (premium) {
      const Icon = premium.icon;
      return <Icon size={32} />;
    }
    return <LayoutGrid size={32} className="text-secondary" />;
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      
      <h3 className="text-lg font-medium text-foreground tracking-tight">Quick Launch</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {PREMIUM_APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => launchApp(app.id)}
            className={`glass-panel p-6 rounded-[24px] flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 ${app.color} ${currentApp === app.id ? 'ring-2 ring-current' : ''}`}
          >
            {getIconForApp(app.id)}
            <span className="font-medium text-sm text-foreground">{app.name}</span>
          </button>
        ))}
      </div>

      <h3 className="text-lg font-medium text-foreground tracking-tight mt-6">All Apps</h3>
      
      <div className="grid grid-cols-4 gap-4">
        {apps.filter(app => !PREMIUM_APPS.find(p => p.id === app.id)).slice(0, 16).map((app) => (
          <button
            key={app.id}
            onClick={() => launchApp(app.id)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-16 h-16 rounded-2xl glass-panel flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 ${currentApp === app.id ? 'border-white/50' : ''}`}>
              {/* Try to use LG provided icon, fallback to generic */}
              {app.icon ? (
                <img src={app.icon} alt={app.title} className="w-10 h-10 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
              ) : (
                getIconForApp(app.id)
              )}
            </div>
            <span className="text-[10px] text-muted text-center w-full truncate px-1">{app.title}</span>
          </button>
        ))}
      </div>
      
    </div>
  );
}
