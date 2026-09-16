import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Globe2,
  Heart,
  House,
  PawPrint,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function CleanerIntroductionCard({ employee, job }) {
  const serviceDate = formatServiceDate(job?.schedule?.date);
  const serviceTime = formatServiceTime(job?.schedule?.startTime);

  const firstName = formatName(
    employee?.name?.trim().split(/\s+/)[0] || "Your cleaner",
  );

  const displayName = formatName(employee?.name || "");
  const displayRole = formatName(employee?.role || "");

  const years = Number(employee?.years) || 0;

  return (
    <div className="w-[700px] overflow-hidden rounded-3xl bg-[#EEF2EC] text-[#1A1A1A]">
      {/* Brand Header */}
      <div className="bg-[#143718] px-10 pb-9 pt-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-heading font-bold">
              MG<span className="text-[#4CAF50]">.</span>
            </div>

            <p className="mt-1 text-[13px] uppercase tracking-[0.24em] text-white/65">
              Cleaning Melbourne
            </p>
          </div>

          <div className="rounded-full bg-white/[0.07] px-5 py-2.5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Meet Your Cleaner
            </p>
          </div>
        </div>

        <p className="mt-9 text-[17px] leading-7 text-white/70">
          We believe trust starts with knowing who&apos;s coming to your home.
        </p>
      </div>

      {/* Cleaner Identity */}
      <div className="bg-[#1A1D1B] px-10 py-10 text-white">
        <div className="flex items-center gap-8">
          <div className="relative shrink-0">
            {employee?.photo ? (
              <img
                src={employee.photo}
                alt={displayName}
                className="h-48 w-48 rounded-[28px] object-cover"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-[28px] bg-[#E8F5E9] text-5xl font-heading text-[#2E7D32]">
                {getInitials(employee?.name)}
              </div>
            )}

            <div className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-[#1A1D1B] bg-[#2E7D32] text-white">
              <Check size={23} strokeWidth={2.5} />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#74D681]">
              Your Cleaner
            </p>

            <h1 className="mt-3 text-[38px] font-heading leading-tight text-white">
              {displayName}
            </h1>

            <p className="mt-2 text-xl text-white/70">{displayRole}</p>

            {years > 0 && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#123D1B] px-5 py-3">
                <BriefcaseBusiness
                  size={19}
                  className="text-[#74D681]"
                  strokeWidth={2}
                />

                <p className="text-[16px] font-semibold text-[#74D681]">
                  {years} {years === 1 ? "year" : "years"} of experience
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="px-10 py-10">
        {/* Tagline */}
        {employee?.tagline && (
          <p className="text-[25px] font-heading leading-[1.45] text-[#1B3D1E]">
            “{employee.tagline}”
          </p>
        )}

        {/* About */}
        {employee?.bio && (
          <div className="mt-8">
            <SectionLabel>Meet {firstName}</SectionLabel>

            <p className="mt-4 text-[17px] leading-8 text-[#1A1A1A]/75">
              {employee.bio}
            </p>
          </div>
        )}

        {/* Specialties */}
        {employee?.specialties?.length > 0 && (
          <div className="mt-10">
            <SectionLabel>Specialties</SectionLabel>

            <div className="mt-5 flex flex-wrap gap-3">
              {employee.specialties.map((specialty, index) => (
                <SpecialtyChip
                  key={specialty}
                  specialty={specialty}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Personal Details */}
        {(employee?.traits?.length > 0 ||
          employee?.languages?.length > 0 ||
          employee?.interests?.length > 0) && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-[#1B3D1E]/10 bg-[#F7F9F5] px-7">
            {employee?.traits?.length > 0 && (
              <ProfileRow
                icon={<UserRound size={20} strokeWidth={2} />}
                title="Known For"
              >
                {employee.traits.join(" · ")}
              </ProfileRow>
            )}

            {employee?.languages?.length > 0 && (
              <ProfileRow
                icon={<Globe2 size={20} strokeWidth={2} />}
                title="Languages"
              >
                {employee.languages.join(" · ")}
              </ProfileRow>
            )}

            {employee?.interests?.length > 0 && (
              <ProfileRow
                icon={<Heart size={20} strokeWidth={2} />}
                title="Outside of Work"
                last
              >
                {employee.interests.join(" · ")}
              </ProfileRow>
            )}
          </div>
        )}

        {/* Appointment */}
        {(serviceDate || serviceTime) && (
          <div className="relative mt-10 overflow-hidden rounded-3xl bg-[#143718] text-white">
            {/* Decorative background */}
            <div className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-white/[0.025]" />
            <div className="absolute -bottom-5 right-14 h-24 w-24 rounded-full bg-white/[0.025]" />

            <div className="relative border-b border-white/10 px-7 py-5">
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={20}
                  className="text-[#74D681]"
                  strokeWidth={2}
                />

                <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#74D681]">
                  Your Upcoming Service
                </p>
              </div>
            </div>

            <div className="relative flex px-7 py-7">
              {serviceDate && (
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wider text-white/50">
                    Date
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {serviceDate}
                  </p>
                </div>
              )}

              {serviceDate && serviceTime && (
                <div className="mx-7 w-px bg-white/10" />
              )}

              {serviceTime && (
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wider text-white/50">
                    Time
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {serviceTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trust */}
        <div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#DDEBDD] px-6 py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-white">
            <Check size={17} strokeWidth={2.5} />
          </div>

          <p className="text-[16px] leading-6 text-[#1A1A1A]/75">
            <span className="font-semibold text-[#1B3D1E]">{firstName}</span>{" "}
            has been personally assigned to your service by MG Cleaning.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1A1D1B] px-10 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-heading font-semibold">
              MG Cleaning Melbourne
            </p>

            <p className="mt-1 text-[13px] text-white/55">
              Built on trust, delivered with care.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#2E7D32]" />

            <p className="text-[13px] font-medium text-white/60">Melbourne</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#2E7D32]">
      {children}
    </p>
  );
}

function SpecialtyChip({ specialty, index }) {
  const icons = [
    <Sparkles key="sparkles" size={19} strokeWidth={2} />,
    <House key="house" size={19} strokeWidth={2} />,
    <PawPrint key="paw" size={19} strokeWidth={2} />,
  ];

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-[#DCECDD] px-5 py-3 text-[#1B5E20]">
      {icons[index % icons.length]}

      <span className="text-[16px] font-semibold">{specialty}</span>
    </div>
  );
}

function ProfileRow({ icon, title, children, last = false }) {
  return (
    <div
      className={`grid grid-cols-[175px_1fr] items-center gap-5 py-6 ${
        last ? "" : "border-b border-[#1B3D1E]/10"
      }`}
    >
      <div className="flex items-center gap-3 text-[#1B5E20]">
        {icon}

        <p className="text-[13px] font-bold uppercase tracking-[0.16em]">
          {title}
        </p>
      </div>

      <p className="text-[16px] leading-7 text-[#1A1A1A]/75">{children}</p>
    </div>
  );
}

function formatServiceDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatServiceTime(time) {
  if (!time) {
    return "";
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatName(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(name = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "MG";
}
