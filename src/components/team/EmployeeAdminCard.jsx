export default function EmployeeAdminCard({
  employee,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#2E7D32]/10 p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {/* Employee */}
        <div className="flex items-center gap-4 flex-1">
          <img
            src={employee.photo}
            alt={employee.name}
            className="w-16 h-16 rounded-xl object-cover"
          />

          <div>
            <h2 className="font-heading text-lg text-[#1A1A1A]">
              {employee.name}
            </h2>

            <p className="text-sm text-[#2E7D32]">{employee.role}</p>

            <p className="text-sm text-[#1A1A1A]/50">{employee.location}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onToggleAvailability(employee)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              employee.availability === "available"
                ? "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#d9efdb]"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {employee.availability === "available"
              ? "Available"
              : "Unavailable"}
          </button>
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              employee.publicProfile
                ? "bg-[#E8F5E9] text-[#2E7D32]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {employee.publicProfile ? "Public Profile" : "Private"}
          </span>

          <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 font-medium">
            {employee.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="px-4 py-2 rounded-lg border border-[#2E7D32]/20 text-sm font-medium text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(employee)}
            className="px-4 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
