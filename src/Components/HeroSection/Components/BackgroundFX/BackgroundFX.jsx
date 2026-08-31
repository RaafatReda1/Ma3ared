import React from 'react';
import styles from './BackgroundFX.module.css';

export const BackgroundFX = () => {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.leftVignette} />
      <div className={styles.topVignette} />
      <div className={styles.bottomVignette} />
      <div className={styles.ambientGoldGlow} />
    </div>
  );
};

export default BackgroundFX;
