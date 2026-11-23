import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/*
 * Photos taken by our team after a clean.
 * To add a photo: drop it in /public/images/gallery and add a line here.
 */
const images = [
  { src: "/images/gallery/living-room.webp", alt: "Clean living room with city views", label: "Living Room" },
  { src: "/images/gallery/bedroom-1.webp", alt: "Freshly made bed with rolled towels", label: "Bedroom" },
  { src: "/images/gallery/bedroom-2.webp", alt: "Bedroom with fresh linen and blue throw", label: "Bedroom" },
  { src: "/images/gallery/bedroom-3.webp", alt: "Neatly made bed ready for guests", label: "Bedroom" },
  { src: "/images/gallery/bathroom-1.webp", alt: "Spotless bathroom with vanity and toilet", label: "Bathroom" },
  { src: "/images/gallery/bathroom-2.webp", alt: "Clean bathroom with amenities on the shelf", label: "Bathroom" },
  { src: "/images/gallery/bathroom-detail.webp", alt: "Folded toilet paper finishing touch", label: "Finishing Touches" },
  { src: "/images/gallery/kitchen.webp", alt: "Clean kitchen cooktops and benchtop", label: "Kitchen" },
  { src: "/images/gallery/kitchen-cupboard.webp", alt: "Organised kitchen cupboard with dishes", label: "Kitchen Cupboard" },
  { src: "/images/gallery/fridge.webp", alt: "Clean and empty fridge", label: "Fridge" },
  { src: "/images/gallery/laundry.webp", alt: "Tidy laundry with washer and dryer", label: "Laundry" },
  { src: "/images/gallery/balcony.webp", alt: "Clean balcony with city views", label: "Balcony" },
];

const total = images.length;

export default function GallerySection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [activeIndex, setActiveIndex] = useState(0);
  // Index of the photo open in the full-screen viewer (null = closed)
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const showPrev = useCallback(() => setSelected((i) => (i - 1 + total) % total), []);
  const showNext = useCallback(() => setSelected((i) => (i + 1) % total), []);

  // Keyboard controls for the full-screen viewer
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, showPrev, showNext]);

  return (
    <section id="gallery" className="py-24 md:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Gallery
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-ink mb-6">
            See our work
          </h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">
            Photos taken by our team after real cleans in Melbourne homes.
            Every room, every detail, left ready to enjoy.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto"
        role="region"
        aria-roledescription="carousel"
        aria-label="Photos of our work"
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div
                key={img.src}
                className="min-w-0 shrink-0 grow-0 basis-[78%] sm:basis-[45%] lg:basis-[31%] pl-4"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  className="relative block w-full rounded-3xl overflow-hidden cursor-pointer group aspect-[3/4] bg-brand-soft"
                  aria-label={`Enlarge photo: ${img.alt}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-0 left-0 right-0 p-5 text-left text-white font-heading text-xl">
                    {img.label}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows (desktop); on phones people swipe */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous photo"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg hover:bg-white transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next photo"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg hover:bg-white transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Position dots */}
        <div className="flex justify-center gap-2 mt-8 px-6">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === activeIndex}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-brand" : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={images[selected].alt}
          >
            <motion.img
              key={selected}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={images[selected].src}
              alt={images[selected].alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <p className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
              {selected + 1} / {total}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
