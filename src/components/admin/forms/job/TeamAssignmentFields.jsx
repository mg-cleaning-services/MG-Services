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
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {employee.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {employee.role}
                      </p>

                      {employee.employeeCode && (
                        <p className="mt-1 text-xs text-gray-400">
                          {employee.employeeCode}
                        </p>
                      )}
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

                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p>Phone: {employee.phone || "Not provided"}</p>

                    <p>Location: {employee.location || "Not provided"}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onDownloadIntroduction(employee)}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      Download Introduction
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendToCustomer(employee)}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      Send to Customer
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendJob(employee)}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      Send Job
                    </button>
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
