import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEmployeeById, updateEmployee } from "@/services/employeeService";

import {
  deleteEmployeePhoto,
  getEmployeePhotoPath,
  uploadEmployeePhoto,
} from "@/services/employeePhotoService";

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

  async function saveEmployee(employeeData, photoFile) {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      let dataToSave = employeeData;
      let newPhotoPath = null;

      if (photoFile) {
        const uploadedPhoto = await uploadEmployeePhoto(
          employeeData.id,
          photoFile,
        );

        newPhotoPath = uploadedPhoto.path;

        dataToSave = {
          ...employeeData,
          photo: uploadedPhoto.url,
        };
      }

      try {
        await updateEmployee(dataToSave);
      } catch (error) {
        // DB failed after uploading the new image.
        // Remove the new image so it does not become orphaned.
        if (newPhotoPath) {
          try {
            await deleteEmployeePhoto(newPhotoPath);
          } catch (cleanupError) {
            console.error(
              "Could not clean up uploaded employee photo:",
              cleanupError,
            );
          }
        }

        throw error;
      }

      // DB now points to the new image.
      // The previous image can safely be removed.
      if (photoFile && employee?.photo) {
        const previousPhotoPath = getEmployeePhotoPath(employee.photo);

        if (previousPhotoPath) {
          try {
            await deleteEmployeePhoto(previousPhotoPath);
          } catch (cleanupError) {
            // The employee was saved successfully.
            // Failure to remove an old image should not make
            // the whole save appear to have failed.
            console.error(
              "Could not delete previous employee photo:",
              cleanupError,
            );
          }
        }
      }

      navigate("/admin/team");
    } catch (error) {
      console.error("Could not update employee:", error);

      setSaveError(error?.message || "Could not save employee changes.");
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
