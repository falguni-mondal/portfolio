import { create } from 'zustand';

export const useLabStore = create((set) => ({
  // Tracks which LabItem index is currently hovered
  activeProject: null,
  setActiveProject: (index) => set({ activeProject: index }),

  // Tracks global mouse coordinates
  mouse: { x: 0, y: 0 },
  setMouse: (x, y) => set({ mouse: { x, y } }),

  // GLOBAL THEME STATE
  theme: 'dark',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),
}));