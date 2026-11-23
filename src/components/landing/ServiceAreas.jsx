import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const MAP_BG = "/images/servicearea.webp";

const areas = [
  "South Yarra",
  "Richmond",
  "Prahran",
  "Melbourne CBD",
  "St Kilda",
  "Toorak",
  "Armadale",
  "Windsor",
];

export default function ServiceAreas() {
  return (
    <section id="areas" className="py-24 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={MAP_BG} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Service Areas
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-ink mb-6">
            Serving Melbourne's inner suburbs
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">
            We're proud to serve communities across Melbourne's most vibrant
            neighbourhoods.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {areas.map((area, i) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand/5 hover:border-brand/20 transition-all duration-500 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-0.5 flex items-center gap-3 group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors duration-500">
                <MapPin className="w-4 h-4 text-brand group-hover:text-white transition-colors duration-500" />
              </div>
              <span className="font-medium text-ink text-sm">{area}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
