import React from "react";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Our Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Get a Quote", href: "#quote" },
];

const serviceLinks = [
  "Regular Cleaning",
  "Deep Cleaning",
  "End of Lease Cleaning",
  "Carpet Cleaning",
  "Airbnb Cleaning",
];

export default function Footer() {
  return (
    <footer className="bg-[#1B3D1E] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="text-3xl font-heading font-bold mb-4">
              MG<span className="text-[#4CAF50]">.</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Professional residential cleaning across Melbourne. Built on
              trust, delivered with care.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/mgcleaning_melbourne/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+61424584774"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#4CAF50]" />
                  +61 424584774
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@mgcleaningmelbourne.com.au"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#4CAF50]" />
                  hello@mgcleaningmelbourne.com.au
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} MG Cleaning Melbourne. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#quote"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#quote"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
