export default function EmployeeBasicFields({ form, onChange }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Name *
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={onChange}
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Role *
        </label>

        <input
          id="role"
          name="role"
          type="text"
          required
          value={form.role}
          onChange={onChange}
          placeholder="Cleaner"
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Location *
        </label>

        <input
          id="location"
          name="location"
          type="text"
          required
          value={form.location}
          onChange={onChange}
          placeholder="Melbourne"
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>

      {/* Years Experience */}
      <div>
        <label
          htmlFor="years"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Years of Experience *
        </label>

        <input
          id="years"
          name="years"
          type="number"
          min="0"
          required
          value={form.years}
          onChange={onChange}
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Phone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>

      {/* Tagline */}
      <div className="md:col-span-2">
        <label
          htmlFor="tagline"
          className="mb-2 block text-sm font-medium text-[#1A1A1A]"
        >
          Profile Tagline
        </label>

        <input
          id="tagline"
          name="tagline"
          type="text"
          value={form.tagline}
          onChange={onChange}
          placeholder="Reliable, friendly and detail-oriented cleaner"
          className="w-full rounded-xl border border-[#1A1A1A]/10 px-4 py-3 outline-none transition focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        />
      </div>
    </div>
  );
}
