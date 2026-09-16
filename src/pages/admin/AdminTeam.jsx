import { Link } from "react-router-dom";

import EmployeeAdminCard from "@/components/admin/team/EmployeeAdminCard";
import EmployeeFilters from "@/components/admin/team/EmployeeFilters";

import useAdminTeam from "@/hooks/useAdminTeam";

export default function AdminTeam() {
  const {
    employees,
    filteredEmployees,

    search,
    setSearch,

    role,
    setRole,

    location,
    setLocation,

    roles,
    locations,

    stats,

    loading,
    error,

    handleDeleteEmployee,
  } = useAdminTeam();

  return (
    <main className="min-h-screen bg-[#F9FAF9] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
              Administration
            </p>

            <h1 className="text-4xl font-heading text-[#1A1A1A] md:text-5xl">
              Team
            </h1>

            <p className="mt-3 text-[#1A1A1A]/60">
              Manage your cleaning team and employee profiles.
            </p>
          </div>

          <Link
            to="/admin/team/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
          >
            Add Employee
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-8 rounded-2xl border border-[#2E7D32]/10 bg-white p-6">
            <p className="text-sm text-[#1A1A1A]/60">Loading employees...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats */}
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
                <p className="text-sm text-[#1A1A1A]/50">Total Employees</p>

                <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                  {stats.totalEmployees}
                </p>
              </div>

              <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
                <p className="text-sm text-[#1A1A1A]/50">Active Employees</p>

                <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                  {stats.activeEmployees}
                </p>
              </div>

              <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
                <p className="text-sm text-[#1A1A1A]/50">Public Profiles</p>

                <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                  {stats.publicProfiles}
                </p>
              </div>
            </div>

            {/* Filters */}
            <EmployeeFilters
              search={search}
              onSearchChange={setSearch}
              role={role}
              onRoleChange={setRole}
              location={location}
              onLocationChange={setLocation}
              roles={roles}
              locations={locations}
            />

            {/* Results */}
            {employees.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-[#1A1A1A]/50">
                  Showing{" "}
                  <span className="font-medium text-[#1A1A1A]">
                    {filteredEmployees.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[#1A1A1A]">
                    {employees.length}
                  </span>{" "}
                  employees
                </p>
              </div>
            )}

            {/* Employee list */}
            {filteredEmployees.length > 0 && (
              <div className="grid gap-4">
                {filteredEmployees.map((employee) => (
                  <EmployeeAdminCard
                    key={employee.id}
                    employee={employee}
                    onDelete={handleDeleteEmployee}
                  />
                ))}
              </div>
            )}

            {/* No employees */}
            {employees.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#2E7D32]/20 bg-white px-6 py-16 text-center">
                <h2 className="text-xl font-heading text-[#1A1A1A]">
                  No employees yet
                </h2>

                <p className="mt-2 text-sm text-[#1A1A1A]/50">
                  Add your first employee to start building the team.
                </p>

                <Link
                  to="/admin/team/new"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
                >
                  Add Employee
                </Link>
              </div>
            )}

            {/* No filter results */}
            {employees.length > 0 && filteredEmployees.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#2E7D32]/20 bg-white px-6 py-16 text-center">
                <h2 className="text-xl font-heading text-[#1A1A1A]">
                  No matching employees
                </h2>

                <p className="mt-2 text-sm text-[#1A1A1A]/50">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
