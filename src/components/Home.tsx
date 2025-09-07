import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import HowItWorks from "./HowItWorks";
import AboutUs from "./AboutUs";
import DecryptedText from "./UI/DecryptedText";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isHowItWorksInView, setIsHowItWorksInView] = useState(false);
  const [isAboutUsInView, setIsAboutUsInView] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = "/bg.png";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const howItWorksSection = document.querySelector(
        '[data-section="how-it-works"]'
      );
      const aboutUsSection = document.querySelector(
        '[data-section="about-us"]'
      );
      
      if (howItWorksSection) {
        const rect = howItWorksSection.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        if (isInView && !isHowItWorksInView) {
          setIsHowItWorksInView(true);
        }
      }
      
      if (aboutUsSection) {
        const rect = aboutUsSection.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        if (isInView && !isAboutUsInView) {
          setIsAboutUsInView(true);
        }
      }
    };

    // Run once on mount to check initial state
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHowItWorksInView, isAboutUsInView]);
  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ backgroundColor: "#131415" }}
    >
      {/* Desktop Background Pattern for ParseIt Area (up to feature cards) */}
      <div
        className="absolute inset-0 md:block hidden"
        style={{
          backgroundImage: bgLoaded ? "url(/bg.png)" : "none",
          backgroundSize: "auto",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          opacity: bgLoaded ? 1 : 0,
          height: "calc(100vh + 400px)", // Extend to cover feature cards
        }}
      ></div>
      {/* Mobile-specific pattern overlay */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: bgLoaded ? "url(/bg.png)" : "none",
          backgroundSize: "600px 600px",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          opacity: bgLoaded ? 1 : 0,
          height: "calc(100vh + 400px)",
        }}
      ></div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 md:px-6 pt-12 md:pt-16">
        <div className="text-center max-w-4xl">
          {/* Grammar-Based Tokenizer Label */}
          <div
            className="inline-block px-3 py-1 mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 185, 132, 0.3), rgba(13, 148, 136, 0.3))",
            }}
          >
            <p
              className="text-white text-base md:text-sm font-light"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              Grammar-Based Tokenizer
            </p>
          </div>

          {/* ParseIt Title */}
          <h1
            className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 italic"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            <DecryptedText
              text="ParseIt."
              speed={10}
              maxIterations={40}
              characters="ParseIt."
              className="revealed"
              parentClassName="all-letters"
              encryptedClassName="encrypted"
              animateOn="view"
              revealDirection="center"
            />
          </h1>

          {/* Description */}
          <p
            className="text-white text-base md:text-lg font-light mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto px-4 md:px-0"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            ANALYZE ARITHMETIC EXPRESSIONS AND REGEX PATTERNS, CONFIRM VALIDITY, AND REVEAL THEIR
            CONSTRUCTION ACCORDING TO CONTEXT-FREE GRAMMAR.
          </p>

          {/* Init Parse Button */}
          <button
            onClick={() => navigate("/playground")}
            className="border border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm md:text-base"
            style={{
              fontFamily: "DM Mono, monospace",
              boxShadow: "0 6px 12px rgba(20, 185, 132, 0.35)",
            }}
          >
            Init Parse()
          </button>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="relative z-10 px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <FeatureCard
            imageSrc="/cfg.png"
            imageAlt="CFG-Based Tokenization"
            title="CFG-Based Tokenization"
            description="The input string is divided into tokens such as numbers, operators, and parentheses, with each token classified strictly according to the rules defined in the context-free grammar."
            animationDelay="0.2s"
          />

          <FeatureCard
            imageSrc="/validation.png"
            imageAlt="Syntactic Validation"
            title="Syntactic Validation"
            description="The generated tokens are checked against the grammar productions to ensure that the sequence forms a valid arithmetic expression and follows the correct syntactic structure."
            animationDelay="0.4s"
          />

          <FeatureCard
            imageSrc="/derivation.png"
            imageAlt="Derivation Output"
            title="Derivation Output"
            description="For valid inputs, the system produces a derivation that shows how the expression is derived from the start symbol."
            animationDelay="0.6s"
          />
        </div>
      </section>

      <HowItWorks isInView={isHowItWorksInView} />
      <AboutUs isInView={isAboutUsInView} />
    </div>
  );
};

export default Home;