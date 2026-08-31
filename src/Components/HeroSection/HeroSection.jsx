import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import BackgroundFX from './Components/BackgroundFX/BackgroundFX';
import HeroContent from './Components/HeroContent/HeroContent';
import HeroVisual from './Components/HeroVisual/HeroVisual';
import styles from './HeroSection.module.css';

export const HeroSection = () => {
  return (
    <section className={styles.heroWrapper}>
      {/* Background */}
      <BackgroundFX />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className={styles.heroContentContainer}>
        {/* Left Side: TikTak Logo, Slogan & Event Details */}
        <HeroContent />

        {/* Right Side: Ma3ared Man + Floating Objects */}
        <HeroVisual />
      </div>
    </section>
  );
};

export default HeroSection;