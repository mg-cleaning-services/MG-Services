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
        className="block text-sm font-medium text-ink mb-2"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl border border-ink/10 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
      />

      <p className="text-xs text-ink/40 mt-1">
        Separate values with commas.
      </p>
    </div>
  );
}
