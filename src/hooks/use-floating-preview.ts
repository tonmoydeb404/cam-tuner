import { useEffect, useState } from 'react';

interface FloatingPreviewState {
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

const STORAGE_KEY = 'camtuner-floating-preview';

const defaultState: FloatingPreviewState = {
  isVisible: false,
  position: { x: 50, y: 50 },
  size: { width: 320, height: 240 },
  isMinimized: false,
};

export function useFloatingPreview() {
  const [state, setState] = useState<FloatingPreviewState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showPreview = () => {
    setState(prev => ({ ...prev, isVisible: true }));
  };

  const hidePreview = () => {
    setState(prev => ({ ...prev, isVisible: false }));
  };

  const togglePreview = () => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const updatePosition = (position: { x: number; y: number }) => {
    setState(prev => ({ ...prev, position }));
  };

  const updateSize = (size: { width: number; height: number }) => {
    setState(prev => ({ ...prev, size }));
  };

  const toggleMinimize = () => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const resetPosition = () => {
    setState(prev => ({ ...prev, position: defaultState.position }));
  };

  return {
    ...state,
    showPreview,
    hidePreview,
    togglePreview,
    updatePosition,
    updateSize,
    toggleMinimize,
    resetPosition,
  };
}

export default useFloatingPreview;