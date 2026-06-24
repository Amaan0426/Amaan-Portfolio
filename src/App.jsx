import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './sections/Home';
import About from './sections/About';
import StatsStrip from './components/StatsStrip';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import OceanBackground from './components/OceanBackground';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function App() {
  useEffect(() => {
    // Perform a global ScrollTrigger refresh after sections are mounted and layout settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SmoothScroll>
      <OceanBackground />
      <CustomCursor />
      <Navbar />

      <main>
        <Home />
        <About />
        <StatsStrip />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
