import { createContext } from 'react';

// export const themes = {
//   light: {
//     primary: 'rgb(94, 86, 208)',
//     secondary: 'rgba(94, 86, 208, 0.8)',
//     background: '#FFF',
//     text: '#333333',
//     title: 'rgb(94, 86, 208)',
//     $link: 'rgb(94, 86, 208)',
//     $inlineCodeBg: 'rgba(255, 233, 159, 0.3)',
//     $inlineCodeText: '#333333',
//   },
//   dark: {
//     primary: 'rgb(94, 86, 208)',
//     secondary: 'rgba(94, 86, 208, 0.8)',
//     background: '#FFF',
//     text: '#333333',
//     title: 'rgb(94, 86, 208)',
//     $link: 'rgb(94, 86, 208)',
//     $inlineCodeBg: 'rgba(255, 233, 159, 0.3)',
//     $inlineCodeText: '#333333',
//   },
// };

export type TTheme = 'light' | 'dark'

interface IThemeContext {
  theme: TTheme
  toggleTheme: () => void
}

export const ThemeContext = createContext<IThemeContext>({
  theme: 'light', toggleTheme: () => {
  },
});
