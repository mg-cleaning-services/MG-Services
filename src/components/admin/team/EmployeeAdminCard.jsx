import { Link } from "react-router-dom";

export default function EmployeeAdminCard({ employee, onDelete }) {
  return (
    <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {/* Employee */}
        <div className="flex flex-1 items-center gap-4">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={employee.name}
              className="h-16 w-16 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#E8F5E9] text-xl font-semibold text-[#2E7D32]">
              {employee.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-lg text-[#1A1A1A]">
                {employee.name}
              </h2>

              {employee.employeeCode && (
                <span className="text-xs text-[#1A1A1A]/40">
                  {employee.employeeCode}
                </span>
              )}
            </div>

            <p className="text-sm text-[#2E7D32]">
              {employee.role || "Role not set"}
            </p>

            {employee.location && (
              <p className="text-sm text-[#1A1A1A]/50">{employee.location}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              employee.publicProfile
                ? "bg-[#E8F5E9] text-[#2E7D32]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {employee.publicProfile ? "Public Profile" : "Private"}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              employee.status === "active"
                ? "bg-[#E8F5E9] text-[#2E7D32]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {employee.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/admin/team/${employee.id}`}
            className="rounded-xl border border-[#2E7D32]/20 px-4 py-2 text-sm font-medium text-[#2E7D32] transition-colors hover:bg-[#E8F5E9]"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(employee)}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
