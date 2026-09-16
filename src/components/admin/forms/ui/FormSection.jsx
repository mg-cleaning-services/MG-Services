export default function FormSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}
