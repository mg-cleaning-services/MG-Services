import EmployeeAvailabilitySelect from "@/components/admin/team/EmployeeAvailabilitySelect";

export default function TeamAssignmentFields({
  availableEmployees,
  assignments,
  selectedEmployeeId,
  assignmentLoading,
  checkingConflicts,
  getEmployeeJobConflicts,
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

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs text-amber-800">
          Availability currently considers existing job conflicts only. Personal
          availability is not configured yet.
        </p>
      </div>

      {/* Employee selector */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <EmployeeAvailabilitySelect
          employees={availableEmployees}
          value={selectedEmployeeId}
          onChange={onSelectedEmployeeChange}
          checkingConflicts={checkingConflicts}
          getEmployeeJobConflicts={getEmployeeJobConflicts}
          disabled={assignmentLoading}
        />

        <button
          type="button"
          disabled={
            !selectedEmployeeId || assignmentLoading || checkingConflicts
          }
          onClick={onAddEmployee}
          className="rounded-xl bg-[#2E7D32] px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
        >
          {assignmentLoading ? "Saving..." : "Add"}
        </button>
      </div>

      {/* Assigned employees */}
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

              const conflicts = getEmployeeJobConflicts?.(employee.id) || [];

              const hasConflict = conflicts.length > 0;

              return (
                <div
                  key={employee.id}
                  className={`overflow-hidden rounded-2xl border bg-white ${
                    hasConflict ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  {/* Conflict warning */}
                  {hasConflict && (
                    <div className="border-b border-red-200 bg-red-50 px-5 py-3">
                      <p className="text-sm font-medium text-red-700">
                        Schedule conflict
                      </p>

                      {conflicts.map((conflict) => (
                        <p
                          key={conflict.jobId}
                          className="mt-1 text-xs text-red-600"
                        >
                          {conflict.jobCode || "Another job"} ·{" "}
                          {conflict.startTime}–{conflict.endTime}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row">
                    {/* Employee photo */}
                    <div className="h-44 w-full shrink-0 sm:h-auto sm:w-40">
                      {employee.photo ? (
                        <img
                          src={employee.photo}
                          alt={employee.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-44 items-center justify-center bg-[#E8F5E9] text-2xl font-semibold text-[#2E7D32]">
                          {getInitials(employee.name)}
                        </div>
                      )}
                    </div>

                    {/* Employee information */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
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

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
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

                      {/* Job actions */}
                      <div className="mt-5 flex flex-wrap gap-3">
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
