import EmployeeBasicFields from "./EmployeeBasicFields";
import EmployeeManagementFields from "./EmployeeManagementFields";
import EmployeePhotoField from "./EmployeePhotoField";
import EmployeeProfileFields from "./EmployeeProfileFields";

import useEmployeeForm from "@/hooks/useEmployeeForm";

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  submitLabel = "Save Changes",
}) {
  const { form, photoPreview, handleChange, handlePhotoChange, handleSubmit } =
    useEmployeeForm({
      employee,
      onSubmit,
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmployeeBasicFields form={form} onChange={handleChange} />

      <EmployeePhotoField
        employeeName={form.name}
        photoPreview={photoPreview}
        onPhotoChange={handlePhotoChange}
      />

      <EmployeeProfileFields form={form} onChange={handleChange} />

      <EmployeeManagementFields form={form} onChange={handleChange} />

      <div className="flex justify-end gap-3 border-t border-[#1A1A1A]/10 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#1A1A1A]/10 px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
