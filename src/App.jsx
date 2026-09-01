import { useState } from "react";
import "./App.css";
import "./index.css";

import { HeroSection } from "./Components/HeroSection/HeroSection";
import { StorySection } from "./Components/StorySection/StorySection";
import { CountdownSection } from "./Components/CountdownSection/CountdownSection";
import Form from "./Components/Form/Form";
import WatchIntro from "./Components/WatchIntro/WatchIntro";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {/* Cinematic intro overlay — unmounts after exit sequence */}
      {!introComplete && (
        <WatchIntro onDone={() => setIntroComplete(true)} />
      )}

      {/* Main app — rendered beneath intro, visible after it exits */}
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "var(--color-midnight)",
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <HeroSection />
        <StorySection />
        <CountdownSection />
        <Form />
      </main>
    </>
  );
}