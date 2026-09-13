import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, ClipboardCheck, Users, Smile } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    num: "01",
    title: "Request a Cleaning",
    desc: "Tell us about your home, the cleaning you need, and your preferred date and time.",
  },
  {
    icon: ClipboardCheck,
    num: "02",
    title: "We Review & Confirm",
    desc: "We review your request, clarify the details with you, and confirm the service before anything is booked.",
  },
  {
    icon: Users,
    num: "03",
    title: "Meet Your Cleaner",
    desc: "Once your job is arranged, you'll know who's coming before the appointment. No strangers, no surprises.",
  },
  {
    icon: Smile,
    num: "04",
    title: "Enjoy Your Clean Home",
    desc: "Your cleaner takes care of the agreed service so you can come back to a fresh, comfortable space.",
  },
];

export default function HowItWorks() {
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
          <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[#1A1A1A] mb-6">
            Simple from request to clean
          </h2>
          <p className="text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto leading-relaxed">
            Send us what you need. We review the details personally, confirm the
            service with you, and introduce the cleaner assigned to your home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-[#2E7D32]/15" />
              )}
              <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-6 relative">
                <step.icon className="w-8 h-8 text-[#2E7D32]" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2E7D32] text-white text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>
              </div>
              <h3 className="text-2xl font-heading text-[#1A1A1A] mb-3">
                {step.title}
              </h3>
              <p className="text-[#1A1A1A]/60 leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
