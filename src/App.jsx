import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";

import { HeroSection } from "./Components/HeroSection/HeroSection";
import { StorySection } from "./Components/StorySection/StorySection";
import { CountdownSection } from "./Components/CountdownSection/CountdownSection";
import Form from "./Components/Form/Form";
import ManLoade from "./Components/ManLoader/ManLoade.jsx";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ManLoade />;
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--color-midnight)",
      }}
    >
      <HeroSection />
      <StorySection />
      <CountdownSection />
      <Form />
    </main>
  );
}