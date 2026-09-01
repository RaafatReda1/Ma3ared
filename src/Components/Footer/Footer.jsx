import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Code2,
  Sparkles,
  ArrowUp,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

const DEVELOPERS = [
  {
    name: 'Rafat Shahin',
    link: 'https://www.facebook.com/raafat.reda.366930',
  },
  {
    name: 'Ali Eldeep',
    link: 'https://www.facebook.com/share/18E9nr66td/',
  },
];

const NAV_LINKS = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'عن الحكاية والفعالية', href: '#story' },
  { label: 'العد التنازلي', href: '#countdown' },
  { label: 'تسجيل الحضور والمشاركة', href: '#tickets' },
];

export const Footer = () => {
  const footerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className={styles.footerWrapper}>
      {/* Ambient Lighting */}
      <div className={styles.ambientGlow} />
      <div className={styles.ambientGlowBlue} />

      <div className={styles.container}>
        {/* Main 3-Column Grid */}
        <div ref={gridRef} className={styles.footerGrid}>
          {/* Column 1: Brand & About */}
          <div className={styles.brandCol}>
            <a href="#home" className={styles.logoWrap}>
              <img
                src="/logoMa3ared.png"
                alt="معارض مدينة نصر 2026"
                className={styles.footerLogo}
              />
            </a>
            <p className={styles.brandDesc}>
              حفلة معارض مدينة نصر 2026 — أضخم تجمع للمعارض والفعاليات في تجربة
              استثنائية تجمع بين الإبداع، التنظيم، وصناعة الأثر الإيجابي.
            </p>
            <div className={styles.sloganBadge}>
              <Sparkles size={14} className={styles.starIcon} />
              <span>رسالة للخير دايماً عنوان</span>
            </div>
          </div>

          {/* Column 2: Event Details */}
          <div>
            <h3 className={styles.colTitle}>
              <Calendar size={18} className={styles.titleIcon} />
              <span>تفاصيل الفعالية</span>
            </h3>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <Calendar size={18} className={styles.infoItemIcon} />
                <div>
                  <strong>تاريخ الحدث</strong>
                  <span>الجمعة، 4 سبتمبر 2026</span>
                </div>
              </li>
              <li className={styles.infoItem}>
                <Clock size={18} className={styles.infoItemIcon} />
                <div>
                  <strong>التوقيت</strong>
                  <span>من الساعة 01:00 ظهرًا (1:00 PM)</span>
                </div>
              </li>
              <li className={styles.infoItem}>
                <MapPin size={18} className={styles.infoItemIcon} />
                <div>
                  <strong>الموقع</strong>
                  <span>مدينة نصر، القاهرة</span>
                </div>
              </li>
              <li className={styles.infoItem}>
                <ShieldCheck size={18} className={styles.infoItemIcon} />
                <div>
                  <strong>الدخول والمشاركة</strong>
                  <span>مجاني بتسجيل مسبق عبر الموقع</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h3 className={styles.colTitle}>
              <Sparkles size={18} className={styles.titleIcon} />
              <span>روابط سريعة</span>
            </h3>
            <ul className={styles.navLinksList}>
              {NAV_LINKS.map((link, i) => (
                <li key={i} className={styles.navLinkItem}>
                  <a href={link.href}>
                    <ChevronLeft size={14} className={styles.linkBullet} />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.footerDivider} />

        {/* Bottom Bar with Integrated Professional Dev Credits */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>
            © 2026 جميع الحقوق محفوظة — معارض مدينة نصر
          </p>

          {/* Clean Integrated Developer Credits */}
          <div className={styles.devCreditsGroup}>
            <div className={styles.devCreditsInner}>
              <Code2 size={15} className={styles.codeIcon} />
              <span className={styles.devPrefix}>تطوير وبرمجة:</span>
              <div className={styles.devLinksWrapper}>
                {DEVELOPERS.map((dev, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className={styles.devDivider}>•</span>}
                    <a
                      href={dev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.devInlineLink}
                      title={`Facebook: ${dev.name}`}
                    >
                      <span>{dev.name}</span>
                      <ExternalLink size={12} className={styles.devExtIcon} />
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            title="العودة للأعلى"
            aria-label="العودة لأعلى الصفحة"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
