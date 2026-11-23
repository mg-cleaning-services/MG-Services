import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jessica T.",
    location: "South Yarra",
    text: "What sets MG apart is the trust. I know exactly who's coming into my home and they treat it with such respect. The cleaning is exceptional, but the peace of mind is priceless.",
    rating: 5,
  },
  {
    name: "David & Kate L.",
    location: "Richmond",
    text: "As busy parents, coming home to a spotless house feels like a gift. Sarah has been our regular cleaner for two years now and she's practically family. Absolutely reliable.",
    rating: 5,
  },
  {
    name: "Michael R.",
    location: "CBD",
    text: "I run three Airbnb properties and MG handles all the turnovers. The attention to detail is incredible — my guests constantly comment on how clean everything is. 5-star reviews every time.",
    rating: 5,
  },
  {
    name: "Anna K.",
    location: "Toorak",
    text: "I've tried many cleaning services over the years. MG is the first one where I genuinely trust the people. They're professional, friendly, and the results speak for themselves.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-ink mb-6">
            Trusted by Melbourne families
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">
            Don't take our word for it. Hear from the people who've invited us
            into their homes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-surface rounded-3xl p-8 border border-brand/5 relative"
            >
              <Quote className="w-10 h-10 text-brand/10 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-brand text-brand"
                  />
                ))}
              </div>
              <p className="text-ink/70 leading-relaxed mb-6 text-[0.95rem]">
                "{t.text}"
              </p>
              <div>
                <p className="font-semibold text-ink text-sm">{t.name}</p>
                <p className="text-xs text-ink/50">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
