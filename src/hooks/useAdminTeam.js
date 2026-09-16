import { useEffect, useMemo, useState } from "react";

import { deleteEmployee, getEmployees } from "@/services/employeeService";

export default function useAdminTeam() {
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [location, setLocation] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEmployees() {
      try {
        setLoading(true);
        setError("");

        const data = await getEmployees();

        if (!active) {
          return;
        }

        setEmployees(data);
      } catch (error) {
        console.error("Could not load employees:", error);

        if (active) {
          setError("Could not load employees.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEmployees();

    return () => {
      active = false;
    };
  }, []);

  const roles = useMemo(() => {
    return [
      ...new Set(employees.map((employee) => employee.role).filter(Boolean)),
    ].sort();
  }, [employees]);

  const locations = useMemo(() => {
    return [
      ...new Set(
        employees.map((employee) => employee.location).filter(Boolean),
      ),
    ].sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        employee.name?.toLowerCase().includes(normalizedSearch) ||
        employee.role?.toLowerCase().includes(normalizedSearch) ||
        employee.location?.toLowerCase().includes(normalizedSearch) ||
        employee.employeeCode?.toLowerCase().includes(normalizedSearch);

      const matchesRole = role === "all" || employee.role === role;

      const matchesLocation =
        location === "all" || employee.location === location;

      return matchesSearch && matchesRole && matchesLocation;
    });
  }, [employees, search, role, location]);

  const stats = useMemo(() => {
    const activeEmployees = employees.filter(
      (employee) => employee.status === "active",
    ).length;

    const publicProfiles = employees.filter(
      (employee) =>
        employee.status === "active" && employee.publicProfile === true,
    ).length;

    return {
      totalEmployees: employees.length,
      activeEmployees,
      publicProfiles,
    };
  }, [employees]);

  async function handleDeleteEmployee(employee) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEmployee(employee.id);

      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (currentEmployee) => currentEmployee.id !== employee.id,
        ),
      );
    } catch (error) {
      console.error("Could not delete employee:", error);

      setError("Could not delete employee.");
    }
  }

  return {
    employees,
    filteredEmployees,

    search,
    setSearch,

    role,
    setRole,

    location,
    setLocation,

    roles,
    locations,

    stats,

    loading,
    error,

    handleDeleteEmployee,
  };
}
