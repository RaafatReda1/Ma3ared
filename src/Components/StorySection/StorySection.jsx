import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Clock, BookOpen, Lock, Hourglass, HelpCircle } from 'lucide-react';
import styles from './StorySection.module.css';

gsap.registerPlugin(ScrollTrigger);

export const StorySection = () => {
  const sectionRef = useRef(null);
  const sandWatchRef = useRef(null);
  const book1Ref = useRef(null);
  const book2Ref = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating background animation
      if (sandWatchRef.current) {
        gsap.to(sandWatchRef.current, {
          y: '+=30',
          rotation: 12,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (book1Ref.current) {
        gsap.to(book1Ref.current, {
          y: '-=25',
          rotation: -12,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.3,
        });
      }

      if (book2Ref.current) {
        gsap.to(book2Ref.current, {
          y: '+=22',
          rotation: 8,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.7,
        });
      }

      // Scroll entrance animation
      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} id="about" className={styles.storySection}>
      {/* Background Floating Objects */}
      <img
        ref={sandWatchRef}
        src="/sandWatch.png"
        alt="ساعة رملية"
        className={`${styles.floatingBgObj} ${styles.sandWatchBg}`}
      />
      <img
        ref={book1Ref}
        src="/book2.png"
        alt="كتاب مفتوح"
        className={`${styles.floatingBgObj} ${styles.book1Bg}`}
      />
      <img
        ref={book2Ref}
        src="/book.png"
        alt="كتاب أسرار"
        className={`${styles.floatingBgObj} ${styles.book2Bg}`}
      />

      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerGroup}>
          <div className={styles.badge}>
            <Sparkles className={styles.badgeIcon} size={16} />
            <span>السر وراء اللحظة</span>
          </div>
          <h2 className={styles.title}>
            الوقت.. ليس مجرد <span className={styles.goldText}>عقارب تتداخل</span>
          </h2>
          <p className={styles.subtitle}>
            رحلة غامضة عبر تفاصيل الزمن والأثر الذي يتركه في نفوسنا
          </p>
        </div>

        {/* Narrative Grid Cards */}
        <div className={styles.cardsGrid}>
          {/* Card 1 */}
          <div ref={addToCardsRef} className={styles.storyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>
                <Hourglass size={24} />
              </div>
              <span className={styles.cardNumber}>01</span>
            </div>
            <p className={styles.cardText}>
              في لحظات بتكون مجرد دقيقة في يوم عادي.. ولحظات تانية بتفضل فاكرها
              مهما عدى عليها وقت.
            </p>
          </div>

          {/* Card 2 */}
          <div ref={addToCardsRef} className={styles.storyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>
                <Clock size={24} />
              </div>
              <span className={styles.cardNumber}>02</span>
            </div>
            <p className={styles.cardText}>
              يمكن عشان كده الوقت عمره ما كان مجرد عقارب بتتحرك… الوقت هو الحكايات
              اللي بنعيشها والتفاصيل اللي بنفتكرها، واللحظات اللي بنقول بعدها:
              <strong className={styles.highlightText}> "هنا كل حاجة اتغيرت"</strong>
            </p>
          </div>

          {/* Card 3 */}
          <div ref={addToCardsRef} className={styles.storyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>
                <BookOpen size={24} />
              </div>
              <span className={styles.cardNumber}>03</span>
            </div>
            <p className={styles.cardText}>
              وفي يوم… هنسيب الوقت يمشي بطريقته المعتادة وندخل لحظة مختلفة..
              لحظة يمكن تكون قصيرة في عمر الزمن، لكن طويلة جدًا في أثرها.
            </p>
          </div>
        </div>

        {/* Highlight Mystery Banner */}
        <div ref={addToCardsRef} className={styles.mysteryBanner}>
          <div className={styles.bannerShimmer} />
          <div className={styles.bannerBadge}>
            <Lock size={16} className={styles.bannerBadgeIcon} />
            <span>السر المجهول</span>
          </div>
          <h3 className={styles.bannerTitle}>TIK TAK 15</h3>
          <p className={styles.bannerDesc}>
            مش مجرد اسم حفلة… دي لحظة وراها حكاية وسر لسه هنعرفه سوا
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
