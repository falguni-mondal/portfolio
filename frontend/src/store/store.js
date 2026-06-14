import { create } from 'zustand';

export const useLabStore = create((set) => ({
  // Tracks which LabItem index is currently hovered. null means nothing is hovered.
  activeProject: null,
  setActiveProject: (index) => set({ activeProject: index }),

  // Tracks global mouse coordinates (normalized from -1 to 1 for WebGL)
  mouse: { x: 0, y: 0 },
  setMouse: (x, y) => set({ mouse: { x, y } }),
}));