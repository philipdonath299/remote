import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Macro {
  id: string;
  name: string;
  actions: {
    type: 'power' | 'input' | 'volume' | 'launchApp' | 'button';
    value?: any;
    delay?: number;
  }[];
}

interface TvState {
  ip: string | null;
  clientKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  tvInfo: {
    modelName?: string;
    productName?: string;
    majorVer?: string;
    minorVer?: string;
  } | null;
  currentApp: string | null;
  currentInput: string | null;
  volume: number;
  isMuted: boolean;
  macros: Macro[];
  
  // Actions
  setIp: (ip: string) => void;
  setClientKey: (key: string) => void;
  setIsConnected: (connected: boolean) => void;
  setIsConnecting: (connecting: boolean) => void;
  setTvInfo: (info: any) => void;
  setCurrentApp: (app: string) => void;
  setCurrentInput: (input: string) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  addMacro: (macro: Macro) => void;
  removeMacro: (id: string) => void;
}

export const useTvStore = create<TvState>()(
  persist(
    (set) => ({
      ip: null,
      clientKey: null,
      isConnected: false,
      isConnecting: false,
      tvInfo: null,
      currentApp: null,
      currentInput: null,
      volume: 0,
      isMuted: false,
      macros: [
        {
          id: 'movie-night',
          name: 'Movie Night',
          actions: [
            { type: 'power', value: 'on' },
            { type: 'input', value: 'HDMI_1' },
            { type: 'volume', value: 15 }
          ]
        },
        {
          id: 'gaming',
          name: 'Gaming',
          actions: [
            { type: 'power', value: 'on' },
            { type: 'input', value: 'HDMI_2' },
            { type: 'volume', value: 20 }
          ]
        }
      ],
      
      setIp: (ip) => set({ ip }),
      setClientKey: (clientKey) => set({ clientKey }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsConnecting: (isConnecting) => set({ isConnecting }),
      setTvInfo: (tvInfo) => set({ tvInfo }),
      setCurrentApp: (currentApp) => set({ currentApp }),
      setCurrentInput: (currentInput) => set({ currentInput }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (isMuted) => set({ isMuted }),
      addMacro: (macro) => set((state) => ({ macros: [...state.macros, macro] })),
      removeMacro: (id) => set((state) => ({ macros: state.macros.filter((m) => m.id !== id) })),
    }),
    {
      name: 'lg-remote-storage',
      partialize: (state) => ({
        ip: state.ip,
        clientKey: state.clientKey,
        macros: state.macros,
      }), // only persist these fields
    }
  )
);
