import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEmployeeById, updateEmployee } from "@/services/employeeService";

export default function useEmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEmployee() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getEmployeeById(id);

        if (!active) {
          return;
        }

        setEmployee(data);
      } catch (error) {
        console.error("Could not load employee:", error);

        if (active) {
          setLoadError("Could not load employee.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEmployee();

    return () => {
      active = false;
    };
  }, [id]);

  async function saveEmployee(employeeData) {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      await updateEmployee(employeeData);

      navigate("/admin/team");
    } catch (error) {
      console.error("Could not update employee:", error);
      setSaveError("Could not save employee changes.");
    } finally {
      setSaving(false);
    }
  }

  return {
    employee,

    loading,
    loadError,

    saving,
    saveError,

    saveEmployee,
  };
}
