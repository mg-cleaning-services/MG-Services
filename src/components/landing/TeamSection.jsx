import { motion } from "framer-motion";

import EmployeeCard from "@/components/employees/EmployeeCard";
import usePublicEmployees from "@/hooks/usePublicEmployees";

export default function TeamSection() {
  const { employees, loading, error } = usePublicEmployees();

  return (
    <section id="team" className="py-24 md:py-40 bg-[#F9FAF9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Our Team
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[#1A1A1A] mb-6">
            Meet the people behind the clean
          </h2>

          <p className="text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto leading-relaxed">
            We believe you should know who's coming to your home. These are real
            people who genuinely care about what they do.
          </p>
        </motion.div>

        {loading && (
          <p className="text-center text-[#1A1A1A]/60">Loading our team...</p>
        )}

        {!loading && error && (
          <p className="text-center text-[#1A1A1A]/60">
            Our team is currently unavailable.
          </p>
        )}

        {!loading && !error && employees.length === 0 && (
          <p className="text-center text-[#1A1A1A]/60">
            Team profiles are coming soon.
          </p>
        )}

        {!loading && !error && employees.length > 0 && (
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {employees.map((member, i) => (
              <EmployeeCard key={member.id} employee={member} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
