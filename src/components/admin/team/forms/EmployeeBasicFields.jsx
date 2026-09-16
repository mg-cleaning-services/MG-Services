export default function EmployeeBasicFields({ form, onChange }) {
  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10";

  const labelClass = "block text-sm font-medium text-[#1A1A1A] mb-2";

  return (
    <section>
      <h3 className="text-lg font-heading text-[#1A1A1A] mb-4">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employee-name" className={labelClass}>
            Name
          </label>

          <input
            id="employee-name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="employee-role" className={labelClass}>
            Role
          </label>

          <input
            id="employee-role"
            name="role"
            value={form.role}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="employee-location" className={labelClass}>
            Location
          </label>

          <input
            id="employee-location"
            name="location"
            value={form.location}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="employee-years" className={labelClass}>
            Years of experience
          </label>

          <input
            id="employee-years"
            name="years"
            type="number"
            min="0"
            value={form.years}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="employee-phone" className={labelClass}>
            Phone
          </label>

          <input
            id="employee-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="61477507874"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="employee-email" className={labelClass}>
            Email
          </label>

          <input
            id="employee-email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="employee@example.com"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="employee-tagline" className={labelClass}>
            Profile Tagline
          </label>

          <input
            id="employee-tagline"
            name="tagline"
            type="text"
            value={form.tagline}
            onChange={onChange}
            placeholder="Detail-focused, warm and always happy around pets."
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
