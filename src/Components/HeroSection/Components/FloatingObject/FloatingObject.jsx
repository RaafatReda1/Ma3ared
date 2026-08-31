import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './FloatingObject.module.css';

export const FloatingObject = ({
  src,
  alt,
  className = '',
  style = {},
  fromVars = { x: 60, y: -40, rotation: 20, opacity: 0, scale: 0.6 },
  toVars = { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 },
  delay = 0.3,
  animType = 'floatAnim1',
}) => {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { ...fromVars },
      {
        ...toVars,
        duration: 1.4,
        delay,
        ease: 'back.out(1.3)',
      }
    );
  }, [delay, fromVars, toVars]);

  return (
    <div
      ref={elRef}
      className={`${styles.floatingWrapper} ${className}`}
      style={style}
    >
      <div className={`${styles.floatingInner} ${styles[animType] || styles.floatAnim1}`}>
        <img src={src} alt={alt} className={styles.floatingImage} />
      </div>
    </div>
  );
};

export default FloatingObject;
