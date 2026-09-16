import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createEmployee } from "@/services/employeeService";

export default function useCreateEmployee() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function createNewEmployee(employeeData) {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      const createdEmployee = await createEmployee(employeeData);

      navigate(`/admin/team/${createdEmployee.id}`);
    } catch (error) {
      console.error("Could not create employee:", error);
      setSaveError("Could not create employee.");
    } finally {
      setSaving(false);
    }
  }

  return {
    saving,
    saveError,
    createNewEmployee,
  };
}
