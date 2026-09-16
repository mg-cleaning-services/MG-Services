export default function EmployeeManagementFields({ form, onChange }) {
  return (
    <section>
      <h3 className="text-lg font-heading text-[#1A1A1A] mb-4">Management</h3>

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
          onChange={onChange}
          className="w-full h-11 px-4 rounded-xl border border-[#1A1A1A]/10 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
        >
          <option value="active">Active</option>

          <option value="inactive">Inactive</option>
        </select>
      </div>

      <label className="flex items-center gap-3 mt-5 cursor-pointer">
        <input
          type="checkbox"
          name="publicProfile"
          checked={form.publicProfile}
          onChange={onChange}
          className="w-4 h-4 accent-[#2E7D32]"
        />

        <span className="text-sm text-[#1A1A1A]">
          Show this employee on the public team section
        </span>
      </label>
    </section>
  );
}
