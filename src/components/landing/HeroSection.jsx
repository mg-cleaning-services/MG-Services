import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Shield, Clock, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_IMG = "images/hero.png";

const trustBadges = [
  { icon: ShieldCheck, label: "Police Checked" },
  { icon: Shield, label: "Fully Insured" },
  { icon: Clock, label: "Reliable Team" },
  { icon: Leaf, label: "Eco Friendly Products" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Logo */}
        <motion.img
          src="images/logo.png"
          alt="MG Cleaning Services"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="
  w-52 sm:w-60 md:w-72 lg:w-80
  h-auto mx-auto
  mb-5 md:mb-6
  drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]
"
        />

        {/* Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto mb-7"
        >
          {/* Very subtle contrast behind slogan */}
          <div
            className="
      absolute
      inset-x-6 inset-y-1
      bg-black/15
      blur-xl
      rounded-[50%]
      pointer-events-none
    "
          />

          <h1
            className="
      relative
      text-[2.15rem] sm:text-5xl md:text-6xl lg:text-[4rem]
      font-heading
      text-white
      leading-[0.95]
      tracking-[-0.02em]
      [text-shadow:0_2px_5px_rgba(0,0,0,0.55)]
    "
          >
            Cleaning your home starts with trusting who walks through your door.
          </h1>
        </motion.div>

        {/* Trust positioning */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span className="hidden sm:block h-px w-8 bg-[#4CAF50]/60" />

          <p
            className="
    text-[#66BB6A]
    text-[11px] sm:text-xs
    font-semibold
    tracking-[0.22em]
    uppercase
  "
          >
            Melbourne&apos;s Trusted Home Cleaning
          </p>

          <span className="hidden sm:block h-px w-8 bg-[#4CAF50]/60" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/request-service"
            className="bg-[#2E7D32] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#256b29] transition-all duration-300 hover:shadow-xl hover:shadow-[#2E7D32]/30 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Request a Cleaning
          </Link>

          <a
            href="#team"
            className="border border-white/30 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
          >
            Meet Our Team
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2.5 text-white/80"
            >
              <badge.icon className="w-5 h-5 text-[#4CAF50]" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F9FAF9] to-transparent" />
    </section>
  );
}
