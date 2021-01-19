import React, { useEffect, useState } from 'react';
import Toggle from 'react-toggle';
import { Night } from './Night';
import { Day } from './Day';
import { useTheme } from 'next-themes';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <label>
      <Toggle
        checked={theme === 'dark'}
        icons={{
          checked: <Night/>,
          unchecked: <Day/>,
        }}
        onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </label>
  );
};
