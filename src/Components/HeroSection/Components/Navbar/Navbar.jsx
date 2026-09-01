import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar appears near/at the end of HeroSection (e.g. scroll position >= 60% viewport height or 350px)
      const heroThreshold = Math.max(300, window.innerHeight * 0.65);
      if (window.scrollY >= heroThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.navbar} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.navContainer}>
        <div className={styles.brandBadge}>
          <span>✦</span> معارض مدينة نصر 2026
        </div>

        <nav className={styles.desktopNav}>
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

        <div className={styles.navActions}>
          <a href="#tickets" className={styles.vipBtn}>
            احجز مقعدك
          </a>

          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="فتح القائمة"
          >
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavLinks}>
            <li>
              <a href="#home" onClick={() => setMobileMenuOpen(false)}>
                الرئيسية
              </a>
            </li>
            <li>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>
                عن الحفلة
              </a>
            </li>
            <li>
              <a href="#exhibitions" onClick={() => setMobileMenuOpen(false)}>
                المعارض
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                تواصل معنا
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

