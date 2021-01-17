import React, { useState } from 'react';
import '../styles/main.scss';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { ThemeContext, TTheme } from '../context/ThemeContext';

const THEME = 'theme';

function App({Component, pageProps}: AppProps) {
  const [theme, setTheme] = useState<TTheme>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    localStorage.setItem(THEME, JSON.stringify(theme));
    console.log('state:', theme);
  };

  // useEffect(() => {
  //   // если приложение на клиенте, то заберем текущую тему из localStorage
  //   if (typeof window !== 'undefined') {
  //     const currentTheme = JSON.parse(localStorage.getItem(THEME) as TTheme);
  //     if (!currentTheme) {
  //       localStorage.setItem(THEME, JSON.stringify(theme));
  //     } else {
  //       setTheme(currentTheme as TTheme);
  //     }
  //   }
  // }, []);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <NextNProgress color='#5E56D0' height={4}/>
      <Component {...pageProps}/>
    </ThemeContext.Provider>
  );
}

export default App;
