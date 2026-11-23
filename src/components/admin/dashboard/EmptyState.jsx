export default function EmptyState({ text }) {
  return (
    <div className="rounded-2xl bg-surface px-5 py-8 text-center">
      <p className="text-sm text-ink/50">{text}</p>
    </div>
  );
}
