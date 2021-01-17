import React from 'react';
import '../styles/main.scss';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';

function App({Component, pageProps}: AppProps) {
  return (
    <>
      <NextNProgress color='#5E56D0' height={4}/>
      <Component {...pageProps}/>
    </>
  );
}

export default App;
