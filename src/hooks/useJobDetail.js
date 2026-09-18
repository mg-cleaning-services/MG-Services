import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getJobById, updateJob } from "@/services/jobService";

import { getEmployees } from "@/services/employeeService";

import { getJobConflictsByEmployee } from "@/services/availabilityService";

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

  /*
  |--------------------------------------------------------------------------
  | OPERATIONAL AVAILABILITY
  |--------------------------------------------------------------------------
  */

  const [jobConflictsByEmployee, setJobConflictsByEmployee] = useState(
    new Map(),
  );

  const [checkingConflicts, setCheckingConflicts] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | GENERAL STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [assignmentLoading, setAssignmentLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | JOB CONFLICT CHECK
  |--------------------------------------------------------------------------
  |
  | Re-check whenever the Job service window changes.
  |
  | excludeJobId prevents the Job from conflicting
  | with itself.
  |
  */

  useEffect(() => {
    let ignore = false;

    async function checkJobConflicts() {
      const serviceDate = job?.schedule?.date;

      const startTime = job?.schedule?.startTime;

      const endTime = job?.schedule?.endTime;

      if (!serviceDate || !startTime || !endTime || endTime <= startTime) {
        setJobConflictsByEmployee(new Map());

        return;
      }

      try {
        setCheckingConflicts(true);

        const conflicts = await getJobConflictsByEmployee({
          serviceDate,
          startTime,
          endTime,
          excludeJobId: job.id,
        });

        if (!ignore) {
          setJobConflictsByEmployee(conflicts);
        }
      } catch (error) {
        console.error("Could not check job conflicts:", error);

        if (!ignore) {
          setJobConflictsByEmployee(new Map());
        }
      } finally {
        if (!ignore) {
          setCheckingConflicts(false);
        }
      }
    }

    checkJobConflicts();

    return () => {
      ignore = true;
    };
  }, [
    job?.id,
    job?.schedule?.date,
    job?.schedule?.startTime,
    job?.schedule?.endTime,
  ]);

  /*
  |--------------------------------------------------------------------------
  | EMPLOYEES
  |--------------------------------------------------------------------------
  */

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const assignedEmployeeIds = new Set(
    assignments.map((assignment) => String(assignment.employeeId)),
  );

  const availableEmployees = activeEmployees.filter(
    (employee) => !assignedEmployeeIds.has(String(employee.id)),
  );

  function getEmployeeJobConflicts(employeeId) {
    return jobConflictsByEmployee.get(employeeId) || [];
  }

  function hasEmployeeJobConflict(employeeId) {
    return getEmployeeJobConflicts(employeeId).length > 0;
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT JOB
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | SAVE JOB
  |--------------------------------------------------------------------------
  */

  async function saveJob() {
    if (!job) {
      return null;
    }

    if (
      !job.schedule?.date ||
      !job.schedule?.startTime ||
      !job.schedule?.endTime
    ) {
      setSaveMessage("Please enter the service date, start time and end time.");

      return null;
    }

    if (job.schedule.endTime <= job.schedule.startTime) {
      setSaveMessage("End time must be later than start time.");

      return null;
    }

    /*
     * If the Job already has assigned employees,
     * changing its schedule may create conflicts
     * with other Jobs.
     */
    const conflictingAssignments = assignments.filter((assignment) =>
      hasEmployeeJobConflict(assignment.employeeId),
    );

    if (conflictingAssignments.length > 0) {
      setSaveMessage(
        "One or more assigned employees have a conflicting job. Please review the team or schedule before saving.",
      );

      return null;
    }

    try {
      setSaving(true);
      setSaveMessage("");

      const updatedJob = {
        ...job,

        schedule: {
          ...job.schedule,

          estimatedLabourHours:
            job.schedule.estimatedLabourHours !== "" &&
            job.schedule.estimatedLabourHours !== null
              ? Number(job.schedule.estimatedLabourHours)
              : null,
        },

        pricing: {
          ...job.pricing,

          agreedPrice:
            job.pricing.agreedPrice !== "" && job.pricing.agreedPrice !== null
              ? Number(job.pricing.agreedPrice)
              : null,

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

  /*
  |--------------------------------------------------------------------------
  | ASSIGN EMPLOYEE
  |--------------------------------------------------------------------------
  */

  async function addEmployee() {
    if (!selectedEmployeeId || !job) {
      return;
    }

    if (hasEmployeeJobConflict(selectedEmployeeId)) {
      alert("This employee already has another job during this time.");

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

  /*
  |--------------------------------------------------------------------------
  | REMOVE EMPLOYEE
  |--------------------------------------------------------------------------
  */

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

    /*
     * Operational availability
     */
    jobConflictsByEmployee,
    checkingConflicts,
    getEmployeeJobConflicts,
    hasEmployeeJobConflict,

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
