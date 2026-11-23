import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Leaf, Clock } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Every cleaner is carefully selected and committed to delivering exceptional service.",
  },
  {
    icon: Heart,
    title: "Human Connection",
    description:
      "Meet the people who will actually clean your home. Real faces, real accountability.",
  },
  {
    icon: Leaf,
    title: "Eco Friendly",
    description:
      "Safe products for children, pets and the environment. No harsh chemicals in your home.",
  },
  {
    icon: Clock,
    title: "Reliable Service",
    description:
      "Always on time. Consistent quality. Professional communication every step of the way.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 md:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-ink mb-6">
            More than just a cleaning service
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">
            We believe you deserve to know and trust the people who care for
            your home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-brand/5 hover:border-brand/15 transition-all duration-500 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mb-6 group-hover:bg-brand transition-colors duration-500">
                <item.icon className="w-6 h-6 text-brand group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-heading text-ink mb-3">
                {item.title}
              </h3>
              <p className="text-ink/60 leading-relaxed text-[0.95rem]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
