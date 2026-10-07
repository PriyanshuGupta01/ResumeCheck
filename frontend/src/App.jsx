import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToHash from './components/ScrollToHash';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2, // 200 ms smooth fade
          ease: 'easeOut',
        }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route
            path="/results"
            element={
              <ErrorBoundary title="Something went wrong showing your results">
                <Results />
              </ErrorBoundary>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Friendly 404 Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary title="Something went wrong" message="An unexpected error occurred in the application. Please try reloading or navigate back to the home page.">
      <AuthProvider>
        <Router>
          <ScrollToHash />
          {/* Accessible Skip-to-content link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1F6F5C] focus:text-white focus:rounded-lg focus:shadow-md focus:text-xs focus:font-semibold"
          >
            Skip to content
          </a>
          <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#3A3A3A] font-sans">
            <Navbar />
            <main id="main-content" tabIndex="-1" className="flex-1 flex flex-col focus:outline-none">
              <AnimatedRoutes />
            </main>
            <Footer />
            <BackToTop />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

