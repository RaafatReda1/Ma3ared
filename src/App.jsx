import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

import { HeroSection } from "./Components/HeroSection/HeroSection";
import { StorySection } from "./Components/StorySection/StorySection";
import { CountdownSection } from "./Components/CountdownSection/CountdownSection";
import Form from "./Components/Form/Form";
import Footer from "./Components/Footer/Footer";
import WatchIntro from "./Components/WatchIntro/WatchIntro";
import { checkIsAdmin } from "./utils/checkIsAdmin";
import { supabase } from "./utils/Supabase";

const Admin = lazy(() => import("./Components/Admin/Admin"));

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdm = await checkIsAdmin();
      setIsAdmin(isAdm);
      setAuthChecking(false);
    };

    verifyAdmin();

    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      const isAdm = await checkIsAdmin();
      setIsAdmin(isAdm);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (authChecking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-midnight)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid rgba(223, 156, 76, 0.2)",
            borderTopColor: "var(--color-gold)",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  // If logged-in user is an Admin, render the Admin Control Panel
  if (isAdmin) {
    return (
      <>
        <Suspense
          fallback={
            <div
              style={{
                minHeight: "100vh",
                backgroundColor: "var(--color-midnight)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "3px solid rgba(223, 156, 76, 0.2)",
                  borderTopColor: "var(--color-gold)",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            </div>
          }
        >
          <Admin />
        </Suspense>
        <Analytics />
      </>
    );
  }

  // Public Event Landing Page
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
        <Footer />
      </main>
      <Analytics />
    </>
  );
}