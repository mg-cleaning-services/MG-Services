import CommaField from "./CommaField";

export default function EmployeeProfileFields({ form, onChange }) {
  return (
    <section>
      <h3 className="text-lg font-heading text-ink mb-4">Profile</h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="employee-bio"
            className="block text-sm font-medium text-ink mb-2"
          >
            Bio
          </label>

          <textarea
            id="employee-bio"
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 outline-none resize-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
          />
        </div>

        <CommaField
          id="employee-languages"
          label="Languages"
          name="languages"
          value={form.languages}
          onChange={onChange}
          placeholder="English, Italian"
        />

        <CommaField
          id="employee-specialties"
          label="Specialties"
          name="specialties"
          value={form.specialties}
          onChange={onChange}
          placeholder="Deep Cleaning, Family Homes, Pet-Friendly Homes"
        />

        <CommaField
          id="employee-traits"
          label="Working Style & Personality"
          name="traits"
          value={form.traits}
          onChange={onChange}
          placeholder="Detail Oriented, Friendly, Organised, Reliable"
        />

        <CommaField
          id="employee-interests"
          label="Interests & Hobbies"
          name="interests"
          value={form.interests}
          onChange={onChange}
          placeholder="Cooking, Dogs, Weekend Markets"
        />
      </div>
    </section>
  );
}
