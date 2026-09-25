import InternationalPhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PhoneInput({
  value,
  onChange,
  label = "Phone number",
  required = false,
  error = "",
  defaultCountry = "AU",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`
          flex items-center w-full rounded-xl border bg-white px-4
          transition-colors focus-within:ring-2 focus-within:ring-[#2E7D32]/10
          ${
            error
              ? "border-red-400 focus-within:border-red-400"
              : "border-black/10 focus-within:border-[#2E7D32]"
          }
        `}
      >
        <InternationalPhoneInput
          international
          defaultCountry={defaultCountry}
          countryCallingCodeEditable={false}
          value={value || undefined}
          onChange={(phone) => onChange(phone ?? "")}
          className="w-full py-3"
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-[#1A1A1A]/45">
          Include a valid country code so we can contact you by phone or
          WhatsApp.
        </p>
      )}
    </div>
  );
}
