import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ServiceDetailsDialog({
  packages = [],
  initialPackageId,
  open,
  onOpenChange,
}) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open || !initialPackageId || packages.length === 0) {
      return;
    }

    const packageIndex = packages.findIndex(
      (cleaningPackage) => cleaningPackage.id === initialPackageId,
    );

    if (packageIndex >= 0) {
      setActiveIndex(packageIndex);
    }
  }, [open, initialPackageId, packages]);

  if (packages.length === 0) {
    return null;
  }

  const activePackage = packages[activeIndex];
  const includedServices = activePackage.includedServices || [];

  const goPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? packages.length - 1 : currentIndex - 1,
    );
  };

  const goNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === packages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const handleDragEnd = (_, info) => {
    const swipeDistance = 70;
    const swipeVelocity = 400;

    if (info.offset.x < -swipeDistance || info.velocity.x < -swipeVelocity) {
      goNext();
      return;
    }

    if (info.offset.x > swipeDistance || info.velocity.x > swipeVelocity) {
      goPrevious();
    }
  };

  const handleRequestService = () => {
    navigate("/request-service", {
      state: {
        packageId: activePackage.id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-6xl overflow-hidden rounded-3xl border-0 bg-white p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{activePackage.name}</DialogTitle>

          <DialogDescription>
            Details about the selected cleaning package.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          key={activePackage.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="max-h-[92vh] cursor-grab overflow-y-auto active:cursor-grabbing"
        >
          {/* IMAGE */}
          <div className="relative h-48 overflow-hidden bg-[#E8F5E9] sm:h-56">
            {activePackage.image_url ? (
              <img
                src={activePackage.image_url}
                alt={activePackage.name}
                draggable="false"
                className="pointer-events-none h-full w-full select-none object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Sparkles className="h-10 w-10 text-[#2E7D32]/35" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/5" />

            {/* PREVIOUS */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrevious();
              }}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Previous cleaning package"
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/90 text-[#1A1A1A] shadow-md backdrop-blur transition hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {/* NEXT */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Next cleaning package"
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/90 text-[#1A1A1A] shadow-md backdrop-blur transition hover:bg-white"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute bottom-5 left-6 right-6 text-center">
              <p
                className="text-sm font-semibold uppercase tracking-[0.18em] text-white"
                style={{
                  textShadow:
                    "0 1px 3px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.75)",
                }}
              >
                Cleaning Package
              </p>

              <h2
                className="mt-1 font-heading text-3xl font-semibold text-white sm:text-4xl"
                style={{
                  textShadow:
                    "0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.9)",
                }}
              >
                {activePackage.name}
              </h2>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5 sm:p-7">
            <p className="mx-auto max-w-4xl text-center text-base leading-relaxed text-[#1A1A1A]/65">
              {activePackage.web_description || activePackage.description}
            </p>

            {includedServices.length > 0 ? (
              <div className="mt-6">
                <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#2E7D32]">
                  What's included
                </p>

                {/* 1 mobile / 2 tablet / 4 desktop columns */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {includedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start gap-2.5 rounded-xl bg-[#F9FAF9] p-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
                        <Check className="h-3 w-3 text-[#2E7D32]" />
                      </div>

                      <span className="text-sm leading-relaxed text-[#1A1A1A]/75">
                        {service.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-[#F9FAF9] p-5 text-center">
                <p className="text-sm leading-relaxed text-[#1A1A1A]/65">
                  The cleaning scope for this package is confirmed according to
                  the property and service requirements.
                </p>
              </div>
            )}

            {/* INDICATORS */}
            <div
              className="mt-6 flex items-center justify-center gap-2"
              onPointerDown={(event) => event.stopPropagation()}
            >
              {packages.map((cleaningPackage, index) => (
                <button
                  key={cleaningPackage.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View ${cleaningPackage.name}`}
                  className={`h-2.5 cursor-pointer rounded-full transition-all ${
                    index === activeIndex
                      ? "w-7 bg-[#2E7D32]"
                      : "w-2.5 bg-[#2E7D32]/20 hover:bg-[#2E7D32]/40"
                  }`}
                />
              ))}
            </div>

            {/* CTA */}
            <div
              className="mt-6 flex justify-center border-t border-black/5 pt-6"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleRequestService}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2E7D32] px-8 py-4 font-semibold text-white transition hover:bg-[#256428]"
              >
                Request this service
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
