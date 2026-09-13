export default function CleanerIntroductionCard({ employee, job }) {
  const serviceDate = job?.schedule?.date || "";
  const serviceTime = job?.schedule?.startTime || "";

  return (
    <div className="w-[700px] overflow-hidden rounded-3xl bg-[#F9FAF9] text-[#1A1A1A]">
      {/* Brand Header */}
      <div className="bg-[#1B3D1E] px-10 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-heading font-bold">
              MG<span className="text-[#4CAF50]">.</span>
            </div>

            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
              Cleaning Melbourne
            </p>
          </div>

          <div className="rounded-full bg-white/10 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
              Meet Your Cleaner
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="max-w-lg text-3xl font-heading leading-tight">
            Know who&apos;s coming before they arrive.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
            Real people, real accountability and professional care for your
            home.
          </p>
        </div>
      </div>

      {/* Employee */}
      <div className="px-10 py-10">
        <div className="flex items-center gap-8">
          <div className="relative shrink-0">
            <img
              src={employee.photo}
              alt={employee.name}
              className="h-48 w-48 rounded-3xl object-cover"
            />

            <div className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-[#F9FAF9] bg-[#2E7D32] text-lg text-white">
              ✓
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
              Your Cleaner
            </p>

            <h2 className="mt-2 text-4xl font-heading">{employee.name}</h2>

            <p className="mt-2 text-lg text-[#1A1A1A]/60">{employee.role}</p>

            {employee.years && (
              <div className="mt-5 inline-flex rounded-full bg-[#E8F5E9] px-4 py-2">
                <p className="text-sm font-semibold text-[#2E7D32]">
                  {employee.years} years of experience
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tagline */}
        {employee.tagline && (
          <div className="mt-9 rounded-3xl bg-white p-6 border border-[#2E7D32]/10">
            <p className="text-lg font-heading leading-relaxed text-[#1A1A1A]/80">
              “{employee.tagline}”
            </p>
          </div>
        )}

        {/* About */}
        {employee.bio && (
          <div className="mt-9">
            <SectionLabel>About {employee.name.split(" ")[0]}</SectionLabel>

            <p className="mt-3 leading-7 text-[#1A1A1A]/60">{employee.bio}</p>
          </div>
        )}

        {/* Specialties */}
        {employee.specialties?.length > 0 && (
          <div className="mt-8">
            <SectionLabel>Specialties</SectionLabel>

            <div className="mt-4 flex flex-wrap gap-2">
              {employee.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-medium text-[#2E7D32]"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Personal details */}
        <div className="mt-9 grid grid-cols-2 gap-5">
          {employee.traits?.length > 0 && (
            <InfoCard title="Known For">{employee.traits.join(" · ")}</InfoCard>
          )}

          {employee.languages?.length > 0 && (
            <InfoCard title="Languages">
              {employee.languages.join(" · ")}
            </InfoCard>
          )}
        </div>

        {/* Interests */}
        {employee.interests?.length > 0 && (
          <div className="mt-5">
            <InfoCard title="Outside of Work">
              {employee.interests.join(" · ")}
            </InfoCard>
          </div>
        )}

        {/* Appointment */}
        {(serviceDate || serviceTime) && (
          <div className="mt-10 rounded-3xl bg-[#1B3D1E] p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4CAF50]">
              Your Upcoming Service
            </p>

            <div className="mt-5 flex gap-12">
              {serviceDate && (
                <div>
                  <p className="text-xs text-white/50">Date</p>

                  <p className="mt-1 font-semibold">{serviceDate}</p>
                </div>
              )}

              {serviceTime && (
                <div>
                  <p className="text-xs text-white/50">Time</p>

                  <p className="mt-1 font-semibold">{serviceTime}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2E7D32]/10 bg-white px-10 py-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-[#1A1A1A]">
              MG Cleaning Melbourne
            </p>

            <p className="mt-1 text-xs text-[#1A1A1A]/50">
              Built on trust, delivered with care.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />

            <p className="text-xs font-medium text-[#1A1A1A]/50">Melbourne</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
      {children}
    </p>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white p-5 border border-[#2E7D32]/10">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/60">{children}</p>
    </div>
  );
}
