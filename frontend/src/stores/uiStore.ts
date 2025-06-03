import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { UIState, UserSettings } from '../types';

const defaultUserSettings: UserSettings = {
  isMuted: false,
  isDeafened: false,
  theme: 'stone',
  fontSize: 'medium',
  compactMode: false,
  showTimestamps: true,
  use24HourTime: false,
  enableNotifications: true,
  enableSounds: true,
  enableDesktopNotifications: true,
  muteAll: false,
  reducedMotion: false,
  locale: 'en-US',
  autoplayGifs: true,
  showEmbeds: true,
  showEmojis: true,
  enableDeveloperMode: false,
} as const;


interface UIStore extends UIState {
  // Actions
  setActiveTab: (tab: UIState['activeTab']) => void;
  setSelectedFriend: (id: string | undefined) => void;
  setSelectedGroup: (id: string | undefined) => void;
  setSelectedChannel: (id: string | undefined) => void;
  setSelectedDM: (id: string | undefined) => void;
  setUserSettings: (settings: Partial<UserSettings>) => void;
  updateUserSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  setActiveModal: (modal: UIState['activeModal'], data?: UIState['modalData']) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  toggleSidebar: () => void;
  toggleMemberList: () => void;
  resetSelections: () => void;
  resetUserSettings: () => void;
}

type UIStoreCreator = StateCreator<
  UIStore,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  []
>;

const createUIStore: UIStoreCreator = (set) => ({
  // Initial state
  activeTab: 'friends',
  selectedFriend: undefined,
  selectedGroup: undefined,
  selectedChannel: undefined,
  selectedDM: undefined,
  userSettings: defaultUserSettings,
  activeModal: undefined,
  modalData: undefined,
  searchQuery: '',
  sidebarCollapsed: false,
  showMemberList: true,

  // Actions
  setActiveTab: (tab) =>
    set((state) => ({
      ...state,
      activeTab: tab,
      // Clear selections when switching tabs for better UX
      selectedFriend: tab !== 'friends' ? undefined : state.selectedFriend,
      selectedGroup: tab !== 'groups' ? undefined : state.selectedGroup,
      selectedDM: tab !== 'dms' ? undefined : state.selectedDM,
    })),

  setSelectedFriend: (id) =>
    set({
      selectedFriend: id,
      selectedGroup: undefined,
      selectedChannel: undefined,
      selectedDM: undefined,
      activeTab: 'friends',
    }),

  setSelectedGroup: (id) =>
    set({
      selectedGroup: id,
      selectedFriend: undefined,
      selectedDM: undefined,
      activeTab: 'groups',
    }),

  setSelectedChannel: (id) =>
    set({ selectedChannel: id }),

  setSelectedDM: (id) =>
    set({
      selectedDM: id,
      selectedFriend: undefined,
      selectedGroup: undefined,
      selectedChannel: undefined,
      activeTab: 'dms',
    }),

  setUserSettings: (settings) =>
    set((state) => ({
      userSettings: { ...state.userSettings, ...settings },
    })),

  updateUserSetting: (key, value) =>
    set((state) => ({
      userSettings: { ...state.userSettings, [key]: value },
    })),

  setActiveModal: (modal, data) =>
    set({
      activeModal: modal,
      modalData: data,
    }),

  closeModal: () =>
    set({
      activeModal: undefined,
      modalData: undefined,
    }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  clearSearchQuery: () =>
    set({ searchQuery: '' }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  toggleMemberList: () =>
    set((state) => ({
      showMemberList: !state.showMemberList,
    })),

  resetSelections: () =>
    set({
      selectedFriend: undefined,
      selectedGroup: undefined,
      selectedChannel: undefined,
      selectedDM: undefined,
    }),

  resetUserSettings: () =>
    set({
      userSettings: { ...defaultUserSettings },
    }),
});

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      createUIStore,
      {
        name: 'vivon-ui-store',
        version: 1,
        partialize: (state) => ({
          userSettings: state.userSettings,
          sidebarCollapsed: state.sidebarCollapsed,
          showMemberList: state.showMemberList,
          activeTab: state.activeTab,
        }),
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            return {
              ...persistedState,
            };
          }
          return persistedState;
        },
      }
    ),
    { 
      name: 'UIStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Optimized selectors with shallow comparison for better performance
export const useTheme = () => useUIStore((state) => state.userSettings.theme);
export const useActiveTab = () => useUIStore((state) => state.activeTab);
export const useSearchQuery = () => useUIStore((state) => state.searchQuery);
export const useSidebarState = () => useUIStore((state) => ({
  collapsed: state.sidebarCollapsed,
  showMemberList: state.showMemberList,
}));

export const useSelectedItems = () => useUIStore((state) => ({
  selectedFriend: state.selectedFriend,
  selectedGroup: state.selectedGroup,
  selectedChannel: state.selectedChannel,
  selectedDM: state.selectedDM,
}));

export const useUserSettings = () => useUIStore((state) => state.userSettings);

export const useModal = () => useUIStore((state) => ({
  activeModal: state.activeModal,
  modalData: state.modalData,
}));

// Specialized selectors for common use cases
export const useIsModalOpen = (modalType?: string) => 
  useUIStore((state) => 
    modalType ? state.activeModal === modalType : state.activeModal !== undefined
  );

export const useUserSetting = <K extends keyof UserSettings>(key: K) =>
  useUIStore((state) => state.userSettings[key]);

// Action selectors (for better performance when you only need actions)
export const useUIActions = () => useUIStore((state) => ({
  setActiveTab: state.setActiveTab,
  setSelectedFriend: state.setSelectedFriend,
  setSelectedGroup: state.setSelectedGroup,
  setSelectedChannel: state.setSelectedChannel,
  setSelectedDM: state.setSelectedDM,
  setUserSettings: state.setUserSettings,
  updateUserSetting: state.updateUserSetting,
  setActiveModal: state.setActiveModal,
  closeModal: state.closeModal,
  setSearchQuery: state.setSearchQuery,
  clearSearchQuery: state.clearSearchQuery,
  toggleSidebar: state.toggleSidebar,
  toggleMemberList: state.toggleMemberList,
  resetSelections: state.resetSelections,
  resetUserSettings: state.resetUserSettings,
}));

// Subscription helpers for side effects (using store.subscribe directly)
export const subscribeToThemeChanges = (callback: (theme: UserSettings['theme']) => void) => {
  let previousTheme = useUIStore.getState().userSettings.theme;
  return useUIStore.subscribe((state) => {
    const currentTheme = state.userSettings.theme;
    if (currentTheme !== previousTheme) {
      previousTheme = currentTheme;
      callback(currentTheme);
    }
  });
};

export const subscribeToModalChanges = (callback: (modal: UIState['activeModal']) => void) => {
  let previousModal = useUIStore.getState().activeModal;
  return useUIStore.subscribe((state) => {
    const currentModal = state.activeModal;
    if (currentModal !== previousModal) {
      previousModal = currentModal;
      callback(currentModal);
    }
  });
};