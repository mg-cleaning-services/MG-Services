export default function TeamAssignmentFields({
  availableEmployees,
  assignments,
  selectedEmployeeId,
  assignmentLoading,
  onSelectedEmployeeChange,
  onAddEmployee,
  onRemoveEmployee,
  onDownloadIntroduction,
  onSendToCustomer,
  onSendJob,
}) {
  return (
    <>
      <p className="text-sm text-gray-500">
        Assign one or more employees to this job.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedEmployeeId}
          onChange={(event) => onSelectedEmployeeChange(event.target.value)}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3"
        >
          <option value="">Select employee</option>

          {availableEmployees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} · {employee.role}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!selectedEmployeeId || assignmentLoading}
          onClick={onAddEmployee}
          className="rounded-xl bg-[#2E7D32] px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {assignmentLoading ? "Saving..." : "Add"}
        </button>
      </div>

      <div className="mt-7">
        <p className="text-sm font-semibold text-gray-900">
          Assigned team ({assignments.length})
        </p>

        {assignments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">No employees assigned yet.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {assignments.map((assignment) => {
              const employee = assignment.employee;

              if (!employee) {
                return null;
              }

              return (
                <div
                  key={employee.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="flex min-h-[220px] flex-col sm:flex-row">
                    {/* Employee photo */}
                    <div className="h-56 w-full shrink-0 sm:h-auto sm:w-52">
                      {employee.photo ? (
                        <img
                          src={employee.photo}
                          alt={employee.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-56 w-full items-center justify-center bg-[#E8F5E9] text-3xl font-semibold text-[#2E7D32]">
                          {getInitials(employee.name)}
                        </div>
                      )}
                    </div>

                    {/* Employee information */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-semibold text-gray-900">
                            {employee.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span>{employee.role}</span>

                            {employee.employeeCode && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-400">
                                  {employee.employeeCode}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={assignmentLoading}
                          onClick={() => onRemoveEmployee(employee.id)}
                          className="text-sm font-medium text-red-600 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-5 space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-800">
                            Phone:
                          </span>{" "}
                          {employee.phone || "Not provided"}
                        </p>

                        <p>
                          <span className="font-medium text-gray-800">
                            Location:
                          </span>{" "}
                          {employee.location || "Not provided"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex flex-wrap gap-3 pt-6">
                        <button
                          type="button"
                          onClick={() => onDownloadIntroduction(employee)}
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Download Introduction
                        </button>

                        <button
                          type="button"
                          onClick={() => onSendToCustomer(employee)}
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Send to Customer
                        </button>

                        <button
                          type="button"
                          onClick={() => onSendJob(employee)}
                          className="rounded-xl bg-[#2E7D32] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
                        >
                          Send Job
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function EmployeePhoto({ employee }) {
  if (employee.photo) {
    return (
      <img
        src={employee.photo}
        alt={employee.name}
        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E8F5E9] text-lg font-semibold text-[#2E7D32]">
      {getInitials(employee.name)}
    </div>
  );
}

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "MG"
  );
}
