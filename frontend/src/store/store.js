// src/store/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import initialData from '../data.json';

export const useLabStore = create(
  persist(
    (set) => ({
      activeProject: null,
      setActiveProject: (index) => set({ activeProject: index }),

      mouse: { x: 0, y: 0 },
      setMouse: (x, y) => set({ mouse: { x, y } }),

      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      // Live Portfolio Data (Seeded with local data.json, updated from admin.byfalguni.com)
      portfolioData: initialData,
      setPortfolioData: (newData) =>
        set((state) => ({
          portfolioData: { ...state.portfolioData, ...newData },
        })),
    }),
    {
      name: 'portfolio-theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);