import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function QuoteSection() {
  return (
    <section id="quote" className="py-24 md:py-40 bg-[#F9FAF9]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Get Started
            </p>

            <h2 className="text-4xl md:text-5xl font-heading text-[#1A1A1A] mb-6 leading-tight">
              Ready to experience stress-free cleaning?
            </h2>

            <p className="text-lg text-[#1A1A1A]/60 leading-relaxed mb-10">
              Tell us what you need and we&apos;ll review your request
              personally. No instant bookings, no pressure — just a simple
              conversation to understand your home and recommend the right
              service.
            </p>

            <div className="space-y-5">
              <a
                href="https://wa.me/+61424584774"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#2E7D32]/10 hover:border-[#2E7D32]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-500">
                  <MessageCircle className="w-5 h-5 text-[#2E7D32] group-hover:text-white transition-colors duration-500" />
                </div>

                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">
                    WhatsApp Us
                  </p>

                  <p className="text-xs text-[#1A1A1A]/50">
                    Quick response, easy communication
                  </p>
                </div>
              </a>

              <a
                href="tel:+61424584774"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#2E7D32]/10 hover:border-[#2E7D32]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-500">
                  <Phone className="w-5 h-5 text-[#2E7D32] group-hover:text-white transition-colors duration-500" />
                </div>

                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">
                    Call Us
                  </p>

                  <p className="text-xs text-[#1A1A1A]/50">+61 424584774</p>
                </div>
              </a>

              <a
                href="mailto:Maximilianoguerramorales@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#2E7D32]/10 hover:border-[#2E7D32]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-500">
                  <Mail className="w-5 h-5 text-[#2E7D32] group-hover:text-white transition-colors duration-500" />
                </div>

                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">
                    Email Us
                  </p>

                  <p className="text-xs text-[#1A1A1A]/50">
                    Maximilianoguerramorales@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-[#2E7D32]/5 shadow-xl shadow-[#2E7D32]/5"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center mb-8">
              <ShieldCheck className="w-6 h-6 text-[#2E7D32]" />
            </div>

            <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Request a Cleaning
            </p>

            <h3 className="text-3xl md:text-4xl font-heading text-[#1A1A1A] leading-tight">
              Tell us about your home.
            </h3>

            <p className="mt-5 text-[#1A1A1A]/60 leading-relaxed">
              Our request form takes just a few minutes. You can tell us about
              your property, preferred date, cleaning needs and how you&apos;d
              like us to contact you.
            </p>

            <div className="mt-8 space-y-4">
              <Benefit text="Choose a package or build your own cleaning request" />
              <Benefit text="Tell us about your property and priorities" />
              <Benefit text="Choose your preferred date and contact method" />
              <Benefit text="We review your request before confirming anything" />
            </div>

            <Link
              to="/request-service"
              className="mt-10 w-full bg-[#2E7D32] text-white py-4 px-6 rounded-2xl font-semibold text-base hover:bg-[#256b29] transition-all duration-300 hover:shadow-xl hover:shadow-[#2E7D32]/20 flex items-center justify-center gap-2"
            >
              Request a Cleaning
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-[#1A1A1A]/40 text-center mt-4">
              No payment required. Your request is not a confirmed booking.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Benefit({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
        <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
      </div>

      <p className="text-sm leading-6 text-[#1A1A1A]/60">{text}</p>
    </div>
  );
}
