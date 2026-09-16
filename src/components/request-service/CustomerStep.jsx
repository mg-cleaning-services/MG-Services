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
    <div className="mt-10 rounded-2xl border border-gray-200 p-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Step 4
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          How can we contact you?
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          We'll use these details to discuss your request, answer any questions
          and confirm the service with you.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
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

        <CustomerInput
          label="Phone number"
          type="tel"
          value={value.phone}
          onChange={(newValue) => onFieldChange("phone", newValue)}
          placeholder="04XX XXX XXX"
        />

        <CustomerInput
          label="Email"
          type="email"
          value={value.email}
          onChange={(newValue) => onFieldChange("email", newValue)}
          placeholder="john@email.com"
        />
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700">
          How would you prefer us to contact you?
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {contactOptions.map((option) => {
            const selected = value.preferredContact === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFieldChange("preferredContact", option.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <p className="font-medium">{option.title}</p>

                <p
                  className={`mt-1 text-sm ${
                    selected ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
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
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
    </div>
  );
}
