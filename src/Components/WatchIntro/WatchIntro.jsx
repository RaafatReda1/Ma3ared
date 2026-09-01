import React, { useEffect, useRef, Suspense } from 'react';
import gsap from 'gsap';
import WatchScene from './WatchScene';
import styles from './WatchIntro.module.css';

// Story-section narrative lines
const TEXT_LINES = [
  { text: 'في لحظات بتكون مجرد دقيقة في يوم عادي', gold: false, delay: 0.4 },
  { text: 'ولحظات تانية بتفضل فاكرها مهما عدى عليها وقت', gold: false, delay: 1.2 },
  { text: 'الوقت هو الحكايات اللي بنعيشها', gold: false, delay: 2.0 },
  { text: 'واللحظات اللي بنقول بعدها: "هنا كل حاجة اتغيرت"', gold: true, delay: 2.8 },
];

// Floating objects config matching HeroSection


export default function WatchIntro({ onDone }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const skipRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const textRefs = useRef([]);
  const floatRefs = useRef({});
  const exitedRef = useRef(false);

  const registerFloat = (key) => (el) => {
    if (el) floatRefs.current[key] = el;
  };

  // ─── Smooth Glide Exit Sequence ──────────────────────────────────
  const runExit = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onDone) onDone();
      },
    });

    // 1. Text, Skip Button, and Logo fade out gracefully
    tl.to([...textRefs.current, skipRef.current, logoRef.current], {
      opacity: 0,
      y: -15,
      duration: 0.45,
      stagger: 0.04,
      ease: 'power2.in',
    });

    // 2. Smoothly Glide the 3D Watch to Ma3ared Man's hand on the right side of the screen
    if (canvasWrapRef.current) {
      const isMobile = window.innerWidth <= 768;
      const targetX = isMobile ? 0 : window.innerWidth * 0.22;
      const targetY = isMobile ? window.innerHeight * 0.15 : window.innerHeight * 0.08;
      const targetScale = isMobile ? 0.7 : 0.65;

      tl.to(
        canvasWrapRef.current,
        {
          x: targetX,
          y: targetY,
          scale: targetScale,
          duration: 1.1,
          ease: 'power3.inOut',
        },
        '-=0.3'
      );
    }

    // 3. Fly floating objects toward their corresponding Hero visual sectors

    // 4. Fade out overlay backdrop smoothly to unveil Hero Section
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      '-=0.45'
    );
  };

  // ─── Entrance Animations ──────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Top Logo entrance - perfectly centered horizontally
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -20, xPercent: -50 },
        {
          opacity: 1,
          y: -30,
          xPercent: -50,
          duration: 0.85,
          delay: 0.2,
          ease: 'power3.out',
        }
      );

      // 2. Floating objects smooth entrance
      // FLOAT_OBJECTS.forEach(({ key, enterDelay }) => {
      //   const el = floatRefs.current[key];
      //   if (!el) return;
      //   gsap.fromTo(
      //     el,
      //     { opacity: 0, scale: 0.6, y: 25 },
      //     {
      //       opacity: 1,
      //       scale: 1,
      //       y: 0,
      //       duration: 1.1,
      //       delay: enterDelay,
      //       ease: 'power3.out',
      //     }
      //   );
      // });

      // 3. Staggered narrative lines
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: TEXT_LINES[i]?.delay ?? i * 0.7,
          ease: 'power3.out',
        });
      });

      // 4. Skip button entrance - perfectly centered horizontally
      gsap.fromTo(
        skipRef.current,
        { opacity: 0, xPercent: -50 },
        {
          opacity: 1,
          xPercent: -50,
          duration: 0.6,
          delay: 1.8,
          ease: 'power2.out',
        }
      );

      // 5. Full rotation sequence concludes at 10s then triggers smooth glide
      const timer = setTimeout(runExit, 10000);
      return () => clearTimeout(timer);
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={overlayRef} className={styles.overlay}>
      {/* Background ambient lighting */}
      <div className={styles.bgGlow} />
      <div className={styles.bgParticles} />

      {/* Top Logo */}
      <div ref={logoRef} className={styles.topLogo}>
        <img src="/logoMa3ared.png" alt="معارض مدينة نصر" />
      </div>

      {/* Floating objects layer */}
      {/* <div className={styles.floatingLayer}>
        {FLOAT_OBJECTS.map(({ key, src, alt, cls, anim }) => (
          <div
            key={key}
            ref={registerFloat(key)}
            className={`${styles.floatItem} ${cls}`}
          >
            <div className={anim}>
              <img src={src} alt={alt} />
            </div>
          </div>
        ))}
      </div> */}

      {/* 3D Pocket Watch Canvas Container */}
      <div ref={canvasWrapRef} className={styles.canvasWrap}>
        <div className={styles.watchHalo} />
        <Suspense fallback={null}>
          <WatchScene isHeroMode={false} />
        </Suspense>
      </div>

      {/* Story Narrative Text Lines */}
      <div className={styles.textBlock}>
        {TEXT_LINES.map((line, i) => (
          <p
            key={i}
            ref={(el) => { textRefs.current[i] = el; }}
            className={`${styles.textLine} ${line.gold ? styles.goldLine : ''}`}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* Skip Button */}
      <button
        ref={skipRef}
        className={styles.skipBtn}
        onClick={runExit}
        style={{ opacity: 0 }}
      >
        تخطي
      </button>
    </div>
  );
}
