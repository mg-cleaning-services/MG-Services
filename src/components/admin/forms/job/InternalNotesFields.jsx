export default function InternalNotesFields({ value, onChange }) {
  return (
    <textarea
      rows={5}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Cleaning priorities, special requests... This text is included in the WhatsApp message sent to the cleaner."
      className="w-full rounded-xl border border-gray-300 px-4 py-3"
    />
  );
}
