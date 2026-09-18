import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronDown, CircleX } from "lucide-react";

export default function EmployeeAvailabilitySelect({
  employees = [],
  value = "",
  onChange,
  checkingConflicts = false,
  getEmployeeJobConflicts,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedEmployee = employees.find(
    (employee) => String(employee.id) === String(value),
  );

  /*
  |--------------------------------------------------------------------------
  | CLOSE ON OUTSIDE CLICK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  function getConflicts(employeeId) {
    return getEmployeeJobConflicts?.(employeeId) || [];
  }

  function handleSelect(employee) {
    const conflicts = getConflicts(employee.id);

    if (conflicts.length > 0) {
      return;
    }

    onChange?.(employee.id);
    setOpen(false);
  }

  const isDisabled = disabled || checkingConflicts;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-left transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <div className="min-w-0">
          {checkingConflicts ? (
            <span className="text-sm text-gray-500">
              Checking availability...
            </span>
          ) : selectedEmployee ? (
            <div>
              <p className="truncate text-sm font-medium text-gray-900">
                {selectedEmployee.name}
              </p>

              <p className="truncate text-xs text-gray-500">
                {selectedEmployee.role}
              </p>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Select employee</span>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !isDisabled && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {employees.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-500">
              No active employees available.
            </div>
          ) : (
            <div className="space-y-1">
              {employees.map((employee) => {
                const conflicts = getConflicts(employee.id);

                const hasConflict = conflicts.length > 0;

                const isSelected = String(employee.id) === String(value);

                return (
                  <button
                    key={employee.id}
                    type="button"
                    disabled={hasConflict}
                    onClick={() => handleSelect(employee)}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      hasConflict
                        ? "cursor-not-allowed bg-red-50/50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {hasConflict ? (
                        <CircleX size={19} className="text-red-500" />
                      ) : (
                        <CheckCircle2 size={19} className="text-green-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {employee.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {employee.role}
                          </p>
                        </div>

                        {isSelected && !hasConflict && (
                          <Check
                            size={17}
                            className="shrink-0 text-[#2E7D32]"
                          />
                        )}
                      </div>

                      {hasConflict ? (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-red-600">
                            Unavailable
                          </p>

                          <div className="mt-1 space-y-1">
                            {conflicts.map((conflict) => (
                              <p
                                key={conflict.jobId}
                                className="text-xs text-red-500"
                              >
                                {conflict.jobCode || "Existing job"} ·{" "}
                                {conflict.startTime}–{conflict.endTime}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs font-medium text-green-600">
                          Available
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
