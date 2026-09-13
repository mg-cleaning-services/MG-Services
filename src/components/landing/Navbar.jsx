import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Our Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#quote" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#2E7D32]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-2">
              <div
                className={`text-2xl font-heading font-bold transition-colors duration-500 ${scrolled ? "text-[#1A1A1A]" : "text-white"}`}
              >
                MG<span className="text-[#2E7D32]">.</span>
              </div>
              <span
                className={`text-sm font-body font-light tracking-widest uppercase transition-colors duration-500 hidden sm:inline ${scrolled ? "text-[#1A1A1A]/60" : "text-white/70"}`}
              >
                Cleaning Melbourne
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[#2E7D32] ${
                    scrolled ? "text-[#1A1A1A]/70" : "text-white/80"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:+61424584774"
                className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                  scrolled ? "text-[#1A1A1A]/70" : "text-white/80"
                }`}
              >
                <Phone className="w-4 h-4" />
                +61 424584774
              </a>
              <Link
                to="/request-service"
                className="hidden lg:inline-flex bg-[#2E7D32] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#256b29] transition-all duration-300 hover:shadow-lg hover:shadow-[#2E7D32]/20"
              >
                Request a Cleaning
              </Link>
              <button
                onClick={() => setMenuOpen(true)}
                className={`lg:hidden p-2 transition-colors ${scrolled ? "text-[#1A1A1A]" : "text-white"}`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20">
              <div className="text-2xl font-heading font-bold text-[#1A1A1A]">
                MG<span className="text-[#2E7D32]">.</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-[#1A1A1A]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-3xl font-heading text-[#1A1A1A] hover:text-[#2E7D32] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <Link
                  to="/request-service"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex bg-[#2E7D32] text-white px-8 py-3 rounded-full text-lg font-semibold"
                >
                  Request a Cleaning
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
