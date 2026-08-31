import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import FloatingObject from '../FloatingObject/FloatingObject';
import styles from './HeroVisual.module.css';

export const HeroVisual = () => {
  const characterRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const char = characterRef.current;
    const ring = ringRef.current;

    const ctx = gsap.context(() => {
      // Backdrop ring fade in
      if (ring) {
        gsap.to(ring, {
          opacity: 1,
          duration: 1.5,
          delay: 0.1,
          ease: 'power2.out',
        });
      }

      // Smooth character entrance
      if (char) {
        gsap.fromTo(
          char,
          { x: 80, y: 20, opacity: 0, scale: 0.96 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            delay: 0.2,
            ease: 'power3.out',
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.visualSection}>
      {/* Decorative Golden Ring */}
      <div ref={ringRef} className={styles.magicRingBackdrop} />

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

      {/* 1. Sand Watch / Hourglass */}
      <FloatingObject
        src="/sandWatch.png"
        alt="ساعة رملية ذهبية"
        className={styles.sandWatch}
        fromVars={{ x: -80, y: -20, opacity: 0, scale: 0.7 }}
        toVars={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        delay={0.35}
        animType="floatAnim1"
      />

      {/* 2. Antique Key */}
      <FloatingObject
        src="/key.png"
        alt="مفتاح الزمن الذهبي"
        className={styles.keyObject}
        fromVars={{ x: 80, y: -60, opacity: 0, scale: 0.6 }}
        toVars={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        delay={0.5}
        animType="floatAnim2"
      />

      {/* 3. Open Magic Book */}
      <FloatingObject
        src="/book2.png"
        alt="كتاب المعرفة المفتوح"
        className={styles.openBook}
        fromVars={{ x: 90, y: 70, opacity: 0, scale: 0.7 }}
        toVars={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        delay={0.65}
        animType="floatAnim3"
      />

      {/* 4. Vintage Closed Book */}
      <FloatingObject
        src="/book.png"
        alt="كتاب الأسرار"
        className={styles.closedBook}
        fromVars={{ x: -50, y: -70, opacity: 0, scale: 0.6 }}
        toVars={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        delay={0.75}
        animType="floatAnim1"
      />
    </div>
  );
};

export default HeroVisual;
