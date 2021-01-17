import React, { useContext, useEffect } from 'react';
import styles from './themeswitch.module.scss';
import { ThemeContext } from '../../../context/ThemeContext';

export const ThemeSwitch = () => {
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    console.log('context:', themeContext.theme);
    console.log('====================================')
  }, [themeContext]);

  return (
    <label className={styles.label} htmlFor="toggle">
      <input
        className={styles.input}
        type="checkbox"
        checked={themeContext.theme !== 'light'}
        onChange={() => themeContext.toggleTheme()}
      />
      <svg className={styles.svg} viewBox="0 0 100 45" width="400" height="180">
        <defs>
          <rect id="background" x="0" y="0" width="90" height="40" rx="20"/>

          <clipPath id="clip">
            <use href="#background"/>
          </clipPath>

          <linearGradient id="gradient-light" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#8bc8f2" offset="0"/>
            <stop stopColor="#fff" offset="1"/>
          </linearGradient>

          <filter id="blur-light">
            <feGaussianBlur stdDeviation="1"/>
          </filter>

          <pattern id="pattern-light" width="0.1" height="1" viewBox="0 0 10 45">
            <path fill="#40b5f8" d="M 0 0 a 6 6 0 0 0 10 0 v 45 h -10 z"/>
          </pattern>

          <linearGradient id="gradient-dark" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#1F2241" offset="0"/>
            <stop stopColor="#7D59DF" offset="1"/>
          </linearGradient>

          <linearGradient id="gradient-mask" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#000" offset="0"/>
            <stop stopColor="#fff" offset="1"/>
          </linearGradient>

          <mask id="mask-dark">
            <use fill="url(#gradient-mask)" href="#background"/>
          </mask>

          <radialGradient id="gradient-moon">
            <stop stopColor="#fdfdfd" offset="0.7"/>
            <stop stopColor="#e2e2e2" offset="1"/>
          </radialGradient>

          <radialGradient id="gradient-crater">
            <stop stopColor="#e0e0e0" offset="0"/>
            <stop stopColor="#d9d9d9" offset="1"/>
          </radialGradient>

          <pattern id="pattern-dark" width="0.2" height="1" viewBox="0 0 20 45">
            <path fill="#fff" d="M 2 5 l 1 1 l -1 1 l -1 -1 l 1 -1"/>
            <path fill="#fff" d="M 10 16 l 1 1 l -1 1 l -1 -1 l 1 -1"/>
            <path fill="#fff" d="M 16 27 l 1 1 l -1 1 l -1 -1 l 1 -1"/>
            <path fill="#fff" d="M 10 38 l 1 1 l -1 1 l -1 -1 l 1 -1"/>
          </pattern>
        </defs>

        <g transform="translate(5 2.5)">
          <g clipPath="url(#clip)">
            <g className={styles.dark}>
              <use fill="url(#gradient-dark)" href="#background"/>

              <g className={styles.background} transform="translate(0 -40) scale(1 0.4)">
                <rect
                  transform="translate(-40 0) rotate(4)"
                  fill="url(#pattern-dark)"
                  x="0" y="0"
                  width="100"
                  height="45"
                />
              </g>
              <use mask="url(#mask-dark)" fill="url(#gradient-dark)" href="#background"/>
            </g>
            <g className={styles.light}>
              <use fill="url(#gradient-light)" href="#background"/>

              <g className={styles.background} transform="translate(-30 -20)">
                <g transform="translate(30 20)">
                  <rect fill="url(#pattern-light)" x="-5" y="27.5" width="100" height="45"/>
                </g>
              </g>
            </g>
          </g>
        </g>

        <g transform="translate(77.5 22.5)">

          <g className={styles.translate} transform="translate(-55)">
            <g className={styles.rotate} transform="rotate(-100)">
              <g className={styles.dark}>
                <circle fill="url(#gradient-moon)" cx="0" cy="0" r="20.5"/>
                <g transform="translate(-8 -7.5)">
                  <ellipse
                    transform="rotate(-30)"
                    fill="url(#gradient-crater)"
                    stroke="#d5d5d5"
                    strokeWidth="0.2"
                    cx="0"
                    cy="0"
                    rx="4"
                    ry="3"
                  />
                </g>
                <g transform="translate(11 5)">
                  <ellipse
                    fill="url(#gradient-crater)"
                    stroke="#d5d5d5"
                    strokeWidth="0.2"
                    cx="0"
                    cy="0"
                    rx="3.85"
                    ry="4"
                  />
                </g>
                <g transform="translate(-6 12)">
                  <ellipse
                    transform="rotate(-10)"
                    fill="url(#gradient-crater)"
                    stroke="#d5d5d5"
                    strokeWidth="0.2"
                    cx="0"
                    cy="0"
                    rx="2"
                    ry="1.75"
                  />
                </g>
              </g>
            </g>
            <g className={styles.light}>
              <circle fill="#FFD21F" cx="0" cy="0" r="21" filter="url(#blur-light)"/>
              <circle fill="#FFD21F" cx="0" cy="0" r="20.5"/>
            </g>
          </g>
        </g>
      </svg>
    </label>
  );
};
