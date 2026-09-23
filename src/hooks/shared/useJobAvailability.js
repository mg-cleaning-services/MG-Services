import { useEffect, useState } from "react";

import { getJobConflictsByEmployee } from "@/services/availabilityService";

export default function useJobAvailability({
  serviceDate,
  startTime,
  endTime,
  excludeJobId = null,
}) {
  const [jobConflictsByEmployee, setJobConflictsByEmployee] = useState(
    new Map(),
  );

  const [checkingConflicts, setCheckingConflicts] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CHECK JOB CONFLICTS
  |--------------------------------------------------------------------------
  |
  | Re-check employee availability whenever the proposed service
  | window changes.
  |
  | excludeJobId is used when editing an existing Job so that
  | the Job does not conflict with itself.
  |
  */

  useEffect(() => {
    let ignore = false;

    async function checkJobConflicts() {
      if (!serviceDate || !startTime || !endTime || endTime <= startTime) {
        setJobConflictsByEmployee(new Map());
        setCheckingConflicts(false);

        return;
      }

      try {
        setCheckingConflicts(true);

        const conflicts = await getJobConflictsByEmployee({
          serviceDate,
          startTime,
          endTime,
          ...(excludeJobId ? { excludeJobId } : {}),
        });

        if (!ignore) {
          setJobConflictsByEmployee(conflicts);
        }
      } catch (error) {
        console.error("Could not check job conflicts:", error);

        if (!ignore) {
          setJobConflictsByEmployee(new Map());
        }
      } finally {
        if (!ignore) {
          setCheckingConflicts(false);
        }
      }
    }

    checkJobConflicts();

    return () => {
      ignore = true;
    };
  }, [serviceDate, startTime, endTime, excludeJobId]);

  /*
  |--------------------------------------------------------------------------
  | CONFLICT HELPERS
  |--------------------------------------------------------------------------
  */

  function getEmployeeJobConflicts(employeeId) {
    return (
      jobConflictsByEmployee.get(employeeId) ||
      jobConflictsByEmployee.get(String(employeeId)) ||
      []
    );
  }

  function hasEmployeeJobConflict(employeeId) {
    return getEmployeeJobConflicts(employeeId).length > 0;
  }

  return {
    jobConflictsByEmployee,
    setJobConflictsByEmployee,

    checkingConflicts,

    getEmployeeJobConflicts,
    hasEmployeeJobConflict,
  };
}
