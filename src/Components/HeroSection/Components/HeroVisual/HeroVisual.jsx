import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import FloatingObject from '../FloatingObject/FloatingObject';
import styles from './HeroVisual.module.css';

export const HeroVisual = () => {
  const characterRef = useRef(null);

  useEffect(() => {
    const el = characterRef.current;
    if (!el) return;

    // Smooth GSAP entrance from right
    gsap.fromTo(
      el,
      { x: 90, opacity: 0, scale: 0.95 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        delay: 0.2,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className={styles.visualSection}>
      {/* Decorative Golden Ring */}
      <div className={styles.magicRingBackdrop} />

      {/* Ma3ared Man Character */}
      <div className={styles.characterContainer}>
        <div ref={characterRef} className={styles.manImageWrapper}>
          <img
            src="/ma3aredManHeroSection.png"
            alt="معارض مان - بطل الفعالية"
            className={styles.manImage}
          />
        </div>
      </div>

      {/* 1. Sand Watch / Hourglass - Flying in from mid-left */}
      <FloatingObject
        src="/sandWatch.png"
        alt="ساعة رملية ذهبية"
        className={styles.sandWatch}
        fromVars={{ x: -100, y: -30, rotation: -25, opacity: 0, scale: 0.5 }}
        toVars={{ x: 0, y: 0, rotation: -8, opacity: 1, scale: 1 }}
        delay={0.4}
        animType="floatAnim1"
      />

      {/* 2. Antique Key - Flying in from top-right */}
      <FloatingObject
        src="/key.png"
        alt="مفتاح الزمن الذهبي"
        className={styles.keyObject}
        fromVars={{ x: 100, y: -80, rotation: 50, opacity: 0, scale: 0.4 }}
        toVars={{ x: 0, y: 0, rotation: 28, opacity: 1, scale: 1 }}
        delay={0.55}
        animType="floatAnim2"
      />

      {/* 3. Open Magic Book - Flying in from bottom-right */}
      <FloatingObject
        src="/book2.png"
        alt="كتاب المعرفة المفتوح"
        className={styles.openBook}
        fromVars={{ x: 110, y: 90, rotation: 20, opacity: 0, scale: 0.5 }}
        toVars={{ x: 0, y: 0, rotation: -6, opacity: 1, scale: 1 }}
        delay={0.7}
        animType="floatAnim3"
      />

      {/* 4. Vintage Closed Book - Flying in from top-left */}
      <FloatingObject
        src="/book.png"
        alt="كتاب الأسرار"
        className={styles.closedBook}
        fromVars={{ x: -60, y: -90, rotation: -30, opacity: 0, scale: 0.4 }}
        toVars={{ x: 0, y: 0, rotation: 12, opacity: 1, scale: 1 }}
        delay={0.8}
        animType="floatAnim1"
      />
    </div>
  );
};

export default HeroVisual;
