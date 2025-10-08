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

export function NavbarDemo() {
  const navItems = [
    {
      name: "მთავარი",
      link: "#Home",
    },
    {
      name: "როგორ მუშაობს",
      link: "#HowItWorks",
    },
    {
      name: "ჩვენს შესახებ",
      link: "#about-us",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
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
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
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
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
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
              initial={{ y: 12, opacity: 0, scale: 0.75, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, scale: 0.75, filter: "blur(0px)" }}
              exit={{ y: 8, opacity: 0, scale: 0.8, filter: "blur(4px)" }}
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
              initial={{ y: 12, opacity: 0, scale: 0.85, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, scale: 0.85, filter: "blur(0px)" }}
              exit={{ y: 8, opacity: 0, scale: 0.85, filter: "blur(4px)" }}
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
              <GradientButton width="260px" height="60px" className="[--color-background:theme(colors.neutral.950)] [--color-text:theme(colors.yellow.400)]">
                შემოგვიერთდი
              </GradientButton>
            </div>
            
          </div>
        </div>
      </section>

      <section id="features" className="relative w-full mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <WordPullUp
            words="როგორ მუშაობს ბიტკარი?"
            className="text-3xl md:text-5xl font-extrabold text-center mb-10"
            triggerOnVisible
          />
        </div>
        <FeaturesSectionWithHoverEffects />
      </section>

      <section id="functions" className="relative w-full mt-20">
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

      <section id="team" className="relative w-full mt-16">
        <TeamSection />
      </section>

      {/* Navbar */}
    </div>
  );
}

const DummyContent = () => {
  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="mb-4 text-center text-3xl font-bold">
        why IS beetkar greatest invention in the world
      </h1>
      <p className="mb-10 text-center text-sm text-zinc-500">
        this is demo{" "}
        <span className="font-medium">lorem</span>. lorem ipsum dolom
        lorem <span className="font-medium">fixed</span> lorem
        lorem.1
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            id: 1,
            title: "The",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 2,
            title: "First",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 3,
            title: "Rule",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 4,
            title: "Of",
            width: "md:col-span-3",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 5,
            title: "F",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 6,
            title: "Club",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 7,
            title: "Is",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 8,
            title: "You",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 9,
            title: "Do NOT TALK about",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
          {
            id: 10,
            title: "F Club",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-neutral-100 dark:bg-neutral-800",
          },
        ].map((box) => (
          <div
            key={box.id}
            className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}
          >
            <h2 className="text-xl font-medium">{box.title}</h2>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default function App() {
  return (
    <>
      <NavbarDemo />
      <Footer
        logo={<span className="inline-block h-6 w-6 rounded bg-yellow-400" />}
        brandName="Beetkar"
        socialLinks={[]}
        mainLinks={[
          { href: "#Home", label: "მთავარი" },
          { href: "#features", label: "როგორ მუშაობს" },
          { href: "#functions", label: "ფუნქციები" },
          { href: "#team", label: "ჩვენს შესახებ" },
        ]}
        legalLinks={[
          { href: "#", label: "Privacy" },
          { href: "#", label: "Terms" },
          { href: "#", label: "Contact" },
        ]}
        copyright={{ text: `© ${new Date().getFullYear()} Beetkar. All rights reserved.` }}
      />
    </>
  );
}
