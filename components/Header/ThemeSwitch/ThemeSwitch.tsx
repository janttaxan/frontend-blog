import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import Toggle from 'react-toggle';
import { Night } from './Night';
import { Day } from './Day';

export const ThemeSwitch = () => {
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    console.log('context:', themeContext.theme);
    console.log('====================================');
  }, [themeContext]);

  return (
    <label>
      <Toggle
        defaultChecked={themeContext.theme === 'light'}
        icons={{
          checked: <Night/>,
          unchecked: <Day/>,
        }}
        onChange={themeContext.toggleTheme}/>
    </label>
  );
};
