import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, MapPin, Hourglass } from 'lucide-react';
import styles from './HeroContent.module.css';

export const HeroContent = () => {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const detailsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1.1 },
      });

      tl.fromTo(
        badgeRef.current,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.15 }
      )
        .fromTo(
          logoRef.current,
          { x: -50, opacity: 0, scale: 0.94 },
          { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
          '-=0.7'
        )
        .fromTo(
          titleRef.current,
          { x: -35, opacity: 0 },
          { x: 0, opacity: 1 },
          '-=0.8'
        )
        .fromTo(
          descRef.current,
          { x: -25, opacity: 0 },
          { x: 0, opacity: 1 },
          '-=0.7'
        )
        .fromTo(
          detailsRef.current ? detailsRef.current.children : [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.5'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.contentSection}>
      {/* Event Badge */}
      <div ref={badgeRef} className={styles.eventBadge}>
        <span className={styles.badgeStar}>✦</span>
        <span>معارض ملابس - رسالة للخير دايماً عنوان</span>
      </div>

      {/* Main TikTak Logo */}
      <div ref={logoRef} className={styles.logoWrapper}>
        <img
          src="/tiktakLogo.png"
          alt="TikTak Event Logo"
          className={styles.tiktakLogo}
        />
      </div>

      {/* Slogan */}
      <h1 ref={titleRef} className={styles.mainSlogan}>
        حفلة معارض <span className={styles.goldText}>مدينة نصر</span>
      </h1>

      {/* Description */}
      <p ref={descRef} className={styles.subDescription}>
        رحلة استثنائية عبر الزمن في أضخم حدث للمعارض والفعاليات! اكتشف عوالم
        جديدة، مفاجآت حصرية، وتجارب سحرية بانتظارك.
      </p>

      {/* Event Info Details */}
      <div ref={detailsRef} className={styles.eventDetailsRow}>
        <div className={styles.infoPill}>
          <Calendar className={styles.infoLucideIcon} size={18} />
          <span>4 سبتمبر 2026</span>
        </div>
        <div className={styles.infoPill}>
          <MapPin className={styles.infoLucideIcon} size={18} />
          <span>مدينة نصر - القاهرة</span>
        </div>
        <div className={styles.infoPill}>
          <Hourglass className={styles.infoLucideIcon} size={18} />
          <span>04:00 مساءً</span>
        </div>
      </div>


      {/* CTA Buttons */}
      <div ref={ctaRef} className={styles.actionButtonsGroup}>
        <a href="#register" className={styles.primaryCta}>
          <span>احجز حضورك الآن</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
        </a>

        <a href="#about" className={styles.secondaryCta}>
          <span>اكتشف الفعاليات</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default HeroContent;
