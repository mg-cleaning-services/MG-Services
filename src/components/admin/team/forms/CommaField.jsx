export default function CommaField({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#1A1A1A] mb-2"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
      />

      <p className="text-xs text-[#1A1A1A]/40 mt-1">
        Separate values with commas.
      </p>
    </div>
  );
}
