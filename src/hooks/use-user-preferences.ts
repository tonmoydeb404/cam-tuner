import { useEffect, useState } from 'react';

interface UserPreferences {
  preferredTab: string;
  autoApplyChanges: boolean;
  showTooltips: boolean;
  compactMode: boolean;
  reducedMotion: boolean;
}

const defaultPreferences: UserPreferences = {
  preferredTab: 'common',
  autoApplyChanges: false,
  showTooltips: true,
  compactMode: false,
  reducedMotion: false,
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem('camtuner-preferences');
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  useEffect(() => {
    localStorage.setItem('camtuner-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
}

export default useUserPreferences;