import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import DashboardPage from './app/dashboard/page';
import { FullPageLoader } from './components/page-loader';
import { usePageLoading } from './hooks/useLoading';

// Page transition variants - slide transition
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: -100
  }
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.4
};

// Animated Routes Component
function AnimatedRoutes() {
  const location = useLocation();
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Only show loader on initial app load, not on route changes
  useEffect(() => {
    if (isInitialLoad) {
      startLoading('Loading application...');
      const timer = setTimeout(() => {
        stopLoading();
        setIsInitialLoad(false);
      }, 1500); // 1.5 second initial load simulation

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, startLoading, stopLoading]);

  return (
    <>
      <FullPageLoader isLoading={isLoading} message="Loading application..." />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full min-h-screen"
          style={{ 
            position: 'relative',
            zIndex: 1
          }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
