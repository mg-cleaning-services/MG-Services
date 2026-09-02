import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  role: "",
  location: "",
  years: "",
  languages: "",
  tags: "",
  photo: "",
  bio: "",
  availability: "available",
  publicProfile: false,
  status: "active",
};

function employeeToForm(employee) {
  if (!employee) {
    return EMPTY_FORM;
  }

  return {
    name: employee.name ?? "",
    role: employee.role ?? "",
    location: employee.location ?? "",
    years: employee.years ?? "",
    languages: employee.languages?.join(", ") ?? "",
    tags: employee.tags?.join(", ") ?? "",
    photo: employee.photo ?? "",
    bio: employee.bio ?? "",
    availability: employee.availability ?? "available",
    publicProfile: employee.publicProfile ?? false,
    status: employee.status ?? "active",
  };
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  submitLabel = "Save Changes",
}) {
  const [form, setForm] = useState(() => employeeToForm(employee));

  useEffect(() => {
    setForm(employeeToForm(employee));
  }, [employee]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...(employee ?? {}),
      name: form.name.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      years: Number(form.years),
      languages: form.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      photo: form.photo.trim(),
      bio: form.bio.trim(),
      availability: form.availability,
      publicProfile: form.publicProfile,
      status: form.status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic information */}
      <div>
        <h3 className="text-lg font-heading text-[#1A1A1A] mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="employee-name"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Name
            </label>

            <input
              id="employee-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>

          <div>
            <label
              htmlFor="employee-role"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Role
            </label>

            <input
              id="employee-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>

          <div>
            <label
              htmlFor="employee-location"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Location
            </label>

            <input
              id="employee-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>

          <div>
            <label
              htmlFor="employee-years"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Years of experience
            </label>

            <input
              id="employee-years"
              name="years"
              type="number"
              min="0"
              value={form.years}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>
        </div>
      </div>

      {/* Profile */}
      <div>
        <h3 className="text-lg font-heading text-[#1A1A1A] mb-4">Profile</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="employee-photo"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Photo path
            </label>

            <input
              id="employee-photo"
              name="photo"
              value={form.photo}
              onChange={handleChange}
              placeholder="/images/Sarah.png"
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>

          <div>
            <label
              htmlFor="employee-bio"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Bio
            </label>

            <textarea
              id="employee-bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 outline-none resize-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>

          <div>
            <label
              htmlFor="employee-languages"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Languages
            </label>

            <input
              id="employee-languages"
              name="languages"
              value={form.languages}
              onChange={handleChange}
              placeholder="English, Italian"
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />

            <p className="text-xs text-[#1A1A1A]/40 mt-1">
              Separate languages with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="employee-tags"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Tags
            </label>

            <input
              id="employee-tags"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Reliable, Pet Friendly, Deep Cleaning Expert"
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            />

            <p className="text-xs text-[#1A1A1A]/40 mt-1">
              Separate tags with commas.
            </p>
          </div>
        </div>
      </div>

      {/* Management */}
      <div>
        <h3 className="text-lg font-heading text-[#1A1A1A] mb-4">Management</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="employee-availability"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Availability
            </label>

            <select
              id="employee-availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="employee-status"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Status
            </label>

            <select
              id="employee-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 mt-5 cursor-pointer">
          <input
            type="checkbox"
            name="publicProfile"
            checked={form.publicProfile}
            onChange={handleChange}
            className="w-4 h-4 accent-[#2E7D32]"
          />

          <span className="text-sm text-[#1A1A1A]">
            Show this employee on the public team section
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[#1A1A1A]/10 text-sm font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-medium hover:bg-[#256628] transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
