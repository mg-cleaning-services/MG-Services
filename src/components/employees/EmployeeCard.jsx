import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function EmployeeCard({ employee, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="min-w-[280px] snap-center lg:min-w-0"
    >
      <Link
        to={`/team/${employee.slug}`}
        className="block h-full bg-white rounded-3xl overflow-hidden border border-[#2E7D32]/5 hover:border-[#2E7D32]/15 transition-all duration-500 hover:shadow-xl hover:shadow-[#2E7D32]/5 hover:-translate-y-1 group"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={employee.photo}
            alt={employee.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="p-6">
          <h3 className="text-lg font-heading text-[#1A1A1A] mb-1">
            {employee.name}
          </h3>

          <p className="text-sm text-[#2E7D32] font-medium mb-1">
            {employee.role}
          </p>

          <p className="text-xs text-[#1A1A1A]/50 mb-4">
            {employee.years} years experience ·{" "}
            {(employee.languages ?? []).join(", ")}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {[...(employee.traits ?? []), ...(employee.specialties ?? [])]
              .slice(0, 3)
              .map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-medium"
                >
                  {item}
                </span>
              ))}
          </div>

          <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">
            {employee.tagline}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
