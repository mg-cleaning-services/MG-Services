import EmployeeBasicFields from "@/components/admin/team/forms/EmployeeBasicFields";
import EmployeeManagementFields from "@/components/admin/team/forms/EmployeeManagementFields";
import EmployeePhotoField from "@/components/admin/team/forms/EmployeePhotoField";
import EmployeeProfileFields from "@/components/admin/team/forms/EmployeeProfileFields";

import useEmployeeForm from "@/hooks/useEmployeeForm";

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  submitLabel = "Save Employee",
  mode = "admin",
  showPhoto = true,
}) {
  const {
    form,
    photoPreview,

    handleChange,
    handlePhotoChange,
    handleSubmit,
  } = useEmployeeForm({
    employee,
    onSubmit,
  });

  const isAdmin = mode === "admin";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <EmployeeBasicFields form={form} onChange={handleChange} />

      {showPhoto && (
        <EmployeePhotoField
          photoPreview={photoPreview}
          onPhotoChange={handlePhotoChange}
        />
      )}

      <EmployeeProfileFields form={form} onChange={handleChange} />

      {isAdmin && (
        <EmployeeManagementFields form={form} onChange={handleChange} />
      )}

      <div className="flex justify-end gap-3 border-t border-[#1A1A1A]/10 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#1A1A1A]/10 px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

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
