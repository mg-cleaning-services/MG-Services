import { Link, useParams } from "react-router-dom";

import Navbar from "@/components/landing/Navbar";
import usePublicEmployeeProfile from "@/hooks/usePublicEmployeeProfile";

export default function EmployeeProfile() {
  const { slug } = useParams();

  const { employee, loading, error } = usePublicEmployeeProfile(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] pt-20">
        <Navbar />

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
          <p className="text-[#1A1A1A]/60">Loading employee profile...</p>
        </div>
      </main>
    );
  }

  if (error || !employee) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] pt-20">
        <Navbar />

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-heading text-3xl text-[#1A1A1A]">
              Employee profile not available
            </h1>

            <Link
              to="/"
              className="mt-6 inline-block font-medium text-[#2E7D32]"
            >
              Back to MG Cleaning
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9F7] pt-20">
      <Navbar />

      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Employee photo */}
            <div className="relative">
              <div className="aspect-[4/5] max-h-[680px] overflow-hidden rounded-[2rem] bg-[#E8F5E9]">
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Experience card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm md:right-auto">
                <p className="font-heading text-2xl text-[#1A1A1A]">
                  {employee.years}+ years
                </p>

                <p className="text-sm text-[#1A1A1A]/55">
                  Professional experience
                </p>
              </div>
            </div>

            {/* Employee introduction */}
            <div className="lg:py-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
                Meet your cleaner
              </p>

              <h1 className="mt-4 font-heading text-5xl leading-[0.95] text-[#1A1A1A] md:text-6xl lg:text-7xl">
                {employee.name}
              </h1>

              <p className="mt-5 text-xl text-[#1A1A1A]/55">{employee.role}</p>

              {employee.tagline && (
                <p className="mt-8 text-2xl leading-relaxed text-[#1A1A1A]/85 md:text-3xl">
                  “{employee.tagline}”
                </p>
              )}

              {/* Specialties */}
              <div className="mt-8 flex flex-wrap gap-2">
                {employee.specialties?.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-medium text-[#2E7D32]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* MG trust */}
              <div className="mt-10 border-t border-[#1A1A1A]/10 pt-8">
                <p className="text-sm font-semibold text-[#2E7D32]">
                  MG Cleaning Team Member
                </p>

                <p className="mt-2 max-w-lg text-sm leading-6 text-[#1A1A1A]/55">
                  Part of our trusted cleaning team, selected to provide
                  professional and reliable service to our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            About me
          </p>

          <h2 className="mt-3 font-heading text-3xl text-[#1A1A1A] md:text-5xl">
            A little about {employee.name.split(" ")[0]}
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#1A1A1A]/65 md:text-xl">
            {employee.bio}
          </p>
        </div>
      </section>

      {/* PERSONAL & PROFESSIONAL DETAILS */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
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
        <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            MG Cleaning Melbourne
          </p>

          <h2 className="mt-4 font-heading text-3xl leading-tight md:text-5xl">
            Trust starts with knowing
            <br className="hidden md:block" />
            who is entering your home.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            We believe a great cleaning service is built on more than a clean
            home. It starts with reliable people, clear communication and
            confidence in the person providing your service.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
              MG Cleaning Team Member
            </span>

            <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
              Professional Cleaner
            </span>
          </div>
        </div>
      </section>

      {/* BACK NAVIGATION */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2E7D32] transition-all hover:gap-3"
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
    <article className="rounded-3xl border border-black/5 bg-white p-7 md:p-9">
      <h3 className="font-heading text-2xl text-[#1A1A1A]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/50">{description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-[#F1F6F2] px-4 py-2 text-sm font-medium text-[#31583E]"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
