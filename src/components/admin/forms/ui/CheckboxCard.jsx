export default function CheckboxCard({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
      <input type="checkbox" checked={checked} onChange={onChange} />

      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
}
