import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import ServiceDetailsDialog from "@/components/landing/ServiceDetailsDialog";
import { getPackagesWithServices } from "@/services/cleaningService";

export default function ServicesSection() {
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPackages() {
      try {
        const packageData = await getPackagesWithServices();

        if (active) {
          setPackages(packageData);
        }
      } catch (error) {
        console.error("Error loading cleaning packages:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPackages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section id="services" className="bg-white py-24 md:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-20 text-center"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
              Our Services
            </p>

            <h2 className="mb-6 font-heading text-4xl text-[#1A1A1A] md:text-5xl lg:text-6xl">
              Tailored to your home
            </h2>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#1A1A1A]/60">
              Choose the level of cleaning that suits your home. Explore each
              package to see exactly what's included.
            </p>
          </motion.div>

          {loading && (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="h-7 w-7 animate-pulse text-[#2E7D32]" />

                <p className="text-sm text-[#1A1A1A]/50">
                  Loading cleaning services...
                </p>
              </div>
            </div>
          )}

          {!loading && packages.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6">
              {packages.map((cleaningPackage, index) => (
                <motion.button
                  key={cleaningPackage.id}
                  type="button"
                  onClick={() => setSelectedPackageId(cleaningPackage.id)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className="
                    group
                    flex
                    w-full
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#2E7D32]/10
                    bg-white
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#2E7D32]/30
                    hover:shadow-xl
                    hover:shadow-[#2E7D32]/5
                    md:w-[calc(50%-0.75rem)]
                    lg:w-[calc(33.333%-1rem)]
                  "
                >
                  <div className="relative h-52 w-full overflow-hidden bg-[#E8F5E9]">
                    {cleaningPackage.image_url ? (
                      <img
                        src={cleaningPackage.image_url}
                        alt={cleaningPackage.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Sparkles className="h-8 w-8 text-[#2E7D32]/35" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-center font-heading text-2xl text-[#1A1A1A]">
                      {cleaningPackage.name}
                    </h3>

                    <p className="mt-3 text-center text-[0.95rem] leading-relaxed text-[#1A1A1A]/60">
                      {cleaningPackage.web_description ||
                        cleaningPackage.description}
                    </p>

                    <div className="mt-auto pt-7 text-center">
                      <span className="text-sm font-semibold text-[#2E7D32]">
                        View package details →
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {!loading && packages.length === 0 && (
            <div className="rounded-3xl bg-[#F9FAF9] p-10 text-center">
              <p className="text-[#1A1A1A]/60">
                Cleaning packages are currently unavailable.
              </p>
            </div>
          )}
        </div>
      </section>

      <ServiceDetailsDialog
        packages={packages}
        initialPackageId={selectedPackageId}
        open={Boolean(selectedPackageId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPackageId(null);
          }
        }}
      />
    </>
  );
}
