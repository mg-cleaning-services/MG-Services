import employees from "@/data/employees.json";

export function getEmployees() {
  return employees;
}

export function getEmployeeById(id) {
  return employees.find((employee) => employee.id === id);
}

export function getEmployeeBySlug(slug) {
  return employees.find((employee) => employee.slug === slug);
}

export function getPublicEmployees() {
  return employees.filter(
    (employee) =>
      employee.status === "active" && employee.publicProfile === true,
  );
}

export function createEmployee(currentEmployees, employeeData) {
  const newEmployee = {
    ...employeeData,
    id: crypto.randomUUID(),
  };

  return [...currentEmployees, newEmployee];
}

export function updateEmployee(currentEmployees, updatedEmployee) {
  return currentEmployees.map((employee) =>
    employee.id === updatedEmployee.id ? updatedEmployee : employee,
  );
}

export function deleteEmployee(currentEmployees, employeeId) {
  return currentEmployees.filter((employee) => employee.id !== employeeId);
}

export function toggleEmployeeAvailability(currentEmployees, employeeId) {
  return currentEmployees.map((employee) =>
    employee.id === employeeId
      ? {
          ...employee,
          availability:
            employee.availability === "available" ? "unavailable" : "available",
        }
      : employee,
  );
}
