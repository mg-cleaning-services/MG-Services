export default function InternalNotesFields({ value, onChange }) {
  return (
    <textarea
      rows={5}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-3"
    />
  );
}
