import React from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const posts = [
  {
    src: "/images/igm1.png",
    alt: "Clean bedroom",
  },
  {
    src: "/images/igm2.png",
    alt: "Eco cleaning products",
  },
  {
    src: "/images/igm3.png",
    alt: "Sparkling kitchen",
  },
  {
    src: "/images/igm1.png",
    alt: "Kitchen transformation",
  },
  {
    src: "/images/igm2.png",
    alt: "Bathroom revival",
  },
  {
    src: "/images/igm3.png",
    alt: "Living room refresh",
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Follow Us
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[#1A1A1A] mb-6">
            @mgcleaning_melbourne
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/mgcleaning_melbourne/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="aspect-square rounded-2xl overflow-hidden group relative"
            >
              <img
                src={post.src}
                alt={post.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#2E7D32]/0 group-hover:bg-[#2E7D32]/30 transition-colors duration-500 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.instagram.com/mgcleaning_melbourne/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:underline"
          >
            <Instagram className="w-5 h-5" />
            Follow us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
