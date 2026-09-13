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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase mb-6"
        >
          Melbourne&apos;s Trusted Home Cleaning
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-white leading-[1.1] mb-8"
        >
          Cleaning your home starts with trusting who walks through your door.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Professional residential cleaning across Melbourne with a human-first
          approach.
        </motion.p>

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
              <badge.icon className="w-5 h-5 text-[#2E7D32]" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F9FAF9] to-transparent" />
    </section>
  );
}
