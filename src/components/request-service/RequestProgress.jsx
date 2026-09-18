const steps = [
  {
    number: 1,
    shortNumber: "01",
    label: "Service",
  },
  {
    number: 2,
    shortNumber: "02",
    label: "Property",
  },
  {
    number: 3,
    shortNumber: "03",
    label: "Schedule",
  },
  {
    number: 4,
    shortNumber: "04",
    label: "Contact",
  },
  {
    number: 5,
    shortNumber: "05",
    label: "Review",
  },
];

export default function RequestProgress({ currentStep }) {
  const current = steps[currentStep - 1];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-7 md:mb-9">
      {/* MOBILE */}
      <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E7D32]">
              Step {current.shortNumber}
            </p>

            <p className="mt-1 font-heading text-xl text-[#1A1A1A]">
              {current.label}
            </p>
          </div>

          <p className="text-sm font-medium text-[#1A1A1A]/40">
            {currentStep} / {steps.length}
          </p>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E8F5E9]">
          <div
            className="h-full rounded-full bg-[#2E7D32] transition-all duration-500"
            style={{
              width: `${(currentStep / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="relative mx-auto max-w-4xl">
          {/* BACKGROUND LINE */}
          <div className="absolute left-[8%] right-[8%] top-5 h-px bg-[#2E7D32]/10" />

          {/* ACTIVE LINE */}
          <div
            className="absolute left-[8%] top-5 h-px bg-[#2E7D32] transition-all duration-500"
            style={{
              width: `${progress * 0.84}%`,
            }}
          />

          <div className="relative grid grid-cols-5">
            {steps.map((step) => {
              const completed = step.number < currentStep;

              const active = step.number === currentStep;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                      completed
                        ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                        : active
                          ? "border-[#2E7D32] bg-white text-[#2E7D32] shadow-md shadow-[#2E7D32]/10"
                          : "border-[#2E7D32]/10 bg-[#F9FAF9] text-[#1A1A1A]/30"
                    }`}
                  >
                    {completed ? "✓" : step.shortNumber}
                  </div>

                  <p
                    className={`mt-3 text-sm font-semibold transition-colors ${
                      active
                        ? "text-[#1A1A1A]"
                        : completed
                          ? "text-[#2E7D32]"
                          : "text-[#1A1A1A]/35"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
