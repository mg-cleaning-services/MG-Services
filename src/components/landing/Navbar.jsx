import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Our Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#quote" },
];

export default function Navbar() {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isRequestPage = location.pathname === "/request-service";

  /*
   * On Home the navbar starts transparent because
   * it sits over the Hero.
   *
   * On internal pages it should always use the
   * solid/light navbar appearance.
   */
  const useSolidNavbar = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function getNavHref(hash) {
    return isHome ? hash : `/${hash}`;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          useSolidNavbar
            ? "border-b border-[#2E7D32]/10 bg-white/80 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* BRAND */}
            <Link to="/" className="flex items-center gap-2">
              <div
                className={`text-2xl font-heading font-bold transition-colors duration-500 ${
                  useSolidNavbar ? "text-[#1A1A1A]" : "text-white"
                }`}
              >
                MG
                <span className="text-[#2E7D32]">.</span>
              </div>

              <span
                className={`hidden text-sm font-body font-light uppercase tracking-widest transition-colors duration-500 sm:inline ${
                  useSolidNavbar ? "text-[#1A1A1A]/60" : "text-white/70"
                }`}
              >
                Cleaning Melbourne
              </span>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={getNavHref(link.href)}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[#2E7D32] ${
                    useSolidNavbar ? "text-[#1A1A1A]/70" : "text-white/80"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+61424584774"
                className={`hidden items-center gap-2 text-sm font-medium transition-colors duration-300 md:flex ${
                  useSolidNavbar ? "text-[#1A1A1A]/70" : "text-white/80"
                }`}
              >
                <Phone className="h-4 w-4" />
                +61 424584774
              </a>

              {!isRequestPage && (
                <Link
                  to="/request-service"
                  className="hidden rounded-full bg-[#2E7D32] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#256b29] hover:shadow-lg hover:shadow-[#2E7D32]/20 lg:inline-flex"
                >
                  Request a Cleaning
                </Link>
              )}

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={`p-2 transition-colors lg:hidden ${
                  useSolidNavbar ? "text-[#1A1A1A]" : "text-white"
                }`}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
            className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-2xl"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-heading font-bold text-[#1A1A1A]"
              >
                MG
                <span className="text-[#2E7D32]">.</span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 text-[#1A1A1A]"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={getNavHref(link.href)}
                  onClick={() => setMenuOpen(false)}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="text-3xl font-heading text-[#1A1A1A] transition-colors hover:text-[#2E7D32]"
                >
                  {link.label}
                </motion.a>
              ))}

              {!isRequestPage && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.5,
                  }}
                  className="mt-4"
                >
                  <Link
                    to="/request-service"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex rounded-full bg-[#2E7D32] px-8 py-3 text-lg font-semibold text-white"
                  >
                    Request a Cleaning
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
