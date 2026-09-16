export default function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 md:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-heading text-[#1A1A1A]">{title}</h2>

        <p className="mt-1 text-sm text-[#1A1A1A]/50">{description}</p>
      </div>

      {children}
    </section>
  );
}
