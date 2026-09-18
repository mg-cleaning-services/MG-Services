import { supabase } from "@/lib/supabase";

/*
|--------------------------------------------------------------------------
| REQUEST ASSIGNMENTS
|--------------------------------------------------------------------------
|
| Preliminary employee planning during the Request stage.
|
| These assignments are NOT yet operational Job assignments.
| When the Request is converted to a Job, they will later be copied
| into job_assignments.
|
*/

/*
|--------------------------------------------------------------------------
| GET ASSIGNMENTS
|--------------------------------------------------------------------------
*/

export async function getRequestAssignments(requestId) {
  const { data, error } = await supabase
    .from("request_assignments")
    .select(
      `
      request_id,
      employee_id,
      assigned_at,
      employees (
        id,
        employee_code,
        name,
        role,
        photo_url,
        status
      )
    `,
    )
    .eq("request_id", requestId)
    .order("assigned_at", { ascending: true });

  if (error) {
    console.error("Error fetching request assignments:", error);

    throw error;
  }

  return (data || [])
    .map((assignment) => {
      const employee = assignment.employees;

      if (!employee) {
        return null;
      }

      return {
        requestId: assignment.request_id,
        employeeId: assignment.employee_id,
        assignedAt: assignment.assigned_at,

        employee: {
          id: employee.id,
          employeeCode: employee.employee_code,
          name: employee.name,
          role: employee.role,
          photo: employee.photo_url,
          status: employee.status,
        },
      };
    })
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| ASSIGN EMPLOYEE
|--------------------------------------------------------------------------
*/

export async function assignEmployeeToRequest(requestId, employeeId) {
  const { data, error } = await supabase
    .from("request_assignments")
    .insert({
      request_id: requestId,
      employee_id: employeeId,
    })
    .select(
      `
      request_id,
      employee_id,
      assigned_at
    `,
    )
    .single();

  if (error) {
    console.error("Error assigning employee to request:", error);

    throw error;
  }

  return {
    requestId: data.request_id,
    employeeId: data.employee_id,
    assignedAt: data.assigned_at,
  };
}

/*
|--------------------------------------------------------------------------
| REMOVE EMPLOYEE
|--------------------------------------------------------------------------
*/

export async function removeEmployeeFromRequest(requestId, employeeId) {
  const { error } = await supabase
    .from("request_assignments")
    .delete()
    .eq("request_id", requestId)
    .eq("employee_id", employeeId);

  if (error) {
    console.error("Error removing employee from request:", error);

    throw error;
  }

  return true;
}
