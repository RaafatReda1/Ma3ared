import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Ticket, LogOut } from 'lucide-react';
import { supabase } from '../../../../utils/Supabase';
import { getLocalTicket, signInWithGoogle, signOutUser } from '../../../Form/Actions';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hasTicket, setHasTicket] = useState(false);

  useEffect(() => {
    // Check initial auth & local ticket
    const checkAuthAndTicket = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUser(authData.user);
      }

      const ticket = getLocalTicket();
      if (ticket) {
        setHasTicket(true);
      }
    };

    checkAuthAndTicket();

    // Listen to Supabase auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    const handleScroll = () => {
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const isUserRegistered = user || hasTicket;

  return (
    <header className={`${styles.navbar} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.navContainer}>
        {/* Brand Logo */}
        <div className={styles.brandBadge}>
          <img
            src="/logoMa3ared.png"
            alt="معارض مدينة نصر"
            className={styles.navLogoImg}
          />
        </div>

        {/* Desktop Navigation */}
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
              <a href="#tickets">
                {isUserRegistered ? 'تعديل بياناتك' : 'الحجز والمشاركة'}
              </a>
            </li>
          </ul>
        </nav>

        {/* Actions, Auth & Profile */}
        <div className={styles.navActions}>
          {user ? (
            /* User Profile & Logout */
            <div className={styles.userProfileGroup}>
              <div className={styles.profileBadge} title={user.email}>
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'المستخدم'}
                    className={styles.userAvatarImg}
                  />
                ) : (
                  <div className={styles.userAvatarFallback}>
                    <User size={16} />
                  </div>
                )}
                <span className={styles.userNameText}>
                  {user.user_metadata?.full_name?.split(' ')[0] || 'حسابك'}
                </span>
              </div>
              <button
                className={styles.logoutBtn}
                onClick={signOutUser}
                title="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            /* Google Sign-In Button in Navbar */
            <button
              className={styles.navGoogleBtn}
              onClick={signInWithGoogle}
              title="تسجيل الدخول بواسطة Google"
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>دخول Google</span>
            </button>
          )}

          {/* Dynamic VIP CTA Button */}
          <a href="#tickets" className={styles.vipBtn}>
            {isUserRegistered ? (
              <>
                <span>عرض بياناتك</span>
                <Ticket size={16} />
              </>
            ) : (
              <span>احجز مقعدك</span>
            )}
          </a>

          {/* Hamburger Mobile Menu Toggle */}
          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="فتح القائمة"
          >
            <span
              className={`${styles.bar} ${
                mobileMenuOpen ? styles.barOpen1 : ''
              }`}
            />
            <span
              className={`${styles.bar} ${
                mobileMenuOpen ? styles.barOpen2 : ''
              }`}
            />
            <span
              className={`${styles.bar} ${
                mobileMenuOpen ? styles.barOpen3 : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {user ? (
            <div className={styles.mobileProfileHeader}>
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="المستخدم"
                  className={styles.mobileAvatarImg}
                />
              ) : (
                <User size={20} className={styles.mobileAvatarIcon} />
              )}
              <div className={styles.mobileProfileText}>
                <span className={styles.mobileName}>
                  {user.user_metadata?.full_name || 'مستخدم Google'}
                </span>
                <span className={styles.mobileEmail}>{user.email}</span>
              </div>
              <button
                className={styles.mobileLogoutBtn}
                onClick={signOutUser}
                title="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className={styles.mobileGoogleAuthBox}>
              <button
                className={styles.mobileGoogleBtn}
                onClick={signInWithGoogle}
              >
                <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>تسجيل الدخول عبر Google</span>
              </button>
            </div>
          )}

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
              <a href="#tickets" onClick={() => setMobileMenuOpen(false)}>
                {isUserRegistered ? 'عرض بياناتك وتعديلها' : 'احجز حضورك'}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
