import PhoneInput from "@/components/admin/forms/ui/PhoneInput";

const contactOptions = [
  {
    value: "whatsapp",
    title: "WhatsApp",
    description: "Message me on WhatsApp",
  },
  {
    value: "phone",
    title: "Phone",
    description: "Give me a call",
  },
  {
    value: "email",
    title: "Email",
    description: "Contact me by email",
  },
];

export default function CustomerStep({ value, onFieldChange }) {
  return (
    <div>
      {/* STEP HEADER */}
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
          Contact Details
        </p>

        <h2 className="font-heading text-2xl leading-tight text-[#1A1A1A] md:text-3xl">
          How can we contact you?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60 md:text-base">
          We'll use these details to discuss your request, answer any questions
          and confirm the service with you.
        </p>
      </div>

      {/* CONTACT DETAILS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <CustomerInput
          label="First name"
          value={value.firstName}
          onChange={(newValue) => onFieldChange("firstName", newValue)}
          placeholder="John"
        />

        <CustomerInput
          label="Last name"
          value={value.lastName}
          onChange={(newValue) => onFieldChange("lastName", newValue)}
          placeholder="Smith"
        />

        <PhoneInput
          label="Phone number"
          value={value.phone}
          onChange={(newValue) => onFieldChange("phone", newValue)}
          defaultCountry="AU"
          required
        />

        <CustomerInput
          label="Email"
          type="email"
          value={value.email}
          onChange={(newValue) => onFieldChange("email", newValue)}
          placeholder="john@email.com"
        />
      </div>

      {/* CONTACT PREFERENCE */}
      <div className="mt-8 border-t border-[#2E7D32]/10 pt-7">
        <p className="text-sm font-semibold text-[#1A1A1A]">
          How would you prefer us to contact you?
        </p>

        <p className="mt-1 text-sm text-[#1A1A1A]/50">
          Choose the easiest way for us to get in touch.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {contactOptions.map((option) => {
            const selected = value.preferredContact === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFieldChange("preferredContact", option.value)}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                  selected
                    ? "border-[#2E7D32] bg-[#E8F5E9]"
                    : "border-[#2E7D32]/10 bg-[#F9FAF9] hover:border-[#2E7D32]/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    selected ? "text-[#2E7D32]" : "text-[#1A1A1A]"
                  }`}
                >
                  {option.title}
                </p>

                <p className="mt-1.5 text-sm leading-relaxed text-[#1A1A1A]/50">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* INFORMATION */}
      <div className="mt-8 rounded-2xl border border-[#2E7D32]/10 bg-[#E8F5E9]/50 p-5">
        <p className="text-sm leading-relaxed text-[#1A1A1A]/60">
          Sending this request does not confirm a booking. MG Cleaning will
          contact you to review the details, recommend the appropriate service
          if needed, and confirm availability.
        </p>
      </div>
    </div>
  );
}

function CustomerInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#1A1A1A]/70">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#2E7D32]/10 bg-[#F9FAF9] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-[#1A1A1A]/30 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/5"
      />
    </div>
  );
}
