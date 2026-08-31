import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './FloatingObject.module.css';

export const FloatingObject = ({
  src,
  alt,
  className = '',
  style = {},
  fromVars = { x: 50, y: -30, opacity: 0, scale: 0.8 },
  toVars = { x: 0, y: 0, opacity: 1, scale: 1 },
  delay = 0.4,
  animType = 'floatAnim1',
}) => {
  const elRef = useRef(null);
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Smooth single entrance
    gsap.fromTo(
      el,
      { ...fromVars, opacity: 0 },
      {
        ...toVars,
        duration: 1.4,
        delay,
        ease: 'power3.out',
        onComplete: () => {
          setIsEntered(true);
        },
      }
    );
  }, [delay, fromVars, toVars]);

  return (
    <div
      ref={elRef}
      className={`${styles.floatingWrapper} ${className}`}
      style={style}
    >
      <div
        className={`${styles.floatingInner} ${
          isEntered ? styles[animType] || styles.floatAnim1 : ''
        }`}
      >
        <img src={src} alt={alt} className={styles.floatingImage} />
      </div>
    </div>
  );
};

export default FloatingObject;
