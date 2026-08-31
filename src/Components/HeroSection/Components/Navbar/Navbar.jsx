import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, delay: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <header ref={navRef} className={styles.navbar}>
      <div className={styles.brandBadge}>
        <span>✦</span> معارض مدينة نصر 2026
      </div>

      <nav>
        <ul className={styles.navLinks}>
          <li>
            <a href="#home" className={styles.active}>
              الرئيسية
            </a>
          </li>
          <li>
            <a href="#about">عن الحفلة</a>
          </li>
          <li>
            <a href="#exhibitions">المعارض</a>
          </li>
          <li>
            <a href="#contact">تواصل معنا</a>
          </li>
        </ul>
      </nav>

      <div>
        <a href="#tickets" className={styles.vipBtn}>
          حجز VIP
        </a>
      </div>
    </header>
  );
};

export default Navbar;
