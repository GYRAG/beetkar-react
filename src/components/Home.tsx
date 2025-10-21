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
import { StarButton } from "@/components/star-button";
import { HoverButton } from "@/components/hover-glow-button";
import { useState } from "react";
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects";
import { WordPullUp } from "@/components/ui/word-pull-up";
import { CyberneticBentoGrid } from "@/components/cybernetic-bento-grid";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import SignupFormDemo from "@/components/signup-form-demo";
import LoginFormDemo from "@/components/login-form-demo";
import DemoLogin from "@/components/demo-login";
import TeamSection from "@/components/team";
import { Footer } from "@/components/ui/footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TextShimmer } from "@/components/ui/text-shimmer";
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
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoLoginOpen, setIsDemoLoginOpen] = useState(false);

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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <NavbarButton variant="primary" onClick={() => setIsDemoLoginOpen(true)}>დაშბორდი</NavbarButton>
            </motion.div>
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
                variant="secondary"
                className="w-full"
              >
                რეგისტრაცია
              </NavbarButton>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full"
              >
                <NavbarButton
                  onClick={() => { setIsDemoLoginOpen(true); setIsMobileMenuOpen(false); }}
                  variant="primary"
                  className="w-full"
                >
                  დაშბორდი
                </NavbarButton>
              </motion.div>
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
        {isDemoLoginOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md backdrop-saturate-150 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDemoLoginOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm md:max-w-md"
              initial={{ y: 12, opacity: 0, scale: 0.80, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, scale: 0.80, filter: "blur(0px)" }}
              exit={{ y: 8, opacity: 0, scale: 0.7, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <DemoLogin onClose={() => setIsDemoLoginOpen(false)} />
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
            <div className="mt-8 max-w-4xl mx-auto px-6">
              <TextShimmer
                as="p"
                className="text-lg md:text-xl text-center leading-relaxed font-body"
                duration={3}
                spread={1.5}
              >
                ჭკვიანი სენსორებით აღჭურვილი Beetkar აკვირდება სკის ტემპერატურას, ტენიანობას, ხმასა და ვიბრაციას, რათა დაავადებები შენიშნოს მანამდე, სანამ ისინი გავრცელდება.
              </TextShimmer>
            </div>
            <div className="mt-12 flex w-full justify-center gap-10 flex-wrap items-center">
              <StarButton 
                className="font-hero text-white transform scale-[1.6] hover:scale-[1.7] transition-transform duration-300 ease-in-out"
                lightColor="#facc15"
                backgroundColor="#171717"
                lightWidth={120}
                duration={2}
                onClick={() => scrollToSection('features')}
              >
                გაიგე მეტი
              </StarButton>
              <HoverButton
                onClick={() => setIsDemoLoginOpen(true)}
                className="font-hero text-base px-6 py-3 transform hover:scale-110 transition-transform duration-300 ease-in-out"
                glowColor="#facc15"
                backgroundColor="#171717"
                textColor="#ffffff"
                hoverTextColor="#facc15"
              >
                სცადე დემო ვერსია
              </HoverButton>
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
              <img 
                src="/dashboard.png" 
                alt="Beetkar Dashboard Preview" 
                className="w-full h-full object-contain rounded-lg shadow-2xl border border-gray-700"
              />
            </div>
            <p className="mt-6 text-center text-sm md:text-base leading-relaxed">
              იხილეთ რეალურ დროში ტემპერატურის რუქები, სენსორული გრაფიკები და ჯანმრთელობის გაფრთხილებები ნებისმიერი ადგილიდან. Beetkar-ის სუფთა, თანამედროვე დაფა საშუალებას გაძლევთ შეადაროთ ჭინჭრის ციება, თვალყური ადევნოთ ისტორიას და იწინასწარმეტყველოთ რისკები.
            </p>
          </div>
        </ContainerScroll>
      </section>

      {/* Join Us Section */}
      <section className="relative w-full mt-0 pt-0">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
            შემოგვიერთდი Beetkar-ს
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            იყავი ნაწილი რევოლუციისა, რომელიც იცვლის ფუტკრების მოვლის გზას. 
            ჩვენთან ერთად შექმენი უფრო ჯანმრთელი და პროდუქტიული ფუტკრის ოჯახი.
          </p>
          <div className="flex justify-center">
            <HoverButton
              onClick={() => setIsDemoLoginOpen(true)}
              className="text-xl font-semibold px-12 py-4"
              glowColor="#facc15"
              backgroundColor="#171717"
              textColor="#ffffff"
              hoverTextColor="#facc15"
            >
              შემოგვიერთდი
            </HoverButton>
          </div>
        </div>
      </section>

      <section id="team" className="relative w-full mt-12 pt-16">
        <TeamSection />
      </section>

      {/* Footer */}
      <Footer
        logo={<img src="/logo.svg" alt="Beetkar Logo" className="h-6 w-6" />}
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
        themeToggle={<ThemeToggle />}
      />
    </div>
  );
}
