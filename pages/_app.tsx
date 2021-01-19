import React from 'react';
import '../styles/main.scss';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { ThemeProvider } from 'next-themes';


function App({Component, pageProps}: AppProps) {
  return (
    <ThemeProvider defaultTheme='system'>
      <NextNProgress color='#5E56D0' height={4}/>
      <Component {...pageProps}/>
    </ThemeProvider>

  );
}

export default App;
