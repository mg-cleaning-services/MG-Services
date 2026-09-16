import { supabase } from "@/lib/supabase";

function mapAssignmentFromDatabase(assignment) {
  return {
    jobId: assignment.job_id,
    employeeId: assignment.employee_id,
    assignedAt: assignment.assigned_at,

    employee: assignment.employees
      ? {
          id: assignment.employees.id,
          employeeCode: assignment.employees.employee_code,
          name: assignment.employees.name,
          role: assignment.employees.role,
          phone: assignment.employees.phone,
          email: assignment.employees.email,
          location: assignment.employees.location,
          photo: assignment.employees.photo_url,
          status: assignment.employees.status,
        }
      : null,
  };
}

export async function getJobAssignments(jobId) {
  const { data, error } = await supabase
    .from("job_assignments")
    .select(
      `
      job_id,
      employee_id,
      assigned_at,
      employees (
        id,
        employee_code,
        name,
        role,
        phone,
        email,
        location,
        photo_url,
        status
      )
    `,
    )
    .eq("job_id", jobId)
    .order("assigned_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapAssignmentFromDatabase);
}

export async function assignEmployeeToJob(jobId, employeeId) {
  const { data, error } = await supabase
    .from("job_assignments")
    .insert({
      job_id: jobId,
      employee_id: employeeId,
    })
    .select(
      `
      job_id,
      employee_id,
      assigned_at,
      employees (
        id,
        employee_code,
        name,
        role,
        phone,
        email,
        location,
        photo_url,
        status
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return mapAssignmentFromDatabase(data);
}

export async function removeEmployeeFromJob(jobId, employeeId) {
  const { error } = await supabase
    .from("job_assignments")
    .delete()
    .eq("job_id", jobId)
    .eq("employee_id", employeeId);

  if (error) {
    throw error;
  }

  return employeeId;
}
