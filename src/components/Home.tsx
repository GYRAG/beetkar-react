"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import TrueFocus from "@/components/TrueFocus.jsx";
import GradientButton from "@/components/ui/button-1";
import { useState } from "react";
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects";
import { WordPullUp } from "@/components/ui/word-pull-up";
import { CyberneticBentoGrid } from "@/components/cybernetic-bento-grid";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import SignupFormDemo from "@/components/signup-form-demo";
import LoginFormDemo from "@/components/login-form-demo";
import TeamSection from "@/components/team";
import { Footer } from "@/components/ui/footer";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  
  const navItems = [
    {
      name: "როგორ მუშაობს",
      link: "#features",
    },
    {
      name: "რა შეგვიძლია",
      link: "#functions",
    },
    {
      name: "ჩვენს შესახებ",
      link: "#team",
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Function to handle smooth scroll with navbar offset
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 120; // Approximate navbar height including top offset
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Function to handle navigation clicks
  const handleNavClick = (item: { name: string; link: string }) => {
    if (item.link.startsWith('/')) {
      // Handle route navigation
      navigate(item.link);
    } else {
      // Handle section scrolling
      scrollToSection(item.link.replace('#', ''));
    }
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems 
            items={navItems} 
            onItemClick={handleNavClick} 
          />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" onClick={() => setIsSignupOpen(true)}>რეგისტრაცია</NavbarButton>
            <NavbarButton variant="primary" onClick={() => setIsLoginOpen(true)}>შესვლა</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <button
                key={`mobile-link-${idx}`}
                onClick={() => {
                  handleNavClick(item);
                  setIsMobileMenuOpen(false);
                }}
                className="relative text-neutral-600 dark:text-neutral-300 text-left w-full"
              >
                <span className="block">{item.name}</span>
              </button>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => { setIsSignupOpen(true); setIsMobileMenuOpen(false); }}
                variant="primary"
                className="w-full"
              >
                რეგისტრაცია
              </NavbarButton>
              <NavbarButton
                onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                variant="primary"
                className="w-full"
              >
                შესვლა
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <AnimatePresence>
        {isSignupOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md backdrop-saturate-150 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSignupOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm md:max-w-md"
              initial={{ y: 12, opacity: 0, scale: 0.80, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, scale: 0.80, filter: "blur(0px)" }}
              exit={{ y: 8, opacity: 0, scale: 0.7, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <SignupFormDemo onSwitchToLogin={() => { setIsSignupOpen(false); setIsLoginOpen(true); }} />
            </motion.div>
          </motion.div>
        )}
        {isLoginOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md backdrop-saturate-150 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm md:max-w-md"
              initial={{ y: 12, opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, scale: 0.9, filter: "blur(0px)" }}
              exit={{ y: 8, opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <LoginFormDemo onSwitchToSignup={() => { setIsLoginOpen(false); setIsSignupOpen(true); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section with Hexagon Background */}
      <section id="Home" className="relative mt-8 w-full">
        <div className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden">
          <HexagonBackground className="absolute inset-0" />
          <div className="relative z-10 px-6 text-center">
            <TrueFocus
              sentence="გადაარჩინე შენი ფუტკრები"
              manualMode={false}
              blurAmount={5}
              borderColor= "rgba(250, 217, 33, 0.6)"
              glowColor="rgba(250, 217, 33, 0.6)"
              animationDuration={0.5}
              pauseBetweenAnimations={0.3}
            />
            <div className="mt-12 flex w-full justify-center">
              <GradientButton 
                width="260px" 
                height="60px" 
                className="[--color-background:theme(colors.neutral.950)] [--color-text:theme(colors.yellow.400)]"
                onClick={() => scrollToSection('features')}
              >
                შემოგვიერთდი
              </GradientButton>
            </div>
            
          </div>
        </div>
      </section>

      <section id="features" className="relative w-full mt-16 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <WordPullUp
            words="როგორ მუშაობს ბიტკარი?"
            className="text-3xl md:text-5xl font-extrabold text-center mb-10"
            triggerOnVisible
          />
        </div>
        <FeaturesSectionWithHoverEffects />
      </section>

      <section id="functions" className="relative w-full mt-20 pt-20">
        <CyberneticBentoGrid />
        
      </section>

      <section id="scroll-demo" className="relative w-full mt-0">
        <ContainerScroll
          titleComponent={
            <h1 className="text-center text-2xl md:text-4xl font-semibold">
              სრული კონტროლი.ერთ სივრცე.
              
            </h1>
            
          }
        >
          <div className="h-full w-full flex flex-col md:justify-between items-center text-zinc-200 md:text-zinc-300 p-4">
            <div className="flex-1 w-full flex items-center justify-center">
              dashboard preview.
            </div>
            <p className="mt-6 text-center text-sm md:text-base leading-relaxed">
              იხილეთ რეალურ დროში ტემპერატურის რუქები, სენსორული გრაფიკები და ჯანმრთელობის გაფრთხილებები ნებისმიერი ადგილიდან. Beetkar-ის სუფთა, თანამედროვე დაფა საშუალებას გაძლევთ შეადაროთ ჭინჭრის ციება, თვალყური ადევნოთ ისტორიას და იწინასწარმეტყველოთ რისკები.
            </p>
          </div>
        </ContainerScroll>
      </section>

      <section id="team" className="relative w-full mt-16 pt-20">
        <TeamSection />
      </section>

      {/* Footer */}
      <Footer
        logo={<span className="inline-block h-6 w-6 rounded bg-yellow-400" />}
        brandName="Beetkar"
        socialLinks={[]}
        mainLinks={[
          { href: "#Home", label: "მთავარი" },
          { href: "#features", label: "როგორ მუშაობს" },
          { href: "#functions", label: "რა შეგვიძლია" },
          { href: "#team", label: "ჩვენს შესახებ" },
          { href: "/dashboard", label: "Dashboard" },
        ]}
        legalLinks={[
          { href: "#", label: "Privacy" },
          { href: "#", label: "Terms" },
          { href: "#", label: "Contact" },
        ]}
        copyright={{ text: `© ${new Date().getFullYear()} Beetkar. All rights reserved.` }}
      />
    </div>
  );
}
