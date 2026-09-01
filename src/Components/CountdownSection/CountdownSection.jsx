import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowLeft } from 'lucide-react';
import styles from './CountdownSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export const CountdownSection = () => {
  const sectionRef = useRef(null);
  const keyRef = useRef(null);
  const watchRef = useRef(null);
  const timerGridRef = useRef(null);

  // Target event date: September 4, 2026 16:00:00
  const targetDate = new Date('2026-09-04T16:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth parallax drift for background key
      if (keyRef.current) {
        gsap.to(keyRef.current, {
          y: '+=35',
          rotation: -10,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Smooth parallax drift for background watch
      if (watchRef.current) {
        gsap.to(watchRef.current, {
          y: '-=30',
          rotation: 8,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }

      // Entrance animation for timer
      if (timerGridRef.current) {
        gsap.fromTo(
          timerGridRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="exhibitions" className={styles.countdownSection}>
      {/* Background Floating Objects */}
      <img
        ref={keyRef}
        src="/key.png"
        alt="مفتاح ذهبي"
        className={`${styles.floatingBgObj} ${styles.keyBg}`}
      />
      <img
        ref={watchRef}
        src="/sandWatch.png"
        alt="ساعة رملية"
        className={`${styles.floatingBgObj} ${styles.watchBg}`}
      />

      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerGroup}>
          <div className={styles.badge}>
            <Clock size={16} className={styles.badgeIcon} />
            <span>العد التنازلي المباشر</span>
          </div>
          <h2 className={styles.title}>
            خلي عينك على الساعة.. <br />
            يمكن أجمل لحظة <span className={styles.goldText}>لسه مجتش</span>
          </h2>
          <p className={styles.subtitle}>
            مستنينكم في حفلة معارض مدينة نصر يوم الجمعة 4 سبتمبر 2026 علشان نعيش اللحظة… ونعرف السر ورا اسم الحفلة
          </p>
        </div>

        {/* Clean Professional Timer Display */}
        <div ref={timerGridRef} className={styles.timerGrid}>
          {/* Days */}
          <div className={styles.timerCard}>
            <span className={styles.digit}>
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className={styles.label}>أيام</span>
          </div>

          <span className={styles.colon}>:</span>

          {/* Hours */}
          <div className={styles.timerCard}>
            <span className={styles.digit}>
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className={styles.label}>ساعات</span>
          </div>

          <span className={styles.colon}>:</span>

          {/* Minutes */}
          <div className={styles.timerCard}>
            <span className={styles.digit}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className={styles.label}>دقائق</span>
          </div>

          <span className={styles.colon}>:</span>

          {/* Seconds */}
          <div className={styles.timerCard}>
            <span className={styles.digit}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className={styles.label}>ثواني</span>
          </div>
        </div>

        {/* Hashtag & CTA */}
        <div className={styles.actionRow}>
          <span className={styles.hashtag}>#Tik_Tak_15</span>
          <a href="#tickets" className={styles.primaryCta}>
            <span>احجز حضورك الآن</span>
            <ArrowLeft size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
