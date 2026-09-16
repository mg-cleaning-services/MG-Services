import { Link, useNavigate } from "react-router-dom";

import EmployeeForm from "@/components/admin/team/forms/EmployeeForm";
import useEmployeeDetail from "@/hooks/useEmployeeDetail";

export default function EmployeeDetail() {
  const navigate = useNavigate();

  const {
    employee,

    loading,
    loadError,

    saving,
    saveError,

    saveEmployee,
  } = useEmployeeDetail();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[#1A1A1A]/60">Loading employee...</p>
        </div>
      </main>
    );
  }

  if (loadError || !employee) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link to="/admin/team" className="text-sm font-medium text-[#2E7D32]">
            ← Back to Team
          </Link>

          <h1 className="mt-8 text-3xl font-heading text-[#1A1A1A]">
            Employee not found
          </h1>

          <p className="mt-3 text-[#1A1A1A]/60">
            {loadError || "This employee does not exist."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/admin/team" className="text-sm font-medium text-[#2E7D32]">
          ← Back to Team
        </Link>

        <header className="mt-8 mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            {employee.employeeCode || "Employee"}
          </p>

          <h1 className="mt-2 text-4xl font-heading text-[#1A1A1A]">
            {employee.name}
          </h1>

          <p className="mt-3 text-[#1A1A1A]/60">
            Edit employee information and public profile.
          </p>
        </header>

        {saveError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

        <section className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-6 md:p-8">
          <EmployeeForm
            employee={employee}
            onSubmit={saveEmployee}
            onCancel={() => navigate("/admin/team")}
            submitLabel={saving ? "Saving..." : "Save Changes"}
          />
        </section>
      </div>
    </main>
  );
}
