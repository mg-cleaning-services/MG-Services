import { useEffect, useState } from "react";

export default function DetailSectionNavigation({ sections }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (sectionElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      },
    );

    sectionElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  function handleNavigate(sectionId) {
    const element = document.getElementById(sectionId);

    if (!element) {
      return;
    }

    setActiveSection(sectionId);

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <nav className="rounded-5">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide lg:justify-center">
        {sections.map((section) => {
          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleNavigate(section.id)}
              className={[
                "relative shrink-0 rounded-t-lg px-3 py-3",
                "text-sm font-medium transition",
                active
                  ? "text-[#2E7D32]"
                  : "text-[#1A1A1A]/55 hover:bg-[#F9FAF9] hover:text-[#1A1A1A]",
              ].join(" ")}
            >
              {section.label}

              <span
                className={[
                  "absolute bottom-0 left-3 right-3",
                  "h-0.5 rounded-full bg-[#2E7D32]",
                  "transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
