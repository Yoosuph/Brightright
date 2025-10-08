/// <reference types="vite/client" />

// Ensure WindowEventMap is available globally
declare global {
  // Re-export the DOM WindowEventMap interface to make it accessible
  type WindowEventMap = {
    mousemove: MouseEvent;
    mousedown: MouseEvent;
    keydown: KeyboardEvent;
    touchstart: TouchEvent;
    scroll: Event;
  } & Record<string, Event>;
}

export {};