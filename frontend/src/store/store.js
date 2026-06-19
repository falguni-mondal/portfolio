import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLabStore = create(
  persist(
    (set) => ({
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
    }),
    {
      // The key name in localStorage
      name: 'portfolio-theme-storage', 
      
      // ONLY save the theme to localStorage. 
      // We don't want to save mouse coordinates or active projects.
      partialize: (state) => ({ theme: state.theme }), 
    }
  )
);