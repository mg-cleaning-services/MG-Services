import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createEmployee, updateEmployee } from "@/services/employeeService";

import { uploadEmployeePhoto } from "@/services/employeePhotoService";

export default function useCreateEmployee() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function createNewEmployee(employeeData, photoFile) {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      let createdEmployee = await createEmployee(employeeData);

      if (photoFile) {
        const uploadedPhoto = await uploadEmployeePhoto(
          createdEmployee.id,
          photoFile,
        );

        createdEmployee = await updateEmployee({
          ...createdEmployee,
          photo: uploadedPhoto.url,
        });
      }

      navigate(`/admin/team/${createdEmployee.id}`);
    } catch (error) {
      console.error("Could not create employee:", error);

      setSaveError(error?.message || "Could not create employee.");
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
