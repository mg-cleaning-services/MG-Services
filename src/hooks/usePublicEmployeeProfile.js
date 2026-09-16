import { useEffect, useState } from "react";

import { getPublicEmployeeBySlug } from "@/services/employeeService";

export default function usePublicEmployeeProfile(slug) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEmployee() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicEmployeeBySlug(slug);

        if (!active) return;

        setEmployee(data);
      } catch (error) {
        console.error("Could not load public employee:", error);

        if (active) {
          setError("Could not load employee profile.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadEmployee();
    } else {
      setEmployee(null);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [slug]);

  return {
    employee,
    loading,
    error,
  };
}
