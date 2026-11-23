export default function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-brand/10 bg-white p-6 md:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-heading text-ink">{title}</h2>

        <p className="mt-1 text-sm text-ink/50">{description}</p>
      </div>

      {children}
    </section>
  );
}
