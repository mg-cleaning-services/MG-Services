import { Link, useParams } from "react-router-dom";
import { getPublicEmployeeBySlug } from "@/services/employeeService";

export default function EmployeeProfile() {
  const { slug } = useParams();

  const employee = getPublicEmployeeBySlug(slug);

  if (!employee) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9FAF9] px-6">
        <div className="text-center">
          <h1 className="text-3xl font-heading text-[#1A1A1A]">
            Employee profile not available
          </h1>

          <Link to="/" className="inline-block mt-6 text-[#2E7D32] font-medium">
            Back to MG Cleaning
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9F7]">
      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Employee photo */}
            <div className="relative">
              <div className="aspect-[4/5] max-h-[680px] rounded-[2rem] overflow-hidden bg-[#E8F5E9]">
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Experience card */}
              <div className="absolute bottom-5 left-5 right-5 md:right-auto bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg">
                <p className="text-2xl font-heading text-[#1A1A1A]">
                  {employee.years}+ years
                </p>

                <p className="text-sm text-[#1A1A1A]/55">
                  Professional experience
                </p>
              </div>
            </div>

            {/* Employee introduction */}
            <div className="lg:py-8">
              <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase">
                Meet your cleaner
              </p>

              <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-heading text-[#1A1A1A] leading-[0.95]">
                {employee.name}
              </h1>

              <p className="mt-5 text-xl text-[#1A1A1A]/55">
                {employee.role} · {employee.location}
              </p>

              {employee.tagline && (
                <p className="mt-8 text-2xl md:text-3xl leading-relaxed text-[#1A1A1A]/85">
                  “{employee.tagline}”
                </p>
              )}

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mt-8">
                {employee.specialties?.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* MG trust */}
              <div className="mt-10 pt-8 border-t border-[#1A1A1A]/10">
                <p className="text-sm font-semibold text-[#2E7D32]">
                  MG Cleaning Team Member
                </p>

                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/55 max-w-lg">
                  Part of our trusted cleaning team, selected to provide
                  professional and reliable service to our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase">
            About me
          </p>

          <h2 className="mt-3 text-3xl md:text-5xl font-heading text-[#1A1A1A]">
            A little about {employee.name.split(" ")[0]}
          </h2>

          <p className="mt-6 text-lg md:text-xl leading-8 text-[#1A1A1A]/65">
            {employee.bio}
          </p>
        </div>
      </section>

      {/* PERSONAL & PROFESSIONAL DETAILS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="grid md:grid-cols-2 gap-6">
          <ProfileDetail
            title="What I'm great at"
            description="Services and environments where I have the most experience."
            items={employee.specialties}
          />

          <ProfileDetail
            title="My working style"
            description="What you can expect from me while I'm working in your home."
            items={employee.traits}
          />

          <ProfileDetail
            title="Languages I speak"
            description="Languages I'm comfortable communicating with clients in."
            items={employee.languages}
          />

          <ProfileDetail
            title="A little more about me"
            description="Some of the things I enjoy outside of work."
            items={employee.interests}
          />
        </div>
      </section>
      {/* TRUST */}
      <section className="bg-[#1F3B2D] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/50">
            MG Cleaning Melbourne
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-heading leading-tight">
            Trust starts with knowing
            <br className="hidden md:block" />
            who is entering your home.
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-8 text-white/65">
            We believe a great cleaning service is built on more than a clean
            home. It starts with reliable people, clear communication and
            confidence in the person providing your service.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 rounded-full border border-white/15 text-sm text-white/80">
              MG Cleaning Team Member
            </span>

            <span className="px-4 py-2 rounded-full border border-white/15 text-sm text-white/80">
              Professional Cleaner
            </span>
          </div>
        </div>
      </section>

      {/* BACK NAVIGATION */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2E7D32] hover:gap-3 transition-all"
          >
            <span aria-hidden="true">←</span>
            Back to MG Cleaning
          </Link>
        </div>
      </section>
    </main>
  );
}
function ProfileDetail({ title, description, items = [] }) {
  if (!items?.length) {
    return null;
  }

  return (
    <article className="bg-white rounded-3xl p-7 md:p-9 border border-black/5">
      <h3 className="text-2xl font-heading text-[#1A1A1A]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/50">{description}</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {items.map((item) => (
          <span
            key={item}
            className="px-4 py-2 rounded-full bg-[#F1F6F2] text-[#31583E] text-sm font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
