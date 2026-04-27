import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  // Connection Settings
  serverIp: string;
  wsPort: string;
  sipPort: string;
  wssEnabled: boolean;
  
  // SIP Settings
  motherNumber: string;
  extension: string;
  sipPassword: string;
  displayName: string;
  
  // Dashboard & UI Settings
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  autoAnswer: boolean;

  // Real-time SIP state (not persisted)
  isConnected: boolean;
  activeCallsCount: number;
  registrationStatus: 'registered' | 'unregistered' | 'registering' | 'failed';

  // Actions
  setSettings: (settings: Partial<AppState>) => void;
  setConnectionStatus: (status: boolean) => void;
  setRegistrationStatus: (status: AppState['registrationStatus']) => void;
  incrementActiveCalls: () => void;
  decrementActiveCalls: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Default Settings
      serverIp: '192.168.1.1',
      wsPort: '8443',
      sipPort: '5060',
      wssEnabled: true,
      motherNumber: '09120000000',
      extension: '100',
      sipPassword: 'secure_password',
      displayName: 'اپراتور مادر',
      theme: 'dark',
      notificationsEnabled: true,
      autoAnswer: false,

      // Initial State (Non-persisted logic handled via partitializing)
      isConnected: false,
      activeCallsCount: 0,
      registrationStatus: 'unregistered',

      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
      setConnectionStatus: (isConnected) => set({ isConnected }),
      setRegistrationStatus: (registrationStatus) => set({ registrationStatus }),
      incrementActiveCalls: () => set((state) => ({ activeCallsCount: state.activeCallsCount + 1 })),
      decrementActiveCalls: () => set((state) => ({ activeCallsCount: Math.max(0, state.activeCallsCount - 1) })),
    }),
    {
      name: 'voip-settings-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist real-time connection status
      partialize: (state) => ({
        serverIp: state.serverIp,
        wsPort: state.wsPort,
        sipPort: state.sipPort,
        wssEnabled: state.wssEnabled,
        motherNumber: state.motherNumber,
        extension: state.extension,
        sipPassword: state.sipPassword,
        displayName: state.displayName,
        theme: state.theme,
        notificationsEnabled: state.notificationsEnabled,
        autoAnswer: state.autoAnswer,
      }),
    }
  )
);
