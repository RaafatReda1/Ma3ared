import "./App.css";
import "./index.css";
import { HeroSection } from "./Components/HeroSection/HeroSection";
import { StorySection } from "./Components/StorySection/StorySection";
import { CountdownSection } from "./Components/CountdownSection/CountdownSection";
import Form from "./Components/Form/Form";

export default function App() {
  return (
    <main style={{ position: "relative", minHeight: "100vh", backgroundColor: "var(--color-midnight)" }}>
      <HeroSection />
      <StorySection />
      <CountdownSection />
      <Form/>
    </main>
  );
}


