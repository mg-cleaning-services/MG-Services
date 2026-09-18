import { supabase } from "@/lib/supabase";

/*
|--------------------------------------------------------------------------
| OPERATIONAL AVAILABILITY
|--------------------------------------------------------------------------
|
| Checks whether employees already have an assigned Job that overlaps
| with a proposed service window.
|
| Personal employee availability is NOT implemented here yet.
|
*/

function normalizeTime(time) {
  return time?.slice(0, 5) || "";
}

function mapConflictFromDatabase(job) {
  return {
    jobId: job.id,
    jobCode: job.job_code,
    serviceDate: job.service_date,
    startTime: normalizeTime(job.start_time),
    endTime: normalizeTime(job.end_time),
    status: job.status,
  };
}

/*
|--------------------------------------------------------------------------
| JOB CONFLICTS
|--------------------------------------------------------------------------
|
| Two time ranges overlap when:
|
| existing.start < proposed.end
| AND
| existing.end > proposed.start
|
| excludeJobId is useful when editing an existing Job.
| Without it, the Job would conflict with itself.
|
*/

export async function getEmployeeJobConflicts({
  serviceDate,
  startTime,
  endTime,
  excludeJobId = null,
}) {
  if (!serviceDate || !startTime || !endTime) {
    return [];
  }

  let query = supabase
    .from("jobs")
    .select(
      `
      id,
      job_code,
      service_date,
      start_time,
      end_time,
      status,
      job_assignments (
        employee_id
      )
    `,
    )
    .eq("service_date", serviceDate)
    .lt("start_time", endTime)
    .gt("end_time", startTime)
    .not("end_time", "is", null)
    .not("status", "in", '("completed","cancelled")');

  /*
   * When editing an existing Job, ignore that Job
   * during the conflict check.
   */
  if (excludeJobId) {
    query = query.neq("id", excludeJobId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error checking employee job conflicts:", error);

    throw error;
  }

  const conflicts = [];

  for (const job of data || []) {
    const jobConflict = mapConflictFromDatabase(job);

    for (const assignment of job.job_assignments || []) {
      conflicts.push({
        employeeId: assignment.employee_id,
        ...jobConflict,
      });
    }
  }

  return conflicts;
}

/*
|--------------------------------------------------------------------------
| EMPLOYEE CONFLICT LOOKUP
|--------------------------------------------------------------------------
|
| Returns:
|
| Map {
|   employeeId => [conflict, conflict, ...]
| }
|
*/

export async function getJobConflictsByEmployee(schedule) {
  const conflicts = await getEmployeeJobConflicts(schedule);

  const conflictsByEmployee = new Map();

  for (const conflict of conflicts) {
    const current = conflictsByEmployee.get(conflict.employeeId) || [];

    current.push(conflict);

    conflictsByEmployee.set(conflict.employeeId, current);
  }

  return conflictsByEmployee;
}
