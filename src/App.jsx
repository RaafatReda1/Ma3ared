import "./App.css";
import "./index.css";
import { HeroSection } from "./Components/HeroSection/HeroSection";

export default function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "var(--color-midnight)" }}>
      <HeroSection />

      {/* Demo Section 1: About */}
      <section
        id="about"
        style={{
          padding: "100px 20px",
          textAlign: "center",
          backgroundColor: "#030E26",
          borderTop: "1px solid rgba(223, 156, 76, 0.2)"
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "var(--color-gold-light)", marginBottom: "20px" }}>
          عن الحفلة والفعاليات
        </h2>
        <p style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.8", color: "var(--color-text-muted)" }}>
          معارض مدينة نصر 2026 تجمع أفضل العارضين والفعاليات الثقافية والترفيهية في تجربة فريدة من نوعها. استمتع بأحدث العروض والمنتجات الحصرية.
        </p>
      </section>

      {/* Demo Section 2: Exhibitions */}
      <section
        id="exhibitions"
        style={{
          padding: "100px 20px",
          textAlign: "center",
          backgroundColor: "#001027"
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "var(--color-gold-light)", marginBottom: "20px" }}>
          المعارض المشاركة
        </h2>
        <p style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.8", color: "var(--color-text-muted)" }}>
          أكثر من 100 جناح مخصص للموضة والأزياء والتقنية والتراث.
        </p>
      </section>

      {/* Demo Section 3: Contact */}
      <section
        id="contact"
        style={{
          padding: "100px 20px",
          textAlign: "center",
          backgroundColor: "#040611",
          borderTop: "1px solid rgba(223, 156, 76, 0.15)"
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "var(--color-gold-light)", marginBottom: "20px" }}>
          تواصل معنا
        </h2>
        <p style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.8", color: "var(--color-text-muted)" }}>
          للاستفسارات والحجوزات، تواصل معنا عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي.
        </p>
      </section>
    </div>
  );
}

