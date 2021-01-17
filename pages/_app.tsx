import React from 'react';
import '../styles/main.scss';
import { AppProps } from 'next/app';

function App({Component, pageProps}: AppProps) {
  return <Component {...pageProps}/>;
}

export default App;
