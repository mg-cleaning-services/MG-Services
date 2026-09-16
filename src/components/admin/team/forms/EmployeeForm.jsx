import EmployeeBasicFields from "./EmployeeBasicFields";
import EmployeeManagementFields from "./EmployeeManagementFields";
import EmployeeProfileFields from "./EmployeeProfileFields";

import useEmployeeForm from "@/hooks/useEmployeeForm";

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  submitLabel = "Save Changes",
}) {
  const { form, handleChange, handleSubmit } = useEmployeeForm({
    employee,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmployeeBasicFields form={form} onChange={handleChange} />

      <EmployeeProfileFields form={form} onChange={handleChange} />

      <EmployeeManagementFields form={form} onChange={handleChange} />

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
