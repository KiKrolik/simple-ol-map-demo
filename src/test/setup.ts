import "@testing-library/jest-dom";

// Mock ResizeObserver
(globalThis as any).ResizeObserver = function ResizeObserver() {
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  };
};

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = function IntersectionObserver() {
  return {
    observe: () => {},
    disconnect: () => {},
    unobserve: () => {},
  };
};

// Mock requestAnimationFrame
(globalThis as any).requestAnimationFrame = (
  callback: FrameRequestCallback
) => {
  return setTimeout(callback, 0);
};

(globalThis as any).cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};
