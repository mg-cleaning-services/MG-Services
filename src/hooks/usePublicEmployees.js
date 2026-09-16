import { useEffect, useState } from "react";

import { getPublicEmployees } from "@/services/employeeService";

export default function usePublicEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEmployees() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicEmployees();

        if (!active) return;

        setEmployees(data);
      } catch (error) {
        console.error("Could not load public employees:", error);

        if (active) {
          setError("Could not load team members.");
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

  return {
    employees,
    loading,
    error,
  };
}
