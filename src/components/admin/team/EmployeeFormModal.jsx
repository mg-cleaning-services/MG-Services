import EmployeeForm from "@/components/admin/team/EmployeeForm";

export default function EmployeeFormModal({
  mode,
  employee,
  onClose,
  onSubmit,
}) {
  if (!mode) {
    return null;
  }

  const isCreating = mode === "create";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#2E7D32] text-sm font-semibold tracking-[0.15em] uppercase mb-2">
              Employee
            </p>

            <h2 className="text-2xl md:text-3xl font-heading text-[#1A1A1A]">
              {isCreating ? "Add Employee" : "Edit Employee"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <EmployeeForm
          employee={isCreating ? null : employee}
          onCancel={onClose}
          onSubmit={onSubmit}
          submitLabel={isCreating ? "Create Employee" : "Save Changes"}
        />
      </div>
    </div>
  );
}
