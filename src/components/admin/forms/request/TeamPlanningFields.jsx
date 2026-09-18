import { useState } from "react";

import EmployeeAvailabilitySelect from "@/components/admin/team/EmployeeAvailabilitySelect";

export default function TeamPlanningFields({
  employees,
  checkingConflicts,
  assignmentLoadingId,
  isEmployeeAssigned,
  getEmployeeJobConflicts,
  onToggleAssignment,
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  if (!employees.length) {
    return <p className="text-sm text-gray-500">No active employees found.</p>;
  }

  const assignedEmployees = employees.filter((employee) =>
    isEmployeeAssigned(employee.id),
  );

  const selectableEmployees = employees.filter(
    (employee) => !isEmployeeAssigned(employee.id),
  );

  async function handleAddEmployee() {
    if (!selectedEmployeeId) {
      return;
    }

    const conflicts = getEmployeeJobConflicts(selectedEmployeeId);

    if (conflicts.length > 0) {
      return;
    }

    await onToggleAssignment(selectedEmployeeId);

    setSelectedEmployeeId("");
  }

  async function handleRemoveEmployee(employeeId) {
    await onToggleAssignment(employeeId);
  }

  const selectedEmployeeLoading = assignmentLoadingId === selectedEmployeeId;

  return (
    <div className="space-y-6">
      {/* Availability notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs text-amber-800">
          Availability currently considers existing job conflicts only. Personal
          availability is not configured yet.
        </p>
      </div>

      {/* Employee selection */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-900">Add cleaner</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <EmployeeAvailabilitySelect
            employees={selectableEmployees}
            value={selectedEmployeeId}
            onChange={setSelectedEmployeeId}
            checkingConflicts={checkingConflicts}
            getEmployeeJobConflicts={getEmployeeJobConflicts}
            disabled={
              assignmentLoadingId !== null && assignmentLoadingId !== undefined
            }
          />

          <button
            type="button"
            disabled={
              !selectedEmployeeId ||
              selectedEmployeeLoading ||
              checkingConflicts
            }
            onClick={handleAddEmployee}
            className="rounded-xl bg-[#2E7D32] px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
          >
            {selectedEmployeeLoading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>

      {/* Planned team */}
      <div>
        <p className="text-sm font-semibold text-gray-900">
          Planned team ({assignedEmployees.length})
        </p>

        {assignedEmployees.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">
              No employees planned for this request yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {assignedEmployees.map((employee) => {
              const conflicts = getEmployeeJobConflicts(employee.id);

              const hasConflict = conflicts.length > 0;

              const loading = assignmentLoadingId === employee.id;

              return (
                <div
                  key={employee.id}
                  className={`rounded-xl border p-4 ${
                    hasConflict
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Photo */}
                    {employee.photo ? (
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] font-semibold text-[#2E7D32]">
                        {getInitials(employee.name)}
                      </div>
                    )}

                    {/* Employee */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {employee.name}
                          </p>

                          <p className="truncate text-sm text-gray-500">
                            {employee.role}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="shrink-0 text-sm font-medium text-red-600 disabled:opacity-50"
                        >
                          {loading ? "Removing..." : "Remove"}
                        </button>
                      </div>

                      {hasConflict ? (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-red-700">
                            Schedule conflict
                          </p>

                          <div className="mt-1 space-y-1">
                            {conflicts.map((conflict) => (
                              <p
                                key={conflict.jobId}
                                className="text-xs text-red-600"
                              >
                                {conflict.jobCode || "Another job"} ·{" "}
                                {conflict.startTime}–{conflict.endTime}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs font-medium text-green-700">
                          Available · Planned for this request
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
