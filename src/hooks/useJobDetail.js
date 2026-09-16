import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getJobById, updateJob } from "@/services/jobService";
import { getEmployees } from "@/services/employeeService";

import {
  assignEmployeeToJob,
  getJobAssignments,
  removeEmployeeFromJob,
} from "@/services/jobAssignmentService";

export default function useJobDetail() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      try {
        setLoading(true);
        setLoadError("");

        const [jobData, employeeData, assignmentData] = await Promise.all([
          getJobById(id),
          getEmployees(),
          getJobAssignments(id),
        ]);

        if (ignore) {
          return;
        }

        setJob(jobData);
        setEmployees(employeeData);
        setAssignments(assignmentData);
      } catch (error) {
        console.error("Could not load job:", error);

        if (!ignore) {
          setLoadError("Could not load this job.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      ignore = true;
    };
  }, [id]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const assignedEmployeeIds = new Set(
    assignments.map((assignment) => String(assignment.employeeId)),
  );

  const availableEmployees = activeEmployees.filter(
    (employee) => !assignedEmployeeIds.has(String(employee.id)),
  );

  function updateJobSection(section, value) {
    setJob((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function updateJobField(field, value) {
    setJob((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveJob() {
    try {
      setSaving(true);
      setSaveMessage("");

      const updatedJob = {
        ...job,

        schedule: {
          ...job.schedule,
          estimatedHours:
            job.schedule.estimatedHours !== ""
              ? Number(job.schedule.estimatedHours)
              : null,
        },

        pricing: {
          ...job.pricing,
          finalPrice:
            job.pricing.finalPrice !== "" && job.pricing.finalPrice !== null
              ? Number(job.pricing.finalPrice)
              : null,
        },
      };

      const savedJob = await updateJob(updatedJob);

      setJob(savedJob);
      setSaveMessage("Job saved successfully.");

      return savedJob;
    } catch (error) {
      console.error("Could not save job:", error);
      setSaveMessage("Could not save job.");

      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function addEmployee() {
    if (!selectedEmployeeId) {
      return;
    }

    try {
      setAssignmentLoading(true);

      const newAssignment = await assignEmployeeToJob(
        job.id,
        selectedEmployeeId,
      );

      const nextAssignments = [...assignments, newAssignment];

      setAssignments(nextAssignments);
      setSelectedEmployeeId("");

      if (job.status === "unassigned") {
        const updatedJob = await updateJob({
          ...job,
          status: "assigned",
        });

        setJob(updatedJob);
      }
    } catch (error) {
      console.error("Could not assign employee:", error);
      alert("Could not assign this employee.");
    } finally {
      setAssignmentLoading(false);
    }
  }

  async function removeEmployee(employeeId) {
    try {
      setAssignmentLoading(true);

      await removeEmployeeFromJob(job.id, employeeId);

      const nextAssignments = assignments.filter(
        (assignment) => String(assignment.employeeId) !== String(employeeId),
      );

      setAssignments(nextAssignments);

      if (nextAssignments.length === 0 && job.status === "assigned") {
        const updatedJob = await updateJob({
          ...job,
          status: "unassigned",
        });

        setJob(updatedJob);
      }
    } catch (error) {
      console.error("Could not remove employee:", error);
      alert("Could not remove this employee.");
    } finally {
      setAssignmentLoading(false);
    }
  }

  return {
    job,
    employees,
    assignments,
    availableEmployees,

    selectedEmployeeId,
    setSelectedEmployeeId,

    loading,
    loadError,
    saving,
    saveMessage,
    assignmentLoading,

    updateJobSection,
    updateJobField,

    saveJob,
    addEmployee,
    removeEmployee,
  };
}
